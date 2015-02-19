(function () {

    angular.module('influenceGame').controller('TeamBuilderController', ['$scope', '$http', '$location', 'gameModel', function($scope, $http, $location, gameModel) {
        var that = this;
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

        this.load_resources = function(cb) {
            resources = 2;

            $http.get('/data/112th-bills.json').success(function(data) {
                gameModel.bills = data;
                --resources <= 0 && cb();
            });
            $http.get('/data/crp-categories.json').success(function(data) {
                gameModel.industries = data;
                --resources <= 0 && cb();
            });
        }

        this.initialize = function() {
            this.load_resources(function() {
                that.addRandomTeams(2);
            });
        }

        this.playGame = function() {
            $location.path('/play-112th');
        }

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

        this.initialize();
    }]);

})();
