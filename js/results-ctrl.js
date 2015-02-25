(function () {

    angular.module('influenceGame').controller('ResultsController', ['$scope', '$http', 'gameModel', function($scope, $http, gameModel) {
        $scope.gameModel = gameModel;

        this.restart = function() {
            window.location.reload();
        };

        this.calculateIndustryStats = function() {
            var industryStats = {};

            for (var aid in gameModel.bills) {
                if (!gameModel.bills.hasOwnProperty(aid)) {
                    continue;
                }

                var bill = gameModel.bills[aid];
                var supporters = bill.positions.support;
                var opposers = bill.positions.oppose;

                var supportersScore = 1;
                var opposersScore = 3;

                if (bill.dateVote) {
                    if (bill.passed) {
                        supportersScore += 12;
                        opposersScore -= 6;
                    } else {
                        supportersScore -= 6;
                        opposersScore += 12;
                    }
                }

                for (var i = 0; i < supporters.length; ++i) {
                    var industry = supporters[i];
                    industryStats[industry] = industryStats[industry] || 0;
                    industryStats[industry] += supportersScore;
                }

                for (var i = 0; i < opposers.length; ++i) {
                    var industry = opposers[i];
                    industryStats[industry] = industryStats[industry] || 0;
                    industryStats[industry] += opposersScore;
                }
            }

            gameModel.industryStats = industryStats;
        };

        this.initialize = function() {
            this.calculateIndustryStats();
        };

        this.initialize();
    }]);

})();
