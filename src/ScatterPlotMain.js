$(function() {
    // Variables to show
    var xVar = 'graduationRate';
    var yVar = 'medianIncome';
    var chartData;

    // Load data in using d3's csv function.
    d3.csv("data.csv", function(error, data) {
        // Put data into generic terms
        var prepData = function() {
            chartData = data.map(function(d) {
                // console.log(d);
                return {
                    x: d[xVar],
                    y: d[yVar],
                    id: d.name
                };
            });
        };

        prepData();

        // Define function to draw ScatterPlot
        var scatter = ScatterPlot().xTitle('Graduation Rate (%)')
                                    .yTitle('Median Income ($)');

        // Create chart
        var chart = d3.select("#root")
            .datum(chartData)
            .call(scatter);

    });
});