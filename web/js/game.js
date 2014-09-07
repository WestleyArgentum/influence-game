(function () {
    var app = angular.module("influenceGame", []);

    app.controller("GameController", function() {
        this.teams = [];
        this.industries = {};
        this.bills = {};
        this.timeline = [];

        app.addTeams = function(teams) {
            this.teams = teams;
        };

        this.loadBills = function(file) {
        };

        this.loadIndustries = function(file) {
        };
    });


    app.controller("TeamBuilderController", function() {
        this.teams = [];
    });

})();
