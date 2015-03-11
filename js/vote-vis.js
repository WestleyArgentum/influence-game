(function () {
    angular.module('influenceGame').directive('voteVis', function () {
        var margin = {
            top: 12,
            left: 15,
            right: 15,
            bottom: 14
        };

        var width = 400 - margin.left - margin.right;
        var height = 50 - margin.top - margin.bottom;

        return {
            restrict: 'E',

            scope: {
                industry: '='
            },

            link: function (scope, element, attrs) {
                var industry = scope.industry;

                var dataset = [
                    [{
                        x: 0,
                        y: industry.supported_inaction + industry.opposed_inaction
                    }],
                    [{
                        x: 0,
                        y: industry.supported_lost + industry.opposed_lost
                    }],
                    [{
                        x: 0,
                        y: industry.supported_won + industry.opposed_won
                    }]
                ];

                var stack = d3.layout.stack();
                stack(dataset);

                var xScale = d3.scale.linear()
                    .domain([0, d3.max(dataset, function (d) {
                        return d3.max(d, function (d) {
                            return d.y0 + d.y;
                        });
                    })])
                    .range([0, width]);

                var color = d3.scale.category10();

                var svg = d3.select(element[0])
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var groups = svg.selectAll("g")
                    .data(dataset)
                    .enter()
                    .append("g")
                    .style("fill", function (d, i) {
                        return color(i);
                    });

                var rects = groups.selectAll("rect")
                    .data(function (d) {
                        return d;
                    })
                  .enter()
                  .append("rect")
                    .attr("x", function (d) {
                        return xScale(d.y0);
                    })
                    .attr("y", 0)
                    .attr("height", 20)
                    .attr("width", function (d) {
                        return xScale(d.y);
                    })
            }
        };
    });

})();
