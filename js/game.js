
(function () {
    var app = angular.module('influenceGame', ['ngRoute', 'ui.bootstrap']);

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
        when('/results', {
            templateUrl: 'partials/results.html',
            controller: 'ResultsController',
            controllerAs: 'results'
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
    Game Service
    */
    app.service("gameModel", [function() {
        this.teams = [];
        this.industries = {};
        this.bills = {};
        this.timeline = [];
    }]);

    /*
    Game Controller
    */
    app.controller('GameController', ['$scope', '$http', '$location', 'gameModel', function($scope, $http, $location, gameModel) {
        $scope.gameModel = gameModel;

        this.finishGame = function() {
            $location.path('/results');
        }

        this.addTeams = function(teams) {
            gameModel.teams = teams;
            for (var i = 0; i < gameModel.teams.length; ++i) {
                gameModel.teams[i]['id'] = i;
            }
        };

        this.scoreTeam = function(teamId) {
            var score = 0;
            for (var i = 0; i < gameModel.timeline.length; ++i) {
                score += this.scoreEventForTeam(gameModel.timeline[i], teamId);
            }
            return score;
        };

        this.scoreEventForTeam = function(event, teamId) {
            var team = gameModel.teams[teamId],
                bill = gameModel.bills[event.aid],
                score = 0,
                supportScore = 1,  // introduced, support
                opposeScore = 3;  // introduced, oppose

            if (event.action == 'vote') {
                if (bill.passed) {
                    supportScore = 12;  // passed, support
                    opposeScore = -6;  // passed, oppose
                } else {
                    supportScore = -6;  // failed, support
                    opposeScore = 12;  // failed, oppose
                }
            }

            for (var i = 0; i < team.industries.length; ++i) {
                bill.positions.support.indexOf(team.industries[i]) > -1 && (score += supportScore);
                bill.positions.opposed.indexOf(team.industries[i]) > -1 && (score += opposeScore);
            }

            return score;
        };

        this.loadBills = function(path, cb) {
            $http.get(path).success(function(data) {
                gameModel.bills = data;
                cb();
            });
        };

        this.loadIndustries = function(path, cb) {
            $http.get(path).success(function(data) {
                gameModel.industries = data;
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
                actionIds = Object.getOwnPropertyNames(gameModel.bills);

            for (var i = 0; i < actionIds.length; ++i) {
                for (var j = i + 1; j < actionIds.length; ++j) {
                    var k1 = actionIds[i],
                        k2 = actionIds[j],
                        v1 = gameModel.bills[k1],
                        v2 = gameModel.bills[k2];

                    if (v1 && v2 &&
                        v1['num'] == v2['num'] &&
                        v1['prefix'] == v2['prefix'] &&
                        v1['dateVote'] == v2['dateVote']) {

                        delete gameModel.bills[k1];
                    }
                }
            }
        };

        this.filterUninvolvedBills = function() {
            var teamIndustries = [];
            for (var i = 0; i < gameModel.teams.length; ++i) {
                teamIndustries = teamIndustries.concat(gameModel.teams[i]['industries']);
            }

            for (var aid in gameModel.bills) {
                if (!gameModel.bills.hasOwnProperty(aid)) {
                    continue;
                }

                var billIndustries = gameModel.bills[aid]['positions']['support'].concat(gameModel.bills[aid]['positions']['oppose']);


                if ($(billIndustries).filter(teamIndustries).length < 1) {
                    delete gameModel.bills[aid];
                }
            }
        };

        this.buildTimeline = function() {
            this.filterOverlappingVotes();

            for (var aid in gameModel.bills) {
                if (!gameModel.bills.hasOwnProperty(aid)) {
                    continue;
                }

                gameModel.timeline.push({
                    action: 'introduced',
                    aid: aid,
                    date: gameModel.bills[aid]['dateIntroduced']
                });

                var dateVote = gameModel.bills[aid]['dateVote'];
                dateVote && gameModel.timeline.push({
                    action: 'vote',
                    aid: aid,
                    date: dateVote
                });
            }

            gameModel.timeline.sort(function(l, r) {
                return l.date - r.date;
            });
        };

        this.glyphForBill = function(aid, event) {
            if (event == 'introduced') {
                return 'glyphicon-file';
            }

            var bill = gameModel.bills[aid];
            switch (bill['passed']) {
                case true:
                    return 'glyphicon-thumbs-up';

                case false:
                    return 'glyphicon-thumbs-down';

                default:
                    return 'glyphicon-file';
            }
        };
        
        this.loadResources = function() {
            this.loadBills('/data/112th-bills.json', function() {});
            this.loadIndustries('/data/crp-categories.json', function() {});
        };

        this.loadResources();
    }]);

    /*
    TeamBuilderController
    */
    app.controller('TeamBuilderController', ['$scope', '$http', 'gameModel', function($scope, $http, gameModel) {
        $scope.Math = window.Math;
        $scope.gameModel = gameModel;

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
                industries.push(industry);
            }
        };

        this.industryInTeam = function(industry) {
            return this.team.industries.indexOf(industry) > -1;
        };

        this.teams = [];
        this.team = this.newTeam();

        this.addRandomTeams(2);
    }]);

    app.controller('ResultsController', ['$http', function($http) {
        this.restart = function() {
            window.location.reload();
        }
    }]);

})();
