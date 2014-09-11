
(function () {
    var app = angular.module('influenceGame', ['ngRoute']);

    /*
    Routes
    */
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/team-builder', {
            templateUrl: 'partials/team-builder.html',
            controller: 'TeamBuilderController',
            controllerAs: 'teamBuilder'
        }).
        when('/play-112th', {
            templateUrl: 'partials/play-112th.html'
        }).
        otherwise({
            redirectTo: '/team-builder'
        });
    }]);

    /*
    Initialization
    */
    app.run(['$location', function($location) {
        $location.path('/');
    }]);

    /*
    Game Controller
    */
    app.controller('GameController', ['$http', '$location', function($http, $location) {
        var that = this;

        this.teams = [];
        this.industries = {};
        this.bills = {};
        this.timeline = new PriorityQueue(function(l, r) {
            return l.date - r.date;
        });

        this.addTeams = function(teams) {
            this.teams = teams;
        };

        this.calcScore = function(teamname) {
            var i = arrayObjectIndexOf(this.teams, teamname, 'name');

            return 0;
        };

        this.loadBills = function(path, cb) {
            $http.get(path).success(function(data) {
                that.bills = data;
                cb();
            });
        };

        this.loadIndustries = function(path, cb) {
            $http.get(path).success(function(data) {
                that.industries = data;
                cb();
            });
        };

        this.initialize = function() {
            $location.path('/play-112th');
            this.filterUninvolvedBills();
            this.buildTimeline();
        };

        this.filterOverlappingVotes = function() {
            var overlap = [],
                actionIds = Object.getOwnPropertyNames(that.bills);

            for (var i = 0; i < actionIds.length; ++i) {
                for (var j = i + 1; j < actionIds.length; ++j) {
                    var k1 = actionIds[i],
                        k2 = actionIds[j],
                        v1 = that.bills[k1],
                        v2 = that.bills[k2];

                    if (v1 && v2 &&
                        v1['num'] == v2['num'] &&
                        v1['prefix'] == v2['prefix'] &&
                        v1['dateVote'] == v2['dateVote']) {

                        delete that.bills[k1];
                    }
                }
            }
        };

        this.filterUninvolvedBills = function() {
            var teamIndustries = [];
            for (var i = 0; i < this.teams.length; ++i) {
                teamIndustries = teamIndustries.concat(this.teams[i]['industries']);
            }

            for (var aid in this.bills) {
                var billIndustries = this.bills[aid]['positions']['support'].concat(this.bills[aid]['positions']['oppose']);


                if ($(billIndustries).filter(teamIndustries).length < 1) {
                    delete this.bills[aid];
                }
            }
        };

        this.buildTimeline = function() {
            this.filterOverlappingVotes();

            for (var aid in this.bills) {
                if (!this.bills.hasOwnProperty(aid)) {
                    continue;
                }

                this.timeline.enq({
                    action: 'introduced',
                    aid: aid,
                    date: this.bills[aid]['dateIntroduced']
                });

                var dateVote = this.bills[aid]['dateVote'];
                dateVote && this.timeline.enq({
                    action: 'vote',
                    aid: aid,
                    date: dateVote
                });
            }
        };
        
        this.loadResources = function() {
            // waiting for two independent datasets to load
            var timelineSemaphore = 2;

            this.loadBills('/data/112th-bills.json', function() {
                --timelineSemaphore;
                if (timelineSemaphore < 1) {
                    //that.buildTimeline();
                }
            });

            this.loadIndustries('/data/112th-industries.json', function() {
                --timelineSemaphore;
                if (timelineSemaphore < 1) {
                    //that.buildTimeline();
                }
            });
        };

        this.loadResources();
    }]);

    /*
    TeamBuilderController
    */
    app.controller('TeamBuilderController', ['$http', function($http) {
        this.newTeam = function() {
            return {
                industries: []
            }
        };

        this.addTeam = function() {
            this.teams.push(this.team);
            this.team = this.newTeam();
        };

        this.addRandomTeams = function(num) {
            var that = this;
            $http.get('/data/template-teams.json').success(function(randomTeamPool) {
                for (var num_teams = 0; num_teams < num; ++num_teams) {
                    // If the random team pool is exausted this loop will
                    // run forever. Even if there are still available options
                    // the loop might need to make an unreasonable number
                    // of guesses.
                    while (true) {
                        var i = getRandomInt(0, randomTeamPool.length);
                        if (arrayObjectIndexOf(that.teams, randomTeamPool[i]['name'], 'name') == -1) {
                            that.teams.push(randomTeamPool[i]);
                            break;
                        }
                    }
                }
            });
        };

        this.submitTeams = function(game) {
            game.addTeams(this.teams);
            game.initialize();
        };

        this.toggleIndustryInTeam = function(industry) {
            var industries = this.team.industries,
                i = industries.indexOf(industry);

            if (i > -1) {
                industries.splice(i, 1);
            } else {
                industries.length < 6 && industries.push(industry);
            }
        };

        this.industryInTeam = function(industry) {
            return this.team.industries.indexOf(industry) > -1;
        };

        this.teams = [];
        this.team = this.newTeam();

        this.addRandomTeams(2);
    }]);

})();
