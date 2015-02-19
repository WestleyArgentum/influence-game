
(function () {

    var app = angular.module('influenceGame', ['ngRoute', 'ui.bootstrap']);

    /*
    Routes
    */
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/team-builder', {
            templateUrl: 'partials/team-builder.html',
            controller: 'TeamBuilderController',
            controllerAs: 'teamBuilder'
        }).
        when('/play-112th', {
            templateUrl: 'partials/play-112th.html',
            controller: 'GameController',
            controllerAs: 'game'
        }).
        when('/results', {
            templateUrl: 'partials/results.html',
            controller: 'ResultsController',
            controllerAs: 'results'
        }).
        otherwise({
            redirectTo: '/team-builder'
        });
    }]);

    /*
    Initialization
    */
    app.run(['$location', function($location) {
        $location.path('/');
    }]);

    /*
    Game Service
    */
    app.service("gameModel", [function() {
        this.teams = [];
        this.industries = {};
        this.bills = {};
        this.timeline = [];
    }]);

})();
