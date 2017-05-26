// Donut Chart
// https://bl.ocks.org/mbostock/3887235
import * as d3 from 'd3';

function donutChart() {

    // Set default values
    var width = 600,
        height = 600,
        margin = {top: 140, right:10, bottom:10, left:10},
        color = d3.scaleOrdinal(d3.schemeCategory20),
        padAngle = 0,
        cornerRadius = 0,
        sliceVal,
        sliceCat,
        title,
        showTooltip = true, // Boolean for tooltip
        showLabels = true // Boolean for labels;

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
                .innerRadius(radius - 50)
                .cornerRadius(cornerRadius)
                .padAngle(padAngle);

            // Create arc generator for labels
            var label = d3.arc()
                .outerRadius(radius + 10)
                .innerRadius(radius + 10);

            // Iterate through selections
            selection.each(function(data) {
                console.log(data);
                // Append svg through data-join if necessary
                var ele = d3.select(this);
                var svg = ele.selectAll('svg').data([data]);

                // Append svg to selection
                var svgEnter = svg.enter().append('svg')
                    .attr('width', width)
                    .attr('height', height);

                // Append chart title to svg
                svgEnter.append('text')
                    .attr('transform', 'translate(' + ((width - margin.left)/2) + ',' + 30 + ')')
                    .attr('class', 'chart-title')
                    .attr('text-anchor', 'middle')
                    .merge(svg.select('text.chart-title'))
                    .text(title);

                // Append tooltip text and style
                // http://bl.ocks.org/nnattawat/9368297
                var tooltip = svgEnter.append('text')
                    .attr('class', 'tooltip')
                    .attr('transform', 'translate(' + (width)/2 + ',' + height/2 + ')')
                    .style('text-anchor', 'middle')
                    .attr('font-weight', 'bold')
                    .style('font-size', '1.5em')
                    .merge(svg.select('text.tooltip'));

                // Append g to svg
                var g = svgEnter.append('g')
                    .attr('transform', 'translate(' + width/2 + "," + height/2 + ')')
                    .attr('class', 'chart-g')
                    .merge(svg.select('g.chart-g'));

                // Enter paths
                var path = g.selectAll('.path').data(pie(data));
                
                var pathGEnter = path
                    .enter().append('g').attr('class', 'path');
                
                // Function to calculate angle for text
                var getAngle = function (d) {
                    return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
                };
                
                // If showLabels is true, append and update text
                if(showLabels) {
                    // Rotate to prevent overlap
                    // http://stackoverflow.com/questions/14534024/preventing-overlap-of-text-in-d3-pie-chart
                    pathGEnter.append('text')
                        .merge(path.select('text'))
                        .attr("transform", function(d) {
                            return "translate(" + label.centroid(d) + ") rotate(" + getAngle(d) + ")";
                        })
                        .attr("dy", 5)
                        .style("text-anchor", "start")
                        .text(function(d) {
                            return d.data[sliceVal] === 0 ? "" : d.data[sliceCat];
                        });
                }
                
                pathGEnter
                    .append('path')
                    .attr('d', arc)
                    .attr('fill', function(d) {return color(d.data[sliceCat]); });

                // Update paths
                path.select('path').transition().duration(750)
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
                }


                // If showTooltip is true, display tooltip
                if(showTooltip) {
                    // Show tooltip on mouseover
                    path.on('mouseover', function(d) {
                        tooltip.html(d.data[sliceCat] + ': <tspan x="0" dy="1.2em">' + d.data[sliceVal] + '</tspan')
                            .style('display', 'block')
                            .attr('fill', color(d.data[sliceCat]));
                    })

                    // Hide tooltip on mouseout
                    path.on('mouseout', function() {
                        tooltip.style('display', 'none');
                    })
                }
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

    // Show labels accessor
    chart.showLabels = function(value) {
        if(!arguments.length) {return showLabels;}
        showLabels = value;
        return chart;
    }

    // Show tooltip accessor
    chart.showTooltip = function(value) {
        if(!arguments.length) {return showTooltip;}
        showTooltip = value;
        return chart;
    }

    return chart;
};

export default donutChart;
