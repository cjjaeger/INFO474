// ScatterPlot
import * as d3 from 'd3';
import d3tip from 'd3-tip';
import miniDonutChart from './MiniDonutChart';

var DonutScatter = function() {
    // Set default values
    var height = 500,
        width = 900,
        xAccessor = 'x',
        yAccessor = 'y',
        nameAccessor = 'name',
        xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),
        xTitle = 'X Axis Title',
        yTitle = 'Y Axis Title',
        fill = 'green',
        onHover = () => null,
        radius = (d) => 5,
        margin = {
            left: 70,
            bottom: 50,
            top: 0,
            right: 50
        };

    // Function returned by ScatterPlot
    var chart = function(selection) {
        // Height/width of the drawing area itself
        var chartHeight = height - margin.bottom - margin.top;
        var chartWidth = width - margin.left - margin.right;

        var color = d3.scaleOrdinal(d3.schemeCategory20);

        // Iterate through selections, in case there are multiple
        selection.each(function(data) {

            // Use the data-join to create the svg (if necessary)
            var ele = d3.select(this);
            var svg = ele.selectAll("svg").data([data]);

            // Append static elements (i.e., only added once)
            var gEnter = svg.enter()
                            .append("svg")
                            .attr('width', width)
                            .attr("height", height)
                            .append("g");

            // g element for markers
            gEnter.append('g')
            .attr('transform', 'translate(' +  margin.left + ',' + margin.top + ')')
            .attr('height', chartHeight)
            .attr('width', chartWidth)
                    .attr('class', 'chartG');


            // Append axes to the gEnter element
            gEnter.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + (chartHeight + margin.top) + ')')
                .attr('class', 'axis x');

            gEnter.append('g')
                .attr('class', 'axis y')
                .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')

            // Add a title g for the x axis
            gEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + chartWidth/2) + ',' + (chartHeight + margin.top + 40) + ')')
                .attr('class', 'title x');

            // Add a title g for the y axis
            gEnter.append('text')
                .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + chartHeight/2) + ') rotate(-90)')
                .attr('class', 'title y');

            // Define xAxis and yAxis functions
            var xAxis = d3.axisBottom();
            var yAxis = d3.axisLeft();

            // Calculate x and y scales
            let xMax = d3.max(data, (d) => +d[xAccessor]) * 1.01;
            let xMin = d3.min(data, (d) => +d[xAccessor]) * .5;
            xScale.range([0, chartWidth]).domain([xMin, xMax]);

            var yMin = d3.min(data, (d) => +d[yAccessor]) * .5;
            var yMax = d3.max(data, (d) => +d[yAccessor]) * 1.05;
            yScale.range([chartHeight, 0]).domain([yMin, yMax]);

            if (!gEnter.empty()) {
              // This is the first render, run the intro!
              var firstCollege = data[Math.floor(Math.random() * data.length)];

              let donut = miniDonutChart()
                .firstSlice('pieParts')
                .sliceVal('value')
                .sliceCat('name')
                .width(200)
                .height(200)
                .donutThickness(50)
                .showLabels(true)
                .color(color);

              let chartG = ele.select('.chartG');

              let g = chartG.selectAll('g.donut')
                .data([firstCollege], d => d.id);

              g.enter()
                .append('g')
                  .attr('class', 'donut')
                  .attr('transform', 'translate(' + (chartWidth / 2) + ',' + (chartHeight / 2) + ')')
                  .call(donut);

              chartG.selectAll('g.donut')
                  .data([firstCollege], d => d.id)
                  .transition()
                  .delay(2000)
                  .duration(1500)
                  .attr('transform', 'translate(' + xScale(firstCollege[xAccessor]) + ', ' + yScale(firstCollege[yAccessor]) + ')')
                  .transition()
                  .duration(1500)
                  .call(donut.width(10).height(10).donutThickness(2).showLabels(false))
                  .on('end', renderCompleteChart);

              // Update axes
              xAxis.scale(xScale);
              yAxis.scale(yScale);
              ele.select('.axis.x').transition().duration(2000).call(xAxis);
              ele.select('.axis.y').transition().duration(2000).call(yAxis);

              // Update titles
              ele.select('.title.x').text(xTitle)
              ele.select('.title.y').text(yTitle)

              chartG.append('text')
                .attr('class', 'first-college-name')
                .attr('text-anchor', 'middle')
                .text(firstCollege.name)
                .attr('x', chartWidth / 2)
                .attr('y', (chartHeight / 2) - 120)
                .transition()
                .delay(2000)
                .remove();
            } else {
              renderCompleteChart();
            }

            function renderCompleteChart() {
              // Update axes
              xAxis.scale(xScale);
              yAxis.scale(yScale);
              ele.select('.axis.x').transition().duration(2000).call(xAxis);
              ele.select('.axis.y').transition().duration(2000).call(yAxis);

              // Update titles
              ele.select('.title.x').text(xTitle)
              ele.select('.title.y').text(yTitle)

              // Draw markers
              let gs = ele.select('.chartG').selectAll('g.donut').data(data, d => d.id);

              let donut = miniDonutChart()
                .firstSlice('pieParts')
                .sliceVal('value')
                .sliceCat('name')
                .width(10)
                .height(10)
                .donutThickness(2)
                .color(color);

              // Use the .enter() method to get entering elements, and assign initial position
              gs.enter().append('g')
                  .attr('class', 'donut')
                  .on('mouseover', d => {
                    ele.select('.chartG').selectAll('circle.enclosing-circle')
                      .data([d])
                      .enter()
                        .append('circle')
                        .attr('class', 'enclosing-circle')
                        .attr('cx', xScale(d[xAccessor]))
                        .attr('cy', yScale(d[yAccessor]))
                      .merge(ele.select('.chartG').select('circle.enclosing-circle'))
                        .attr('fill', 'none')
                        .attr('stroke-width', 1)
                        .attr('stroke', 'red')
                        .attr('r', 8)
                        .transition().duration(200)
                        .attr('cx', xScale(d[xAccessor]))
                        .attr('cy', yScale(d[yAccessor]));

                    // Exterior callback
                    onHover(d);
                  })
                  .attr('opacity', 0)
                  .merge(gs)
                  .attr('transform', (d) => {
                    return 'translate(' + xScale(d[xAccessor]) + ', ' + yScale(d[yAccessor]) + ')';
                  })
                  .call(donut)
                  .transition()
                  .duration(1500)
                  .delay(function(d, i) {
                    return (Math.random() * 500) + 500;
                  })
                  .attr('opacity', 1);

              // Use the .exit() and .remove() methods to remove elements that are no longer in the data
              gs.exit().remove();
            }
        });
    };

    chart.onHover = function(value) {
      if (!arguments.length) return onHover;
      onHover = value;
      return chart;
    };

    chart.xAccessor = function(value) {
      if (!arguments.length) return xAccessor;
      xAccessor = value;
      return chart;
    };

    chart.yAccessor = function(value) {
      if (!arguments.length) return yAccessor;
      yAccessor = value;
      return chart;
    };

    chart.nameAccessor = function(value) {
      if (!arguments.length) return nameAccessor;
      nameAccessor = value;
      return chart;
    };

    // Getter/setter methods to change locally scoped options
    chart.height = function(value){
      if (!arguments.length) return height;
      height = value;
      return chart;
    };

    chart.width = function(value){
      if (!arguments.length) return width;
      width = value;
      return chart;
    };

    chart.fill = function(value){
      if (!arguments.length) return fill;
      fill = value;
      return chart;
    };

    chart.xTitle = function(value){
      if (!arguments.length) return xTitle;
      xTitle = value;
      return chart;
    };

    chart.yTitle = function(value){
      if (!arguments.length) return yTitle;
      yTitle = value;
      return chart;
    };

    chart.radius = function(value){
      if (!arguments.length) return radius;
      radius = value;
      return chart;
    };

    return chart;
};


export default DonutScatter;
