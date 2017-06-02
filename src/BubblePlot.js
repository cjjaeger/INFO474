import * as d3 from 'd3';
import * as d3a from 'd3-svg-annotation';
import * as d3legend from 'd3-svg-legend';

// ScatterPlot
var BubblePlot = function() {
    // Set default values
    var height = 500,
        width = 800,
        xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),
        xTitle = 'X Axis Title',
        yTitle = 'Y Axis Title',
        title = '',
        sizeIntro,
        xAxisIntro,
        yAxisIntro,
        radius = 6,
        scores = false,
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
        function getRandomArbitrary(min, max) {
            return Math.floor(Math.random() * ( max - min)) + min;
        }
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

            var tooltip = d3.select("body")
                .append("div")
                .style('background', 'white')
                .style('padding', '5px')
                .style('border-radius', '5px')
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden");
            // Title G
            svgEnter.append('text')
                .attr('transform', 'translate(' + (margin.left + chartWidth / 2) + ',' + 20 + ')')
                .text(title)
                .attr('text-anchor', 'middle')
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
            var xAxis = d3.axisBottom();

            var yAxis = d3.axisLeft().tickFormat(d3.format('.2s'));

            // Calculate x and y scales
            var xMax = d3.max(data, (d) => +d.x) * 1.05;
            var xMin = d3.min(data, (d) => +d.x) * .95;
            var ranges;
            if (scores) {
                ranges =[chartWidth, 0];
            } else {
                ranges = [0,chartWidth];
            }
            xScale.range(ranges).domain([xMin, xMax]);

            var yMin = d3.min(data, (d) => +d.y) * .95;
            var yMax = d3.max(data, (d) => +d.y) * 1.05;
            yScale.range([chartHeight, 0]).domain([yMin, yMax]);



             if (!svgEnter.empty()) {
              // This is the first render, run the intro!
              var firstCollege = data[Math.floor(Math.random() * data.length)];

              var donutIntroAnnotation = d3a.annotation()
                .type(d3a.annotationCalloutCircle)
                .annotations([{
                  note: sizeIntro(firstCollege),
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
                  x: xScale(firstCollege.x),
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
                  y: yScale(firstCollege.y),
                  dy: 0,
                  dx: 20
                }]);

              let chartG = ele.select('.chartG');

              let g = chartG.selectAll('circle')
                .data([firstCollege], d => d.id);

              g.enter().append('circle')
                    .attr('cx', (chartWidth / 2))
                    .attr('cy',(chartHeight / 2));

              chartG.selectAll('circle')
                  .data([firstCollege], d => d.id)
                  .attr('r', 100)
                     .attr('fill', function(d) {
                    return fill(cValue(d));
                    })
                    .style('opacity', .3)
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
                    .attr('cx', xScale(firstCollege.x))
                    .attr('cy',(chartHeight / 2))
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
                    .attr('cx', xScale(firstCollege.x))
                    .attr('cy', yScale(firstCollege.y))
                  .transition()
                    .duration(1500)
                    .on('start', () => {
                      chartG.select('.annotations')
                        .remove();
                    })
                    .attr('r', firstCollege.radius*10)
                    .on('end', renderCompleteChart);

              // Update axes
              xAxis.scale(xScale);
              yAxis.scale(yScale);

              chartG
                .append('g').attr('class', 'annotations')
                .call(donutIntroAnnotation);
            } else {
              renderCompleteChart();
            }

            function renderCompleteChart(){
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
                .attr('class', function(d){
                    return d.location;
                })
                .style('opacity', .3)
                .attr('cx', (d) => xScale(d.x))
                // Transition properties of the + update selections
                .merge(circles)
                .on("mouseover", function(d){
                    tooltip.html(d.name +" <br/> "+(d.radius*100).toFixed(2) +"% Acceptance Rate"+" <br/> " + d.x.toFixed(2))
                      .style("visibility", "visible");})
                .on("mousemove", function() {
                    tooltip.style("top", (d3.event.pageY - 10)+"px")
                      .style("left",(d3.event.pageX + 10)+"px");}
                )
                .on("mouseout", function(){
                    tooltip.style("visibility", "hidden");
                })
                .attr('r', (d) =>d.radius*10)
                .transition()
                .duration(800)
                .delay((d) => xScale(d.x) * 5)
                .attr('cx', (d) => xScale(d.x) +getRandomArbitrary(-6,6))
                .attr('cy', (d) => yScale(d.y)+getRandomArbitrary(-6,6));

            var legend = svgEnter.selectAll(".legend")
                .data(fill.domain())
                .enter().append("g")
                .attr("class", "legend")
                .style('cursor', 'pointer')
                .attr("transform", function(d, i) { return "translate(-90," + i * 20 + ")"; })
                .on('click', function (d, i) {
                    let colorSquare = d3.select(this).select('rect');
                    colorSquare.style('opacity') === '1' ? colorSquare.style('opacity', 0.3) : colorSquare.style('opacity', 1);
                    let className = d3.selectAll("."+d);
                    className.style('opacity') === '0.3' ? className.style("opacity",0): className.style("opacity",0.3);
                });

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
            var array = data.map( (d) => {return d.radius;})
            console.log(array);
            var cirMax = d3.max(data, (d) => {return d.radius;})
            var cirMin = d3.min(data, (d) => {return d.radius;})
            var linearSize = d3.scaleLinear().domain([cirMin*100, cirMax*100]).range([cirMin*10, cirMax*10]);

            var svg = d3.select("svg");

            svg.append("g")
            .attr("class", "legendSize")
            .attr("transform", "translate("+(chartWidth+15)+",5 )");

            var legendSize = d3legend.legendSize()
            .scale(linearSize)
            .shape('circle')
            .shapePadding(15)
            .labelOffset(10)
            .orient('vertical');

            svg.select(".legendSize")
            .call(legendSize);

            // Use the .exit() and .remove() methods to remove elements that are no longer in the data
            circles.exit().remove();
            }
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
     chart.scores = function(value) {
        if (!arguments.length) return scores;
        scores = value;
        return chart;
    };
    chart.sizeIntro = function(value) {
      if (!arguments.length) return sizeIntro;
      sizeIntro = value;
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

export default BubblePlot;
