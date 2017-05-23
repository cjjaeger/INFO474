var radar = function () {
        
        var width = 800,
            height = 600,
            maxValue = 0,
            level = 3,
            levelScale = 0.85,
            labelScale = 0.9,
            factor = 1,
            radians = 2 * Math.PI,
            paddingX = width,
            paddingY = height,
            polygonAreaOpacity = 0.3,
            polygonStrokeOpacity = 1,
            polygonPointSize = 4,
            legendBoxSize = 10,
            color = d3.scaleOrdinal().range(d3.schemeCategory10),
            margin = {
                top: 10,
                right: 10,
                bottom: 150,
                left: 60
            },
            allAxis = null,
            totalAxes = null,
            radius = null,
            verticesTooltip = null,
            axes = null,
            vertices = null,
            legend = null,
            over = "ontouchstart" in window ? "touchstart" : "mouseover";
            out = "ontouchstart" in window ? "touchend" : "mouseout";

        var chart = function(section){
            var drawWidth = width - margin.left - margin.right;
            var drawHeight = height - margin.top - margin.bottom;

            section.each(function(data){
                console.log(data);
                var ele = d3.select(this);
                var svg = ele.selectAll("svg").data([data]);

                var gEnter = svg.enter()
                                .append("svg")
                                .attr("width", width)
                                .attr("height", height)
                                .attr("transform", "translate(" + 80 + "," + 60 + ")");

                gEnter.append("g")
                        .attr('height', drawHeight)
                        .attr('width', drawWidth)
                        .attr("class", "chartG");

                data = data.map(function(datum) {
                    if(datum instanceof Array) {
                        datum = {axes: datum};
                    }
                    return datum;
                });

                 maxValue = Math.max(maxValue, d3.max(function(d) {
                    return d3.max(d.axes, function(o) { 
                        return o.value; 
                    });
                }));

                width = width * levelScale;
                height = height * levelScale;
                paddingX = width * levelScale;
                paddingY = width * levelScale;

                /****************************************  components  ************************************************/
                allAxis = (data[0].axes.map(function(i, j){
                    return i.axis;
                }));

                totalAxes = allAxis.length;

                radius = Math.min(width/2, height/2);

                verticesTooltip = d3.select("body")
                                    .append("div")
                                    .attr("class", "verticesTooltip")

                level = gEnter.selectAll(" .level")
                                .append("g")
                                .attr("class", level);

                axes = gEnter.selectAll(" .axes")
                            .append("g")
                            .attr("class", "axes")
                            .attr("transform", "translate(" + 50 + "," + 50 + ")");

                vertices = gEnter.selectAll(" .vertices");

                legend = gEnter.append("g")
                                .attr("class", "legend")
                                .attr("height", height/2)
                                .attr("width", width/2)
                                .attr("transform", "translate(" + 0 + "," + 1.1*height + ")")

                /****************************************  coordinates  ************************************************/
                data.forEach(function(d) {
                    d.axes.forEach(function(d, i) {
                        d.coordinates = { 
                            x: width / 2 * (1 - (parseFloat(Math.max(d.value, 0)) / maxValue) * Math.sin(i * radians / totalAxes)),
                            y: height / 2 * (1 - (parseFloat(Math.max(d.value, 0)) / maxValue) * Math.cos(i * radians / totalAxes))
                        };
                    });
                });
                console.log(data.coordinates);
                /****************************************  level  ************************************************/
                for(var eachLevel=0; eachLevel<level; eachLevel++) {
                    var levelFactor = radius * ((eachLevel + 1) / level);

                    level.data(allAxis).enter()
                        .append("line")
                        .attr("class", "levelLines")
                        .attr("x1", function(d, i) { 
                            return levelFactor * (1 - Math.sin(i * radians / totalAxes)); 
                        })
                        .attr("y1", function(d, i) { 
                            return levelFactor * (1 - Math.cos(i * radians / totalAxes)); 
                        })
                        .attr("x2", function(d, i) { 
                            return levelFactor * (1 - Math.sin((i + 1) * radians / totalAxes)); 
                        })
                        .attr("y2", function(d, i) { 
                            return levelFactor * (1 - Math.cos((i + 1) * radians / totalAxes)); 
                        })
                        .attr("transform", "translate(" + (width / 2 - levelFactor) + ", " + (height / 2 - levelFactor) + ")")
                        .attr("stroke", "gray")
                        .attr("stroke-width", "0.5px");
                }

                /****************************************  level label  ************************************************/
                for (var eachLevel = 0; eachLevel < level; eachLevel++) {
                    var levelFactor = radius * ((eachLevel + 1) / level);

                    level.data([1]).enter()
                        .append("text")
                        .attr("class", "levelLabels")
                        .text((maxValue * (eachLevel + 1) / level).toFixed(2))
                        .attr("x", function(d) { 
                            return levelFactor * (1 - Math.sin(0)); 
                        })
                        .attr("y", function(d) { 
                            return levelFactor * (1 - Math.cos(0)); 
                        })
                        .attr("transform", "translate(" + (width / 2 - levelFactor + 5) + ", " + (height / 2 - levelFactor) + ")")
                        .attr("fill", "gray")
                        .attr("font-size", 10 * labelScale + "px");
                }

                /****************************************  axes  ************************************************/
                axes.data(allAxis).enter()
                    .append("line")
                    .attr("class", "axisLines")
                    .attr("x1", width / 2)
                    .attr("y1", height / 2)
                    .attr("x2", function(d, i) { 
                        return width / 2 * (1 - Math.sin(i * radians / totalAxes)); 
                    })
                    .attr("y2", function(d, i) { 
                        return height / 2 * (1 - Math.cos(i * radians / totalAxes)); 
                    })
                    .attr("stroke", "grey");

                /****************************************  axes label  ************************************************/
                axes.data(allAxis).enter()
                    .append("text")
                    .attr("class", "axisLabels")
                    .text(function(d) { 
                        return d; 
                    })
                    .attr("text-anchor", "middle")
                    .attr("x", function(d, i) { return width / 2 * (1 - 1.1 * Math.sin(i * radians / totalAxes)); })
                    .attr("y", function(d, i) { return height / 2 * (1 - 1.1 * Math.cos(i * radians / totalAxes)); })
                    .attr("font-size", 11 * labelScale + "px");

                /****************************************  legend  ************************************************/
                legend.selectAll(".legendTiles")
                        .data(data).enter()
                        .append("rect")
                        .attr("class", "legendTiles")
                        .attr("x", width - paddingX / 2)
                        .attr("y", function(d, i) { 
                            return i * 2 * legendBoxSize; 
                        })
                        .attr("width", legendBoxSize)
                        .attr("height", legendBoxSize)
                        .attr("fill", function(d, g) { 
                            return color(g); 
                        });

                legend.selectAll(".legendLabels")
                        .data(data).enter()
                        .append("text")
                        .attr("class", "legendLabels")
                        .attr("x", width - paddingX / 2 + (1.5 * legendBoxSize))
                        .attr("y", function(d, i) { 
                            return i * 2 * legendBoxSize; 
                        })
                        .attr("dy", 0.07 * legendBoxSize + "em")
                        .attr("font-size", 11 * labelScale + "px")
                        .attr("fill", "gray")
                        .text(function(d) {
                            return d.group;
                        });

                /****************************************  vertices  ************************************************/
                data.forEach(function(group, g) {
                    vertices.data(group.axes).enter()
                    .append("circle")
                    .attr("class", "polygonVertice")
                    .attr("r", polygonPointSize)
                    .attr("x", function(d, i) { return d.coordinates.x; })
                    .attr("y", function(d, i) { return d.coordinates.y; })
                    .attr("fill", color(g))
                    .on(over, verticesTooltipShow)
                    .on(out, verticesTooltipHide);
                });

                /****************************************  polygons  ************************************************/
                vertices.data(data).enter()
                .append("polygon")
                .attr("class", "polygonAreas")
                .attr("points", function(group) { 
                    var verticesString = "";
                    group.axes.forEach(function(d) { 
                        verticesString += d.coordinates.x + "," + d.coordinates.y + " "; 
                    });
                    return verticesString;
                })
                .attr("stroke-width", "2px")
                .attr("stroke", function(d, i) { 
                    return color(i); 
                })
                .attr("fill", function(d, i) { 
                    return color(i); 
                })
                .attr("fill-opacity", polygonAreaOpacity)
                .attr("stroke-opacity", polygonStrokeOpacity)
                .on(over, function(d) {
                gEnter.selectAll(".polygonAreas") 
                        .transition()
                        .duration(1000)
                        .attr("fill-opacity", 0.1)
                        .attr("stroke-opacity", 0.1);
                d3.select(this) 
                .transition()
                .duration(1000)
                .attr("fill-opacity", 0.7)
                .attr("stroke-opacity", polygonStrokeOpacity);
                })
                .on(out, function() {
                    d3.selectAll(".polygonAreas")
                        .transition()
                        .duration(1000)
                        .attr("fill-opacity", polygonAreaOpacity)
                        .attr("stroke-opacity", 1);
                });

                /****************************************  show tooltip  ************************************************/
                function verticesTooltipShow(d) {
                    verticesTooltip.style("opacity", 0.9)
                    .html("<strong>Value</strong>: " + d.value + "<br />" +
                    "<strong>Description</strong>: " + d.description + "<br />")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
                }

                /****************************************  hide tooltip  ************************************************/
                function verticesTooltipHide() {
                    verticesTooltip.style("opacity", 0);
                }

                // d3.select(this).selectAll("svg").remove();

            })
        };

        chart.level = function(value) {
            if (!arguments.length) return level;
            level = value;
            return chart;
        };

        chart.width = function(value) {
            if (!arguments.length) return width;
            width = value;
            return chart;
        };

        chart.height = function(value) {
            if (!arguments.length) return height;
            height = value;
            return chart;
        };

        chart.labelScale = function(value) {
            if (!arguments.length) return labelScale;
            labelScale = value;
            return chart;
        };

        chart.legendBoxSize = function(value) {
            if (!arguments.length) return legendBoxSize;
            legendBoxSize = value;
            return my;
        };

        chart.color = function(value) {
            if (!arguments.length) return color;
            color = value;
            return my;
        };
        return chart

};