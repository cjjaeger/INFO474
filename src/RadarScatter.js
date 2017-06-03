// ScatterPlot
import * as d3 from 'd3';
import * as d3a from 'd3-svg-annotation';
import d3tip from 'd3-tip';
import radarChart from './RadarChart';

var RadarScatter = function() {
    // Set default values
    var height = 500,
        width = 900,
        xAccessor = 'x',
        yAccessor = 'y',
        nameAccessor = 'name',
        xScale = d3.scaleLog().base(5),
        yScale = d3.scaleLinear(),
        xTitle = 'X Axis Title',
        yTitle = 'Y Axis Title',
        xAxisTickFormat = d3.format(".0"),
        yAxisTickFormat = d3.format(".0"),
        fill = 'green',
        onHover = () => null,
        introDisabled,
        onIntroEnd = () => null,
        radarIntro,
        xAxisIntro,
        yAxisIntro,
        manuallyEnclosed,
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
                            .attr('viewBox', `0 0 ${width} ${height}`)
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
                .attr('text-anchor', 'middle')
                .attr('transform', 'translate(' + (margin.left + chartWidth/2) + ',' + (chartHeight + margin.top + 40) + ')')
                .attr('class', 'title x');

            // Add a title g for the y axis
            gEnter.append('text')
                .attr('text-anchor', 'middle')
                .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + chartHeight/2) + ') rotate(-90)')
                .attr('class', 'title y');

            // Define xAxis and yAxis functions
            var xAxis = d3.axisBottom().tickFormat(xAxisTickFormat);
            var yAxis = d3.axisLeft().tickFormat(yAxisTickFormat);

            // Calculate x and y scales
            let xMax = d3.max(data, (d) => +d[xAccessor]) * 1.01;
            let xMin = d3.min(data, (d) => +d[xAccessor]) * .5;
            xScale.range([0, chartWidth]).domain([xMin, xMax]);

            var yMin = d3.min(data, (d) => +d[yAccessor]) * .5;
            var yMax = d3.max(data, (d) => +d[yAccessor]) * 1.05;
            yScale.range([chartHeight, 0]).domain([yMin, yMax]);

            if (!gEnter.empty() && !introDisabled) {
              // This is the first render, run the intro!
              var firstCollege = data[Math.floor(Math.random() * data.length)];

              let radar = radarChart()
                          .width(200)
                          .height(200)
                          .margin({
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0
                          })
                          .maxValue(100)
                          // Center around the origin! (around the middle of the g)
                          .centerAroundOrigin(true)
                          .firstSlice('radarData');

              var radarIntroAnnotation = d3a.annotation()
                .type(d3a.annotationCalloutCircle)
                .annotations([{
                  note: radarIntro(firstCollege),
                  subject: {
                    radius: 105
                  },
                  x: chartWidth / 2,
                  y: chartHeight / 2,
                  dy: 70,
                  dx: 110
                }]);

              var xAxisIntroAnnotation = d3a.annotation()
                .type(d3a.annotationCalloutCircle)
                .annotations([{
                  note: xAxisIntro(firstCollege),
                  subject: {
                    radius: 10
                  },
                  x: xScale(firstCollege[xAccessor]),
                  y: chartHeight,
                  dy: -50,
                  dx: -50
                }]);

              var yAxisIntroAnnotation = d3a.annotation()
                .type(d3a.annotationCalloutCircle)
                .annotations([{
                  note: yAxisIntro(firstCollege),
                  subject: {
                    radius: 10
                  },
                  x: 0,
                  y: yScale(firstCollege[yAccessor]),
                  dy: 0,
                  dx: 20
                }]);

              let chartG = ele.select('.chartG');

              let g = chartG.selectAll('g.radar')
                            .data([firstCollege], d => d.id);

              g.enter()
                .append('g')
                  .attr('class', 'radar')
                  .attr('transform', 'translate(' + (chartWidth / 2) + ',' + (chartHeight / 2) + ')')
                  .call(radar);

              chartG.selectAll('g.radar')
                  .data([firstCollege], d => d.id)
                  .transition()
                    .delay(4000)
                    .duration(4000)
                    .on('start', () => {
                      chartG.select('.annotations')
                        .call(xAxisIntroAnnotation);

                      ele.select('.axis.x')
                        .transition()
                        .duration(2000)
                        .call(xAxis);

                      ele.select('.title.x')
                        .text(xTitle);
                    })
                    .attr('transform', 'translate(' + xScale(firstCollege[xAccessor]) + ', ' + (chartHeight / 2) + ')')
                  .transition()
                    .duration(4000)
                    .on('start', () => {
                      chartG.select('.annotations')
                        .call(yAxisIntroAnnotation);

                      ele.select('.axis.y')
                        .transition()
                        .duration(2000)
                        .call(yAxis);

                      ele.select('.title.y')
                        .text(yTitle);
                    })
                    .attr('transform', 'translate(' + xScale(firstCollege[xAccessor]) + ', ' + yScale(firstCollege[yAccessor]) + ')')
                  .transition()
                    .duration(1500)
                    .on('start', () => {
                      chartG.select('.annotations')
                        .remove();
                    })
                    .call(
                      radar
                        .width(10)
                        .height(10)
                        // Center around the origin! (around the middle of the g)
                        .centerAroundOrigin(true)
                        // Customize the chart for being tiny!
                        .lineThickness(1)
                        .showVertice(false)
                        .showLevelLabel(false)
                        .showAxesLabel(false)
                        .showLevel(false)
                        .showAxes(false)
                        .margin({
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0
                        })
                        // ... or whatever you want to do
                    )
                    .on('end', () => {
                      onIntroEnd();
                      renderCompleteChart();
                    });

              // Update axes
              xAxis.scale(xScale);
              yAxis.scale(yScale);

              chartG
                .append('g').attr('class', 'annotations')
                .call(radarIntroAnnotation);
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
              ele.select('.title.x').text(xTitle);
              ele.select('.title.y').text(yTitle);

              // Draw markers
              let gs = ele.select('.chartG').selectAll('g.radar').data(data, d => d.id);

              let radar = radarChart()
                .width(10)
                .height(10)
                .maxValue(100)
                // Add centerAroundOrigin here!
                .centerAroundOrigin(true)
                // Customize the chart for being tiny!
                .lineThickness(0.5)
                .showVertice(false)
                .showLevelLabel(false)
                .showAxesLabel(false)
                .showLevel(false)
                .showAxes(false)
                .margin({
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0
                })
                // ... or whatever you want to do
                .firstSlice('radarData');

              // Use the .enter() method to get entering elements, and assign initial position
              gs.enter().append('g')
                  .attr('class', 'radar')
                  .attr('opacity', 0)
                  .merge(gs)
                  .on('mouseover', function(d) {
                    this.mousedOut = false;
                    var self = this;
                    setTimeout(() => {
                      if (self.mousedOut) {
                        return;
                      }

                      ele.select('.chartG').selectAll('g.radar').each(function() {
                        self.enclosed = false;
                      });
                      self.enclosed = true;
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
                    }, 50);
                  })
                  .on('mouseout', function(d) {
                    this.mousedOut = true;
                  })
                  .attr('transform', (d) => {
                    return 'translate(' + xScale(d[xAccessor]) + ', ' + yScale(d[yAccessor]) + ')';
                  })
                  .call(radar)
                  .transition()
                  .duration(1500)
                  .delay(function(d, i) {
                    return (Math.random() * 500) + 500;
                  })
                  .attr('opacity', 1);

              // Use the .exit() and .remove() methods to remove elements that are no longer in the data
              gs.exit().remove();

              if (manuallyEnclosed) {
                ele.select('.chartG').selectAll('g.radar').data([manuallyEnclosed], d => d.id).each(function() {
                  ele.select('.chartG').selectAll('g.radar').each(function() {
                    this.enclosed = false;
                  });
                  this.enclosed = true;
                });
                manuallyEnclosed = null;
              }

              var enclosingCircles = ele.select('.chartG').selectAll('g.radar').filter(function() {
                return this.enclosed;
              }).each(function(d) {
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
              });

              if (enclosingCircles.size() === 0) {
                ele.select('.chartG').selectAll('circle.enclosing-circle').remove();
              }
            }
        });
    };

    chart.onHover = function(value) {
      if (!arguments.length) return onHover;
      onHover = value;
      return chart;
    };

    chart.onIntroEnd = function(value) {
      if (!arguments.length) return onIntroEnd;
      onIntroEnd = value;
      return chart;
    };

    chart.introDisabled = function(value) {
      if (!arguments.length) return introDisabled;
      introDisabled = value;
      return chart;
    };

    chart.enclose = function(value) {
      manuallyEnclosed = value;
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

    chart.xAxisTickFormat = function(value) {
      if (!arguments.length) return xAxisTickFormat;
      xAxisTickFormat = value;
      return chart;
    }

    chart.yAxisTickFormat = function(value) {
      if (!arguments.length) return yAxisTickFormat;
      yAxisTickFormat = value;
      return chart;
    };

    chart.radarIntro = function(value) {
      if (!arguments.length) return radarIntro;
      radarIntro = value;
      return chart;
    };

    chart.xAxisIntro = function(value) {
      if (!arguments.length) return xAxisIntro;
      xAxisIntro = value;
      return chart;
    };

    chart.yAxisIntro = function(value) {
      if (!arguments.length) return yAxisIntro;
      yAxisIntro = value;
      return chart;
    };

    return chart;
};


export default RadarScatter;
