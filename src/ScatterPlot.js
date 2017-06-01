import * as d3 from 'd3';

// ScatterPlot
var ScatterPlot = function() {
    // Set default values
    var height = 500,
        width = 800,
        xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),
        xTitle = 'X Axis Title',
        yTitle = 'Y Axis Title',
        title = '',
        radius = 6,
        margin = {
            left: 70,
            bottom: 50,
            top: 30,
            right: 10,
        },
        fill = d3.scaleOrdinal().range(d3.schemeCategory10),
        cValue = function(d) { return d.location; };

    // Function returned by ScatterPlot
    var chart = function(selection) {
        // Height/width of the drawing area itself
        var chartHeight = height - margin.bottom - margin.top;
        var chartWidth = width - margin.left - margin.right;

        // Iterate through selections, in case there are multiple
        selection.each(function(data) {
            // Use the data-join to create the svg (if necessary)
            var ele = d3.select(this);
            var svg = ele.selectAll("svg").data([data]);

            // Append static elements (i.e., only added once)
            var svgEnter = svg.enter()
                .append("svg")
                .attr('width', width)
                .attr("height", height)
                .attr('viewBox', `0 0 ${width} ${height}`);

            // Title G
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + 20 + ')')
                .text(title)
                .attr('class', 'chart-title')

            // g element for markers
            svgEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr("class", 'chartG');

            // Append axes to the svgEnter element
            svgEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + (chartHeight + margin.top) + ')')
                .attr('class', 'axis x');

            svgEnter.append('g')
                .attr('class', 'axis y')
                .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')

            // Add a title g for the x axis
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + (chartHeight + margin.top + 40) + ')')
                .attr('text-anchor', 'middle')
                .attr('class', 'title x');

            // Add a title g for the y axis
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + chartHeight / 2) + ') rotate(-90)')
                .attr('text-anchor', 'middle')
                .attr('class', 'title y');

            // Define xAxis and yAxis functions
            var xAxis = d3.axisBottom().tickFormat(d3.format(".0%"));

            var yAxis = d3.axisLeft().tickFormat(d3.format('$.2s'));

            // Calculate x and y scales
            var xMax = d3.max(data, (d) => +d.x) * 1.05;
            var xMin = d3.min(data, (d) => +d.x) * .95;
            xScale.range([0, chartWidth]).domain([xMin, xMax]);

            var yMin = d3.min(data, (d) => +d.y) * .95;
            var yMax = d3.max(data, (d) => +d.y) * 1.05;
            yScale.range([chartHeight, 0]).domain([yMin, yMax]);

            // Update axes
            xAxis.scale(xScale);
            yAxis.scale(yScale);
            ele.select('.axis.x').transition().duration(1000).call(xAxis);
            ele.select('.axis.y').transition().duration(1000).call(yAxis);

            // Update titles
            ele.select('.title.x').text(xTitle)
            ele.select('.title.y').text(yTitle)

            // Draw markers
            var circles = ele.select('.chartG').selectAll('circle').data(data, (d) => d.id);

            // Use the .enter() method to get entering elements, and assign initial position
            circles.enter().append('circle')
                .attr('fill', function(d) {
                    return fill(cValue(d));
                })
                .attr('cy', chartHeight)
                .style('opacity', .3)
                .attr('cx', (d) => xScale(d.x))
                // Transition properties of the + update selections
                .merge(circles)
                .attr('r', radius)
                .transition()
                .duration(800)
                .delay((d) => xScale(d.x) * 5)
                .attr('cx', (d) => xScale(d.x))
                .attr('cy', (d) => yScale(d.y));

            var legend = svgEnter.selectAll(".legend")
                .data(fill.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(-80," + i * 20 + ")"; });

            // draw legend colored rectangles
            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", fill);

            // draw legend text
            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) {
                    return d;
                });

            // Use the .exit() and .remove() methods to remove elements that are no longer in the data
            circles.exit().remove();
        });
    };

    // Getter/setter methods to change locally scoped options
    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.fill = function(value) {
        if (!arguments.length) return fill;
        fill = value;
        return chart;
    };

    chart.xTitle = function(value) {
        if (!arguments.length) return xTitle;
        xTitle = value;
        return chart;
    };

    chart.yTitle = function(value) {
        if (!arguments.length) return yTitle;
        yTitle = value;
        return chart;
    };
    chart.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    };

    return chart;
};

export default ScatterPlot;
