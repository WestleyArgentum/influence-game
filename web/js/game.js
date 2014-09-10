
(function () {
    var app = angular.module('influenceGame', ['ngRoute']);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/team-builder', {
            templateUrl: 'partials/team-builder.html',
            controller: 'TeamBuilderController',
            controllerAs: 'teamBuilder'
        }).
        when('/play-112th', {
            templateUrl: 'partials/play-112th.html',
            controller: 'GameController',
            controllerAs: 'game'
        }).
        otherwise({
            redirectTo: '/team-builder'
        });
    }]);

    app.controller('GameController', ['$http', function($http) {
        this.addTeams = function(teams) {
            this.teams = teams;
        };

        this.loadBills = function(path) {
            var that = this;
            that.bills = {};

            $http.get(path).success(function(data) {
                that.bills = data;
            });
        };

        this.loadIndustries = function(path) {
            var that = this;
            that.industries = {};

            $http.get(path).success(function(data) {
                that.industries = data;
            });
        };

        this.teams = [];
        this.industries = this.loadIndustries('/data/112th-industries.json');
        this.bills = this.loadBills('/data/112th-bills.json');
        this.timeline = [];
    }]);

    app.controller('TeamBuilderController', ['$location', '$http', function($location, $http) {
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
            $location.path('/play-112th')
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
