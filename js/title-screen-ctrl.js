(function () {

    angular.module('influenceGame').controller('TitleScreenController', ['$scope', '$http', '$location', 'gameModel', function($scope, $http, $location, gameModel) {

        this.play112th = function() {
            $location.path('team-builder');
        };

        this.play113th = function () {
            $location.path('team-builder');
        };

    }]);

})();