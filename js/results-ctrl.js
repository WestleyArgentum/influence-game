(function () {

    angular.module('influenceGame').controller('ResultsController', ['$scope', '$http', 'gameModel', function($scope, $http, gameModel) {
        $scope.gameModel = gameModel;

        this.restart = function() {
            window.location.reload();
        }
    }]);

})();
