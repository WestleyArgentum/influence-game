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

        this.addRandomTeams = function(num) {
            $http.get('/data/template-teams.json').success(function(randomTeamPool) {
                for (var num_teams = 0; num_teams < num; ++num_teams) {
                    // If the random team pool is exausted this loop will
                    // run forever. Even if there are still available options
                    // the loop might need to make an unreasonable number
                    // of guesses.
                    while (true) {
                        var i = getRandomInt(0, randomTeamPool.length);
                        if (arrayObjectIndexOf(gameModel.teams, randomTeamPool[i]['name'], 'name') == -1) {
                            gameModel.teams.push(randomTeamPool[i]);
                            break;
                        }
                    }
                }
            });
        };

        this.load_resources = function(cb) {
            var resources = 2;

            $http.get(gameModel.billDataFile).success(function(data) {
                gameModel.bills = data;
                --resources <= 0 && cb();
            });
            $http.get('/data/crp-categories.json').success(function(data) {
                gameModel.industries = data;
                --resources <= 0 && cb();
            });
        }

        this.initialize = function() {
            this.team = this.newTeam();
            this.load_resources(function() {
                that.addRandomTeams(3);
            });
        }

        this.playGame = function() {
            gameModel.teams.unshift(this.team);
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

        this.initialize();
    }]);

})();
