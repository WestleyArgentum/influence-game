(function () {
    /*
    Game Controller
    */
    angular.module('influenceGame').controller('GameController', ['$scope', '$http', '$location', 'gameModel', function($scope, $http, $location, gameModel) {
        $scope.gameModel = gameModel;

        this.finishGame = function() {
            $location.path('/results');
        };

        this.setupTeams = function() {
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

            // NOTE: Currently changes to this logic need to happen both here and
            // in the results controller.
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
                bill.positions.oppose.indexOf(team.industries[i]) > -1 && (score += opposeScore);
            }

            return score;
        };

        this.initialize = function() {
            this.setupTeams();
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

        this.linkForBill = function(aid) {
            var bill = gameModel.bills[aid],
                session = bill.session,
                prefix = bill.prefix,
                num = bill.num;

            return 'http://maplight.org/us-congress/bill/' + session + '-' + prefix + '-' + num + '/' + aid + '/total-contributions/'
        };

        this.initialize();
    }]);

})();
