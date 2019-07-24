var width5 = 1024,
height5 = 1024,
svg5 = d3.select('#graph5')
        .append('svg')
        .attr({width: width5,
        height: height5});

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
    console.log("nodes:",nodes);

   
    console.log("degree:",degree);


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
                    .size([width5,height5]);
            
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

    var link = svg5.selectAll("line")
                    .data(links)
                    .enter()
                    .append("line")
                    .classed('link',true);


    console.log("data:",data);

    var node = svg5.selectAll("circle")
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
                    class: function(d) {return 'nick_'+nick_id(d.nick);}})
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
                d3.selectAll('circle.nick_' + nick_id(nick))
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