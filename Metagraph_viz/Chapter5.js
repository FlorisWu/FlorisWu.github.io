var width1 = 900,
height1 = 700,
svg1 = d3.select('#graph1')
        .append('svg')
        .attr({width: width1,
        height: height1});

d3.json('3_3_edges_with_degree_and_distance.json', function(data) { 

    var nick_id = helpers.nick_id(data, function(d) { return d.from;}),
        uniques = nick_id.domain(),
        matrix = helpers.connection_matrix(data);
    
    var degree = data.map(function(d) {
        return {degree:d.degree};
    })

    var nodes = uniques.map(function (nick) {
        return {
            nick: nick,
            degree: degree[nick_id(nick)].degree
        };
    })
   

    var links = data.map(function(d) {
        return {
            source: nick_id(d.from),
            target: nick_id(d.to),
            count: matrix[nick_id(d.from)][nick_id(d.to)]
        };
    });

    var force = d3.layout.force()
                    .nodes(nodes)
                    .links(links)
                    .gravity(0.5)
                    .size([width1,height1]);
            
        force.start();

    var weight = d3.scale.linear()
                    .domain(d3.extent(nodes.map(function(d) {return d.weight;})))
                    .range([5,20])
        distance = d3.scale.linear()
                    .domain(d3.extent(d3.merge(matrix)))
                    .range([110,500]),
        given = d3.scale.linear()
                    .range([5,35]);

    force.linkDistance(function(d) {
        return distance(d.count);
    });

    force.start();

    var link = svg1.selectAll("line")
                    .data(links)
                    .enter()
                    .append("line")
                    .classed('link',true);




    var node = svg1.selectAll("circle")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .classed('node', true)
                    .attr({r: function(d) {
                        return weight(d.weight)
                    },
                    fill: function(d) {
                        return helpers.color(d.degree);},
                    //console.log("d.degree:",d.degree);},
                    class: function(d) {return 'nick1_'+nick_id(d.nick);}})
                    .on('mouseover', function(d) {highlight(d, uniques, given, matrix, nick_id); })
                    .on('mouseout', function(d) { dehighlight(d, weight);});

                    

    node.call(helpers.tooltip2(function(d) { return d.nick;  }));
    node.call(force.drag);


    force.on("tick", function() {
        link.attr("x1", function(d) {return d.source.x;})
            .attr("y1", function(d) {return d.source.y;})
            .attr("x2", function(d) {return d.target.x;})
            .attr("y2", function(d) {return d.target.y;})
        
        node.attr("cx", function(d) {return d.x;})
            .attr("cy", function(d) {return d.y;});
    });

    function highlight (d, uniques, given, matrix, nick_id) {
        given.domain(d3.extent(matrix[nick_id(d.nick)]));

        uniques.map(function(nick) { 
            var count = matrix[nick_id(d.nick)][nick_id(nick)];

            if (nick != d.nick) {
                d3.selectAll('circle.nick1_' + nick_id(nick))
                    .classed('unconnected', true)
                    .transition()
                    .attr('r', given(count));
            }
        });
    }

    function dehighlight (d,weight) {
        d3.selectAll('.node')
            .transition()
            .attr('r', function(d) {return weight(d.weight); });
    }
});

var width2 = 1000,
height2 = 1000,
svg2 = d3.select('#graph2')
        .append('svg')
        .attr({width: width2,
        height: height2});

d3.json('4_4_4_edges_with_degree_and_distance.json', function(data) { 

    var nick_id = helpers.nick_id(data, function(d) { return d.from;}),
        uniques = nick_id.domain(),
        matrix = helpers.connection_matrix(data);
    
        console.log("data:", data);

    var degree = data.map(function(d) {
        console.log("d:", d);
        console.log("d.degree:", d.degree);
        return {degree:d.degree};
    })

    var nodes = uniques.map(function (nick) { 
        console.log("nick:",nick);
        console.log("nick_id(nick):",nick_id(nick));
        console.log("degree[nick_id(nick)]:",degree[nick_id(nick)]);
        console.log("degree[nick_id(nick)].degree:",degree[nick_id(nick)].degree);
         // next step: checking if nick_id is doing the right thing/mapping
        
        return {
            nick: nick,
            degree: degree[nick_id(nick)].degree,
        };
    });
    
    

    console.log("nodes:", nodes);
   

    var links = data.map(function(d) {
        console.log("matrix[nick_id(d.from)][nick_id(d.to)]:", matrix[nick_id(d.from)][nick_id(d.to)]);
        return {
            source: nick_id(d.from),
            target: nick_id(d.to),
            count: matrix[nick_id(d.from)][nick_id(d.to)]
        };
    });

    var force = d3.layout.force()
                    .nodes(nodes)
                    .links(links)
                    .gravity(0.5)
                    .size([width2,height2]);
            
        force.start();

    var weight = d3.scale.linear()
                    .domain(d3.extent(nodes.map(function(d) {return d.weight;})))
                    .range([5,20])
        distance = d3.scale.linear()
                    .domain(d3.extent(d3.merge(matrix)))
                    .range([100,400]),
        given = d3.scale.linear()
                    .range([5,35]);

    force.linkDistance(function(d) {
        return distance(d.count);
    });

    force.start();

    var link = svg2.selectAll("line")
                    .data(links)
                    .enter()
                    .append("line")
                    .classed('link',true);




    var node = svg2.selectAll("circle")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .classed('node', true)
                    .attr({r: function(d) {
                        return weight(d.weight)
                    },
                    fill: function(d) {
                         return helpers.color(d.degree);},
                    //console.log("d.degree:",d.degree);},
                    class: function(d) {return 'nick2_'+nick_id(d.nick);}})
                    .on('mouseover', function(d) {highlight(d, uniques, given, matrix, nick_id); })
                    .on('mouseout', function(d) { dehighlight(d, weight);});

                    

    node.call(helpers.tooltip3(function(d) { return d.nick;  }));
    node.call(force.drag);


    force.on("tick", function() {
        link.attr("x1", function(d) {return d.source.x;})
            .attr("y1", function(d) {return d.source.y;})
            .attr("x2", function(d) {return d.target.x;})
            .attr("y2", function(d) {return d.target.y;})
        
        node.attr("cx", function(d) {return d.x;})
            .attr("cy", function(d) {return d.y;});
    });

    function highlight (d, uniques, given, matrix, nick_id) {
        given.domain(d3.extent(matrix[nick_id(d.nick)]));

        uniques.map(function(nick) {
            var count = matrix[nick_id(d.nick)][nick_id(nick)];

            if (nick != d.nick) {
                d3.selectAll('circle.nick2_' + nick_id(nick))
                    .classed('unconnected', true)
                    .transition()
                    .attr('r', given(count));
            }
        });
    }

    function dehighlight (d,weight) {
        d3.selectAll('.node')
            .transition()
            .attr('r', function(d) {return weight(d.weight); });
    }
});


