// Donut Chart
// https://bl.ocks.org/mbostock/3887235
import * as d3 from 'd3';

function donutChart() {

    // Set default values
    var width = 600,
        height = 600,
        margin = {top: 140, right:10, bottom:10, left:10},
        // Whether or not to center around 0,0
        centerAroundOrigin = false,
        color = d3.scaleOrdinal(d3.schemeCategory20),
        padAngle = 0,
        cornerRadius = 0,
        donutThickness = 50,
        firstSlice,
        sliceVal,
        sliceCat,
        title,
        showTooltip = true, // Boolean for tooltip
        showLabels = true; // Boolean for labels;

        // Function returned by chart
        function chart(context) {
            var isTransition = !!(context.selection);
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

            // Iterate through context
            context.each(function(data) {
                if (firstSlice) {
                  data = data[firstSlice];
                }

                var svg = d3.select(this);

                var svgEnter = svg.enter();

                // Append chart title to svg
                var chartTitle = svg.selectAll('text.title')
                    .data([data])
                    .enter()
                    .append('text');

                // Append tooltip text and style
                // http://bl.ocks.org/nnattawat/9368297
                var tooltip = svg.selectAll('text.donut-tooltip')
                    .data([data])
                    .enter()
                    .append('text');

                // Append g to svg
                var g = svg.selectAll('g.chart-g')
                    .data([data])
                    .enter()
                    .append('g')
                    .attr('class', 'chart-g');

                var existingTitle = svg.select('text.title');
                var existingTooltip = svg.select('text.donut-tooltip');
                var existingChartG = svg.select('g.chart-g');

                if (isTransition) {
                  chartTitle = chartTitle.transition(context);
                  tooltip = tooltip.transition(context);
                  g = g.transition(context);

                  existingTitle = existingTitle.transition(context);
                  existingTooltip = existingTooltip.transition(context);
                  existingChartG = existingChartG.transition(context);
                }

                chartTitle = chartTitle
                    .attr('class', 'title')
                    .attr('text-anchor', 'middle')
                    .merge(existingTitle)
                    .text(title);

                tooltip = tooltip
                    .attr('class', 'donut-tooltip')
                    .style('text-anchor', 'middle')
                    .attr('font-weight', 'bold')
                    .style('font-size', '1.5em')
                    .merge(existingTooltip);

                g = g
                    .merge(existingChartG);

                if (centerAroundOrigin) {
                  chartTitle
                    .attr('transform', 'translate(0,' + -(30 + height/2) + ')');
                } else {
                  g
                    .attr('transform', 'translate(' + width/2 + "," + height/2 + ')');

                  tooltip
                    .attr('transform', 'translate(' + width/2 + "," + height/2 + ')');

                  chartTitle
                    .attr('transform', 'translate(' + ((width - margin.left)/2) + ',' + 30 + ')')
                }

                // Enter paths
                var path = svg.select('g.chart-g').selectAll('.path').data(pie(data));

                var pathGEnter = path
                    .enter().append('g').attr('class', 'path');

                // Function to calculate angle for text
                var getAngle = function (d) {
                    d.perpendicular = (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
                    if (d.perpendicular > 90) {
                      return d.perpendicular + 180;
                    } else {
                      return d.perpendicular;
                    }
                };

                var getTextAnchor = function(d) {
                  if (d.perpendicular > 90) {
                    return 'end';
                  } else {
                    return 'start';
                  }
                };

                // If showLabels is true, append and update text
                if (showLabels) {
                    // Rotate to prevent overlap
                    // http://stackoverflow.com/questions/14534024/preventing-overlap-of-text-in-d3-pie-chart
                    var labels = pathGEnter.append('text');
                    var existingLabels = path.select('text');

                    if (isTransition) {
                      labels = labels.transition(context);
                      existingLabels = existingLabels.transition(context);
                    }

                    labels.merge(existingLabels)
                        .attr("transform", function(d) {
                            return "translate(" + label.centroid(d) + ") rotate(" + getAngle(d) + ")";
                        })
                        .attr("dy", 5)
                        .style("text-anchor", getTextAnchor)
                        .text(function(d) {
                            return d.data[sliceVal] === 0 ? "" : d.data[sliceCat];
                        });
                } else {
                  var labels = path.selectAll('text');

                  if (isTransition) {
                    // We want labels to be removed at the beginning, not the
                    // end, of a transition.
                    labels = labels.transition(context).duration(0);
                  }

                  labels.remove();
                }

                pathGEnter
                    .append('path')
                    .attr('d', arc)
                    .attr('fill', function(d) {return color(d.data[sliceCat]); });

                // Update paths
                var updating = path.select('path')

                if (isTransition) {
                  updating = updating.transition(context);
                }

                updating
                  .attr('d', arc);

                // Exit paths
                var exiting = path.exit();

                if (isTransition) {
                  exiting = exiting.transition(context);
                }

                exiting.remove();

                // Store angles and interpolate from current to new angles
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function(t) {
                      return arc(i(t));
                    };
                }


                // If showTooltip is true, display tooltip
                if (showTooltip) {
                    svg
                      .select('g.chart-g')
                      .selectAll('.path')
                      // Show tooltip on mouseover
                      .on('mouseover', function(d) {
                          tooltip.html(d.data[sliceCat] + ':<tspan x="0" dy="1.2em">' + d.data[sliceVal].toFixed(0) + '%</tspan')
                              .style('display', 'block')
                              .attr('fill', color(d.data[sliceCat]));
                      })
                      // Hide tooltip on mouseout
                      .on('mouseout', function() {
                          tooltip.style('display', 'none');
                      });
                } else {
                  // Hide the tooltip
                  tooltip.style('display', 'none');
                  // Remove listeners
                  svg
                    .select('g.chart-g')
                    .selectAll('.path')
                    .on('mouseover', null)
                    .on('mouseout', null);
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

    chart.donutThickness = function(value) {
      if(!arguments.length) {return donutThickness;}
      donutThickness = value;
      return chart;
    }

    chart.margin = function(value) {
      if (!arguments.length) {
        return margin;
      }
      margin = value;
      return chart;
    };

    chart.centerAroundOrigin = function(value) {
      if (!arguments.length) {
        return centerAroundOrigin;
      }
      centerAroundOrigin = value;
      return chart;
    };

    return chart;
};

export default donutChart;
