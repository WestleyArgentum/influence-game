(function () {

    angular.module('influenceGame').controller('ResultsController', ['$scope', '$http', 'gameModel', function($scope, $http, gameModel) {
        $scope.gameModel = gameModel;

        this.restart = function() {
            window.location.reload();
        };

        this.calculateIndustryStats = function() {
            var industryStats = {};
            for (var i = 0; i < gameModel.industries.length; ++i) {
                industryStats[gameModel.industries[i]] = {
                    'score': 0,
                    'bills_supported': 0,
                    'bills_opposed': 0,
                    'votes_won': 0,
                    'votes_lost': 0,
                    'supported_won': 0,
                    'supported_lost': 0,
                    'supported_inaction': 0,
                    'opposed_won': 0,
                    'opposed_lost': 0,
                    'opposed_inaction': 0
                };
            }

            for (var aid in gameModel.bills) {
                if (!gameModel.bills.hasOwnProperty(aid)) {
                    continue;
                }

                var bill = gameModel.bills[aid];
                var supporters = bill.positions.support;
                var opposers = bill.positions.oppose;

                var supportersScore = 1;
                var opposersScore = 3;
                var vote_favors = 'inaction';

                // TODO: This logic is duplicated in the game controller,
                // the two should really be consolidated into some sort of
                // ruleset that can be shared.
                if (bill.dateVote) {
                    if (bill.passed) {
                        supportersScore += 12;
                        opposersScore -= 6;
                        vote_favors = 'supporters';
                    } else {
                        supportersScore -= 6;
                        opposersScore += 12;
                        vote_favors = 'opposers';
                    }
                }

                for (var i = 0; i < supporters.length; ++i) {
                    var industry = supporters[i];
                    var stats = industryStats[industry];

                    stats.score += supportersScore;
                    stats.bills_supported += 1;

                    switch (vote_favors) {
                        case 'supporters':
                            stats.votes_won += 1;
                            stats.supported_won += 1;
                            break;

                        case 'opposers':
                            stats.votes_lost += 1;
                            stats.supported_lost += 1;
                            break;

                        case 'inaction':
                            stats.supported_inaction += 1;
                            break;
                    }
                }

                for (var i = 0; i < opposers.length; ++i) {
                    var industry = opposers[i];
                    var stats = industryStats[industry];

                    stats.score += opposersScore;
                    stats.bills_opposed += 1;

                    switch (vote_favors) {
                        case 'supporters':
                            stats.votes_lost += 1;
                            stats.opposed_lost += 1;
                            break;

                        case 'opposers':
                            stats.votes_won += 1;
                            stats.opposed_won += 1;
                            break;

                        case 'inaction':
                            stats.opposed_inaction += 1;
                            break;
                    }
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
