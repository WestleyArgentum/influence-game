(function () {
    var app = angular.module('influenceGame', ['ngRoute']);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/team-builder', {
            templateUrl: 'partials/team-builder.html',
            controller: 'TeamBuilderController',
            controllerAs: 'teamBuilder'
        }).
        otherwise({
            redirectTo: '/team-builder'
        });
    }]);

    app.controller('GameController', function() {
        this.teams = [];
        this.industries = {};
        this.bills = {};
        this.timeline = [];

        this.addTeams = function(teams) {
            this.teams = teams;
        };

        this.loadBills = function(file) {
        };

        this.loadIndustries = function(file) {
        };
    });

    app.controller('TeamBuilderController', function() {
        this.teams = [];
        this.team = {
            industries: []
        };

        this.addTeam = function() {
            this.teams.push(team);
        };

        this.submitTeams = function(game) {
            game.addTeams(this.teams);
            console.log("*** redirect to gameplay page ***");
        };
    });

})();
