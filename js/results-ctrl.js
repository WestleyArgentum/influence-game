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

                var supportersScore = bill.passed ? 13 : -5;
                var opposersScore = bill.passed ? -3 : 15;

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
