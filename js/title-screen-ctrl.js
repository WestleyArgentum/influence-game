(function () {

    angular.module('influenceGame').controller('TitleScreenController', ['$scope', '$http', '$location', 'gameModel', function($scope, $http, $location, gameModel) {
        $scope.gameModel = gameModel;

        this.play112th = function() {
            gameModel.billDataFile = '/data/112th-bills.json';
            $location.path('team-builder');
        };

        this.play113th = function () {
            gameModel.billDataFile = '/data/113th-bills.json';
            $location.path('team-builder');
        };

    }]);

})();