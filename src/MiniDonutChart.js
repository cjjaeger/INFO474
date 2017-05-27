// Donut Chart
// https://bl.ocks.org/mbostock/3887235
import * as d3 from 'd3';

function miniDonutChart() {

    // Set default values
    var width = 600,
        height = 600,
        margin = {top: 0, right: 0, bottom: 0, left: 0},
        color = d3.scaleOrdinal(d3.schemeCategory20),
        padAngle = 0,
        cornerRadius = 0,
        donutThickness = 50,
        firstSlice = null,
        sliceVal,
        sliceCat,
        showLabels = false,
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
                .innerRadius(radius - donutThickness)
                .cornerRadius(cornerRadius)
                .padAngle(padAngle);

            // Create arc generator for labels
            var label = d3.arc()
                .outerRadius(radius + 10)
                .innerRadius(radius + 10);

            // Iterate through selections
            selection.each(function(data) {
                // Append svg through data-join if necessary
                var g = d3.select(this);

                if (firstSlice) {
                  data = data[firstSlice];
                }

                // Enter paths
                var path = g.selectAll('g.path')
                    .data(pie(data));

                var pathGEnter = path
                    .enter().append('g')
                    .attr('class', 'path');

                pathGEnter
                        .append('path')
                        .attr('d', arc)
                        .attr('opacity', 0.7)
                        .attr('fill', function(d) {
                          return color(d.data[sliceCat]);
                        });

                // Update paths
                path.select('path').transition().delay(2000).duration(2000)
                    .attr('d', function(d) {
                      return arc(d);
                    });//, arcTween);

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

                // Function to calculate angle for text
                var getAngle = function (d) {
                    return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
                };

                // If showLabels is true, append and update text
                if (showLabels) {
                    // Rotate to prevent overlap
                    // http://stackoverflow.com/questions/14534024/preventing-overlap-of-text-in-d3-pie-chart
                    pathGEnter.append('text')
                        .merge(path.selectAll('text'))
                        .attr("transform", function(d) {
                            return "translate(" + label.centroid(d) + ") rotate(" + getAngle(d) + ")";
                        })
                        .attr("dy", 5)
                        .style("text-anchor", "start")
                        .text(function(d) {
                            return d.data[sliceVal] === 0 ? "" : d.data[sliceCat];
                        });
                } else {
                  path.selectAll('text').transition().duration(2000).remove();
                }
            });
        };

    // Define accessors for variables
    // If called without argument, method returns variable value

    chart.firstSlice = function(value) {
      if(!arguments.length) {return firstSlice;}
      firstSlice = value;
      return chart;
    };

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

    chart.donutThickness = function(value) {
        if(!arguments.length) {return donutThickness};
        donutThickness = value;
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

    chart.showLabels = function(value) {
        if(!arguments.length) {return showLabels;}
        showLabels = value;
        return chart;
    }

    return chart;
};

export default miniDonutChart;
