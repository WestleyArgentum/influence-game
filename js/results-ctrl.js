(function () {

    angular.module('influenceGame').controller('ResultsController', ['$http', function($http) {
        this.restart = function() {
            window.location.reload();
        }
    }]);

})();
