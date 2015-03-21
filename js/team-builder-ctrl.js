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

        this.isValidTeam = function() {
            return this.team.industries.length > 0 && this.team.name;
        };

        this.addRandomTeams = function() {
            $http.get('/data/template-teams.json').success(function(templateTeamData) {
                var teamSets = templateTeamData['team-sets'];
                var teamSet = teamSets[getRandomInt(0, teamSets.length)];

                for (var i = 0; i < teamSet.length; ++i) {
                    gameModel.teams.push({
                        name: teamSet[i],
                        industries: templateTeamData['template-teams'][teamSet[i]]
                    });
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
                that.addRandomTeams();
            });
        }

        this.playGame = function() {
            $scope.loading = true;
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
