import * as d3 from 'd3';
import './RadarCSS.css';

var radarChart = function () {

        var width = 1000,
            height = 1000,
            maxValue = 0,
            level = 4,
            levelScale = 0.4,
            labelScale = 0.5,
            factor = 1,
            radians = 2 * Math.PI,
            paddingX = width,
            paddingY = height,
            polygonAreaOpacity = 0.3,
            polygonStrokeOpacity = 1,
            polygonPointSize = 6,
            legendBoxSize = 10,
            color = d3.scaleOrdinal().range(d3.schemeCategory10),
            margin = {
                top: 10,
                right: 10,
                bottom: 150,
                left: 10
            },
            allAxis = null,
            totalAxes = null,
            radius = null,
            verticesTooltip = null,
            svgLevel = null,
            axes = null,
            vertices = null,
            legend = null,
            over = "ontouchstart" in window ? "touchstart" : "mouseover",
            out = "ontouchstart" in window ? "touchend" : "mouseout",
            firstSlice,
            centerAroundOrigin = false,
            lineThickness = 1,
            showVertice = true,
            showLevelLabel = true,
            showAxesLabel = true,
            showLevel = true,
            showAxes = true;

        var chart = function(context) {
            var isTransition = !!(context.selection);
            var drawWidth = width - margin.left - margin.right;
            var drawHeight = height - margin.top - margin.bottom;

            context.each(function(data) {
                if(firstSlice){
                    data = data[firstSlice];
                }

                var ele = d3.select(this);
                var g = ele.selectAll("g").data([data]);

                var gEnter = g.enter()
                                .append("g")
                                .attr("class", "chartG");

                data = data.map(function(datum) {
                    if(datum instanceof Array) {
                        datum = {axes: datum};
                    }
                    return datum;
                });

                 maxValue = Math.max(maxValue, d3.max(data, function(d) {
                    return d3.max(d.axes, function(o) {
                        return o.value;
                    });
                }));

                /****************************************  components  ************************************************/

                allAxis = (data[0].axes.map(function(i, j){
                    return i.axis;
                }));

                totalAxes = allAxis.length;

                radius = Math.min(width/2, height/2);

                verticesTooltip = d3.select("body")
                                    .append("div")
                                    .attr("class", "verticesTooltip")

                svgLevel = gEnter.selectAll(" .level")
                                .append("g")
                                .attr("class", level);

                axes = gEnter.selectAll(" .axes")
                            .append("g")
                            .attr("class", "axes");

                vertices = gEnter.merge(g).selectAll(".vertices");

                if (centerAroundOrigin) {
                    var chartG = gEnter.merge(g);

                    if (isTransition) {
                      chartG = chartG.transition(context);
                    }

                    chartG
                      .attr('height', drawHeight)
                      .attr('width', drawWidth)
                      .attr('transform', 'translate(' + ((-width/2)) + ',' + ((-height/2)) + ')');
                }
                
                /****************************************  coordinates  ************************************************/

                data.forEach(function(group) {
                    group.axes.forEach(function(d, i) {
                        d.coordinates = {
                            x: width / 2 * (1 - (parseFloat(Math.max(d.value, 0)) / maxValue) * Math.sin(i * radians / totalAxes)),
                            y: height / 2 * (1 - (parseFloat(Math.max(d.value, 0)) / maxValue) * Math.cos(i * radians / totalAxes))
                        };
                    });
                });
                /****************************************  level  ************************************************/

                if(showLevel) {
                    for(var eachLevel=0; eachLevel<level; eachLevel++) {
                        var levelFactor = radius * ((eachLevel + 1) / level);

                        svgLevel.data(allAxis).enter()
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
                            .attr("stroke-width", lineThickness + "px");
                    }
                }else {
                    var levelHide = g.merge(gEnter).selectAll(' .levelLines');

                    if (isTransition) {
                      levelHide = levelHide.transition(context).duration(0);
                    }

                    levelHide.remove();
                }

                /****************************************  level label  ************************************************/

                if(showLevelLabel){
                    for (var eachLevel = 0; eachLevel < level; eachLevel++) {
                        var levelFactor = radius * ((eachLevel + 1) / level);

                        svgLevel.data([1]).enter()
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
                            .attr("font-size", 17 * labelScale + "px");
                    }
                }else {
                    var labelsHide = g.merge(gEnter).selectAll(' .levelLabels');

                    if (isTransition) {
                      labelsHide = labelsHide.transition(context).duration(0);
                    }
                    labelsHide.attr("fill", "white");
                }

                /****************************************  axes  ************************************************/
                if(showAxes) {
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
                }else {
                  var axesHide = g.merge(gEnter).selectAll('.axisLines');

                  if (isTransition) {
                    axesHide = axesHide.transition(context).duration(0);
                  }

                  axesHide.remove();
                }

                /****************************************  axes label  ************************************************/

                if(showAxesLabel) {
                    axes.data(allAxis).enter()
                        .append("text")
                        .attr("class", "axisLabels")
                        .text(function(d) {
                            return d;
                        })
                        .attr("text-anchor", "middle")
                        .attr("x", function(d, i) { return width / 2 * (1 - 1.08 * Math.sin(i * radians / totalAxes)); })
                        .attr("y", function(d, i) { return height / 2 * (1 - 1.08 * Math.cos(i * radians / totalAxes)); })
                        .attr("font-size", 15 * labelScale + "px");
                }else {
                  var axesLabelRemove = g.merge(gEnter).selectAll('.axisLabels');

                  if (isTransition) {
                    axesLabelRemove = axesLabelRemove.transition(context).duration(0);
                  }

                  axesLabelRemove.remove();
                }

                /****************************************  vertices  ************************************************/
                if(showVertice) {
                    data.forEach(function(group, gColor) {
                        var verticesJoin = gEnter.merge(g).selectAll('.polygonVertice').data(group.axes, d => d.axis);
                        var entering = verticesJoin.enter()
                                .append("circle")
                                .attr("class", "polygonVertice");
                        var exiting = verticesJoin.exit();

                        if (isTransition) {
                          verticesJoin = verticesJoin.transition(context);
                          exiting = exiting.transition(context);
                        }

                        entering
                                .merge(verticesJoin)
                                .attr("r", polygonPointSize)
                                .attr("cx", function(d, i) {
                                    return d.coordinates.x;
                                })
                                .attr("cy", function(d, i) {
                                    return d.coordinates.y;
                                })
                                .attr("fill", color(gColor))
                                .attr("fill-opacity", 1)
                                .on(over, function(d) {
                                    verticesTooltip.style("opacity", 0.9)
                                        .html("<strong>Race</strong>: " + d.axis + "<br />" +
                                        "<strong>Percentile</strong>: " + d.value + "<br />")
                                        .style("left", (d3.event.pageX) + "px")
                                        .style("top", (d3.event.pageY) + "px");
                                })
                                .on(out, function() {
                                    verticesTooltip.style("opacity", 0);
                                });

                        exiting.remove();
                    });
                }else {
                  var verticesRemove = g.merge(gEnter).selectAll('.polygonVertice');

                  if (isTransition) {
                    verticesRemove = verticesRemove.transition(context).duration(0);
                  }

                  verticesRemove.remove();
                }

                /****************************************  polygons  ************************************************/

                var polygons = gEnter.merge(g).selectAll('polygon.polygonAreas').data(data);
                var enteringPolygons = polygons.enter()
                  .append("polygon")
                  .attr("class", "polygonAreas")
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

                if (isTransition) {
                  enteringPolygons = enteringPolygons.transition(context);
                  polygons = polygons.transition(context);
                }

                function tweenPoly(group, a, initial) {
                  initial = d3.select(initial[0]).attr('points').split(' ').map(a => {
                    return {x: a.split(',')[0], y: a.split(',')[1]};
                  })
                  var interpolators = [];
                  group.axes.forEach(function(d, i) {
                      interpolators.push(
                        {
                          x: d3.interpolate(initial[i].x, d.coordinates.x),
                          y: d3.interpolate(initial[i].y, d.coordinates.y)
                        });
                  });

                  return function(t) {
                    var verticesString = "";
                    interpolators.forEach(function(interpolatorSet) {
                        verticesString += interpolatorSet.x(t) + "," + interpolatorSet.y(t) + " ";
                    });
                    return verticesString;
                  };
                }

                let polygonJoin = enteringPolygons
                  .merge(polygons)
                  .attr("stroke-width", "0.8px")
                  .attr("stroke", function(d, i) {
                      return color(i);
                  })
                  .attr("fill", function(d, i) {
                      return color(i);
                  })
                  .attr("fill-opacity", polygonAreaOpacity)
                  .attr("stroke-opacity", polygonStrokeOpacity);

                if (isTransition) {
                  polygonJoin.attrTween("points", tweenPoly);
                } else {
                  polygonJoin
                    .attr("points", function(group) {
                       var verticesString = "";
                       group.axes.forEach(function(d) {
                            verticesString = verticesString + d.coordinates.x + "," + d.coordinates.y + " ";
                       });
                       return verticesString;
                    });
                }

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

        chart.color = function(value) {
            if (!arguments.length) return color;
            color = value;
            return chart;
        };

         chart.firstSlice = function(value) {
            if (!arguments.length) return firstSlice;
            firstSlice = value;
            return chart;
        };

        chart.centerAroundOrigin = function(value) {
            if (!arguments.length) {
                return centerAroundOrigin;
            }
            centerAroundOrigin = value;
            return chart;
        };

        chart.lineThickness = function(value) {
            if(!arguments.length) {
                return lineThickness;
            }
            lineThickness = value;
            return chart;
        }

        chart.showVertice = function(value) {
            if(!arguments.length) {
                return showVertice;
            }
            showVertice = value;
            return chart;
        }

        chart.showLevelLabel = function(value) {
            if(!arguments.length) {
                return showLevelLabel;
            }
            showLevelLabel = value;
            return chart;
        }

        chart.showAxesLabel = function(value) {
            if(!arguments.length) {
                return showAxesLabel;
            }
            showAxesLabel = value;
            return chart;
        }

        chart.margin = function(value) {
            if(!arguments.length) {
                return margin;
            }
            margin = value;
            return chart;
        }

        chart.showLevel = function(value) {
            if(!arguments.length) {
                return showLevel;
            }
            showLevel = value;
            return chart;
        }

        chart.showAxes = function(value) {
            if(!arguments.length) {
                return showAxes;
            }
            showAxes = value;
            return chart;
        }

        chart.maxValue = function(value) {
            if(!arguments.length) {
              return maxValue;
            }
            maxValue = value;
            return chart;
        }

        return chart

};

export default radarChart;