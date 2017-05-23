// Donut Chart
// https://bl.ocks.org/mbostock/3887235
import * as d3 from 'd3';

function donutChart() {

    // Set default values
    var width = 600,
        height = 600,
        margin = {top: 0, right:0, bottom:0, left:0},
        color = d3.scaleOrdinal(d3.schemeCategory20),
        padAngle = 0,
        cornerRadius = 0,
        sliceVal,
        sliceCat,
        title;

        // Function returned by chart
        function chart(selection) {
            // Chart dimension variables
            var chartWidth = (width - margin.left - margin.right);
            var chartHeight = (height - margin.top - margin.bottom);

            // Radius variable
            var radius = Math.min(chartWidth, chartHeight)/2;

            // Create pie generator
            // Returns value or 0 if data is missing
            var pie = d3.pie()
                .value(function(d) { return +d[sliceVal] || 0; })
                .sort(null);

            // Create arc generator for slices
            var arc = d3.arc()
                .outerRadius(radius)
                .innerRadius(radius - 3)
                .cornerRadius(cornerRadius)
                .padAngle(padAngle);

            console.log(selection);
            // Iterate through selections
            selection.each(function(data) {
                console.log(data);
                // Append svg through data-join if necessary
                var g = d3.select(this);
                // Enter paths
                var path = g.selectAll('.path')
                    .datum(data).data(pie)
                    .enter().append('g')
                    .attr('class', 'path')
                        .append('path')
                        .attr('d', arc)
                        .attr('fill', function(d) {
                          return color(d.data[sliceCat]); 
                        });

                // Update paths
                path.transition().duration(750)
                    .attrTween('d', arcTween);

                // Exit paths
                path.exit().remove();

                // Store angles and interpolate from current to new angles
                function arcTween(a) {
                  var i = d3.interpolate(this._current, a);
                  this._current = i(0);
                  return function(t) {
                      return arc(i(t));
                  };
                };
            });
        };

    // Define accessors for variables
    // If called without argument, method returns variable value

    // Width accessor
    chart.width = function(value) {
        if(!arguments.length) {return width;}
        width = value;
        return chart;
    };

    // Height accessor
    chart.height = function(value) {
        if(!arguments.length) {return height};
        height = value;
        return chart;
    };

    // Chart title accessor
    chart.title = function(value) {
        if(!arguments.length) {return title;}
        title = value;
        return chart;
    };

    // Color accessor
    chart.color = function(value) {
        if(!arguments.length) {return color;}
        color = value;
        return chart;
    };

    // Slice values accessor
    chart.sliceVal = function(value) {
        if(!arguments.length) {return sliceVal;}
        sliceVal = value;
        return chart;
    };

    // Pad angle accessor
    chart.padAngle = function(value) {
        if(!arguments.length) {return padAngle;}
        padAngle = value;
        return chart;
    };

    // Slice category accessor
    chart.sliceCat = function(value) {
        if(!arguments.length) {return sliceCat;}
        sliceCat = value;
        return chart;
    };

    // Corner radius accessor
    chart.cornerRadius = function(value) {
        if(!arguments.length) {return cornerRadius;}
        cornerRadius = value;
        return chart;
    }

    return chart;
};

export default donutChart;
