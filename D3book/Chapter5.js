var width1 = 1024,
    height1 = 1024,
    svg1 = d3.select('#graph1')
            .append('svg')
            .attr({width: width1,
            height: height1});

d3.json('karma_matrix.json', function(data) { 


var nick_id = helpers.nick_id(data, function(d) {return d.to;});


var histogram = d3.layout.histogram() // creating a new histogram
                        .bins(nick_id.range()) // using .bins() to define the upper threshold for each bin
                        .value(function(d) { return nick_id(d.to);})
(data); // .value() accessor tells the histogram how to find values in our dataset



var margins = {
    top:10,
    right:40,
    bottom: 100,
    left: 50};

var x=d3.scale.linear() // creating linear scale
                .domain([0,d3.max(histogram, function(d){
                    return d.x; })])
                .range([margins.left,width1-margins.right]),
    y =d3.scale.log() // log scale
                .domain([1,d3.max(histogram,function(d) {return d.y;})])
                .range([height1-margins.bottom, margins.top]);

var yAxis=d3.svg.axis() // putting vertical axis
            .scale(y)
            .tickFormat(d3.format('f'))
            .orient('left');

    svg1.append('g')
        .classed('axis',true)
        .attr('transform','translate(50,0)')
        .call(yAxis);

var bar = svg1.selectAll('.bar') // creating grouping element for every bar and label
                .data(histogram)
                .enter()
                .append('g')
                .classed('bar',true)
                .attr('transform', function(d) {return 'translate('+x(d.x)+','+y(d.y)+')';});

bar.append('rect') // moving the group into position
    .attr({x:1,
        width: x(histogram[0].dx)-margins.left-1,
        height: function(d) {return height1-margins.bottom-y(d.y);} });

bar.append('text') // creating labels
        .text(function(d) { return d[0].to; })
        .attr({transform: function(d) { var bar_height = height1-margins.bottom-y(d.y);
                                    return 'translate(0, '+(bar_height)+')  rotate(60)';} 
                                });
                        }); 


var width2 = 1024,
height2 = 1024,
svg2 = d3.select('#graph2')
        .append('svg')
        .attr({width: width2,
        height: height2});

d3.json('karma_matrix.json', function(data) { 

filtered = data.filter(function(d) {return d.to == 'HairyFotr';});



var per_nick = helpers.bin_per_nick(filtered, function(d) {return d.from;});


var pie = d3.layout.pie()
                .value(function(d) {return d.length; })(per_nick) ;


var arc = d3.svg.arc() // defining the arc generator and fixate the colors
        .outerRadius(150)
        .startAngle(function(d) {return d.startAngle; })
        .endAngle(function(d) {return d.endAngle;});
    
helpers.fixate_colors(data);


var slice = svg2.selectAll('.slice') // group element holding each arc and its label
                .data(pie)
                .enter()
                .append('g')
                .attr('transform','translate(300,300)'); // to make positioning simpler, we move every group to the center of the pie chart

slice.append('path') // creating slices
        .attr({d: arc, fill: function (d) { return helpers.color(d.data[0].from);}});
// we get the color for a slice with d.data[0].from 

slice.call(helpers.arc_labels(
    function(d) {return d.data[0].from;},
    arc.outerRadius()
)); 

});


var width3 = 1024,
height3 = 1024,
svg3 = d3.select('#graph3')
        .append('svg')
        .attr({width: width3,
        height: height3});

d3.json('karma_matrix.json', function(data) { 


    var time = d3.time.format('%Y-%m-%d %H:%M:%S'),
        extent = d3.extent(data.map(function(d) {return time.parse(d.time);})),
        time_bins = d3.time.days(extent[0],extent[1],12);



    var per_nick = helpers.bin_per_nick(data, function(d) {
        return d.to; });

    var time_binned = per_nick.map(function (nick_layer) {
        return {to: nick_layer[0].to,
                values: d3.layout.histogram()
                                    .bins(time_bins)
                                    .value(function(d) { return time.parse(d.time);})(nick_layer)};
    });

    var layers = d3.layout.stack()
                    .order('inside-out')
                    .offset('zero')
                    .values(function(d) {return d.values;}) (time_binned);

    var margins = {
        top: 220,
        right: 50,
        bottom: 0,
        left: 50
    };

    var x = d3.time.scale()
                .domain(extent)
                .range([margins.left, width3-margins.right]),
        y = d3.scale.linear()
                .domain([0, d3.max(layers, function(layer) {
                    return d3.max(layer.values, function (d) {
                        return d.y0+d.y;
                    });
                })])
                .range([height3-margins.top,0]);

    var offset = 100,
        area = d3.svg.area()
                .x(function(d) { return x(d.x)})
                .y0(function(d) { return y(d.y0)+offset; })
                .y1(function(d) { return y(d.y0 + d.y)+offset;});


    var xAxis = d3.svg.axis()
                .scale(x)
                .tickFormat(d3.time.format('%b %Y'))
                .ticks(d3.time.months,2)
                .orient('bottom');

    svg3.append('g')
        .attr('transform', 'translate(0, '+(height3-100)+')')
        .classed('axis', true)
        .call(xAxis);



    svg3.selectAll('path')
        .data(layers)
        .enter()
        .append('path')
        .attr('d', function(d) {return area(d.values); })
        .style('fill', function(d,i) {return helpers.color(i);})
        .call(helpers.tooltip1(function(d) {return d.nick;}));

        
});

var width4 = 1024,
height4 = 1024,
svg4 = d3.select('#graph4')
        .append('svg')
        .attr({width: width4,
        height: height4});

d3.json('karma_matrix.json', function(data) { 

    var uniques = helpers.uniques(data, function(d) { return d.from; }),
        matrix = helpers.connection_matrix(data);

    var innerRadius = Math.min(width4, height4)*0.3,
        outerRadius = innerRadius*1.1;

    var chord = d3.layout.chord()
                    .padding(.05)
                    .sortGroups(d3.descending)
                    .sortSubgroups(d3.descending)
                    .sortChords(d3.descending)
                    .matrix(matrix);

    var diagram = svg4.append('g')
                    .attr('transform', 'translate('+width4/2+','+height4/2+')');

    var group = diagram.selectAll('.group')
                    .data(chord.groups)
                    .enter()
                    .append('g'),
        arc = d3.svg.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(outerRadius);
        group.append('path')
                .attr('d',arc)
                .attr('fill', function(d) { return helpers.color(d.index);});

        group.call(helpers.arc_labels(
            function (d) { return uniques[d.index];},
            function () {return outerRadius+10;} 
        ));

    diagram.append('g')
            .classed('chord', true)
            .selectAll('path')
            .data(chord.chords)
            .enter()
            .append('path')
            .attr('d', d3.svg.chord().radius(innerRadius))
            .attr('fill', function(d,i) {return helpers.color(d.target.index);});



});


var width5 = 1024,
height5 = 1024,
svg5 = d3.select('#graph5')
        .append('svg')
        .attr({width: width5,
        height: height5});

d3.json('karma_matrix.json', function(data) { 

    var nick_id = helpers.nick_id(data, function(d) { return d.from; }),
        uniques = nick_id.domain(),
        matrix = helpers.connection_matrix(data);

    var nodes = uniques.map(function (nick) {
        return {nick:nick};
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
                    .size([width5,height5]);
            
        force.start();

    var weight = d3.scale.linear()
                    .domain(d3.extent(nodes.map(function(d) {return d.weight;})))
                    .range([5,30])
        distance = d3.scale.linear()
                    .domain(d3.extent(d3.merge(matrix)))
                    .range([300,100]),
        given = d3.scale.linear()
                    .range([2,35]);

    force.linkDistance(function(d) {
        return distance(d.count);
    });

    force.start();

    var link = svg5.selectAll("line")
                    .data(links)
                    .enter()
                    .append("line")
                    .classed('link',true);

    var node = svg5.selectAll("circle")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .classed('node', true)
                    .attr({r: function(d) {return weight(d.weight);},
                    fill: function(d) {return helpers.color(d.index); },
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


var width6 = 1024,
height6 = 1024,
svg6 = d3.select('#graph6')
        .append('svg')
        .attr({width: width6,
        height: height6});

d3.json('karma_matrix.json', function(data) { 
    helpers.fixate_colors(data);
    var tree = helpers.make_tree(data,
        function(d,nick) {
            return d.to == nick;
        },
        function(d,nick) {return d.from == nick;},
        function(d) {return d.to;},
        function(d) {return d[0].to; });

    var diagonal = d3.svg.diagonal.radial().projection(function(d) {
        return [d.y,d.x/180 * Math.PI];});
    
    var layout = d3.layout.tree()
                        .size([360, width6/2-120]);
            var nodes = layout.nodes(tree),
                links = layout.links(nodes);
    var chart = svg6.append('g')
                        .attr('transform','translate('+width6/2+','+height6/2+')');

    var link = chart.selectAll(".link")
                    .data(links)
                    .enter()
                    .append("path")
                    .attr("class", "link")
                    .attr("d", diagonal);


    var node = chart.selectAll(".node")
                .data(nodes)
                .enter().append("g")
                .attr("class","node")
                .attr("transform", function(d) {return "rotate("+(d.x-90)+")translate("+d.y+")";});

    node.append("circle")
            .attr("r",4.5)
            .attr("fill",function(d) {return helpers.color(d.nick);});

    node.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) {return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";})
        .text(function(d) {return d.nick;})
        .style('font-size', function(d) {return d.depth > 1 ? '0.8em' : '1.1em';}); 


});

var width7 = 1024,
height7 = 2800,
svg7 = d3.select('#graph7')
        .append('svg')
        .attr({width: width7,
        height: height7});

d3.json('karma_matrix.json', function(data) { 
    var tree = helpers.make_tree(data,
        function (d, nick) { return d.to == nick; },
        function (d, nick) { return d.from == nick; },
        function (d) { return d.to; },
        function (d) { return d[0].to; });

    helpers.fixate_colors(data);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) { return [d.y, d.x]; });

    var cluster = d3.layout.cluster()
        .size([height7, width7-150])
        .sort(function (a, b) { return d3.descending(a.count, b.count); });

    var nodes = cluster.nodes(tree),
        links = cluster.links(nodes);

    svg7.selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .classed('link', true)
        .attr('d', diagonal);

    var node = svg7.selectAll('.node')
                    .data(nodes)
                    .enter()
                    .append('g')
                    .classed('node', true)
                    .attr('transform', function (d) { return 'translate('+d.y+', '+d.x+')'; });

    node.append('circle')
                .attr({r: 5,
                            fill: function (d) { return helpers.color(d.nick); }});

    node.append('text')
            .text(function (d) { return d.nick; })
            //.attr("dx", function(d) { return d.children.length ? -8 : 8; })
            .attr("dy", function (d) { return d.depth > 1 ? 3 : 5; })
            //.attr("text-anchor", function(d) { return d.children.length ? "end" : "start"; })
            .style('font-size', function (d) { return d.depth > 1 ? '0.8em' : '1.1em'; });


});

var width8 = 1024,
height8 = 2800,
svg8 = d3.select('#graph8')
        .append('svg')
        .attr({width: width8,
        height: height8});

d3.json('karma_matrix.json', function(data) { 
    var tree = helpers.make_tree(data, function(d,nick) { return d.to == nick; },
    function(d,nick) {return d.to == nick;},
    function(d,nick) {return d.from;},
    function(d,nick) {return d[0].from;}
    );

    var partition = d3.layout.partition()
                        .value(function(d) {return d.count;})
                        .sort(function(a,b) {
                            return d3.descending(a.count,b.count);
                        })
                        .size([2*Math.PI, 300]);

    var nodes = partition.nodes(tree);

    var arc = d3.svg.arc()
                    .innerRadius(function(d) {return d.y; })
                    .outerRadius(function(d) {return d.depth ? d.y+d.dy/d.depth : 0 ; });

        nodes = nodes.map(function(d) {
            d.startAngle = d.x;
            d.endAngle = d.x+d.dx;
            return d;
        });

        nodes = nodes.filter(function(d) {return d.depth;})


    var chart = svg8.append('g')
                    .attr('transform', 'translate('+width8/2+' ,'+height8/2+')');
                
    var node = chart.selectAll('g')
                    .data(nodes)
                    .enter()
                    .append('g');

    node.append('path')
            .attr({d: arc,
                    fill: function(d) {return helpers.color(d.nick);}});

    node.filter(function(d) {return d.depth > 1 && d.count > 10; })
        .call(helpers.arc_labels(function(d) {return d.nick;},
        arc.outerRadius()));

    node.call(helpers.tooltip3(function(d) {return d.nick;}));


});

var width9 = 1024,
height9 = 2800,
svg9 = d3.select('#graph9')
        .append('svg')
        .attr({width: width9,
        height: height9});

d3.json('karma_matrix.json', function(data) { 
    var tree = helpers.make_tree(data,
        function (d, nick) { return d.to == nick; },
        function (d, nick) { return d.to == nick; },
        function (d) { return d.from; },
        function (d) { return d[0].from; });
        helpers.fixate_colors(data);

        var pack = d3.layout.pack()
            .padding(5)
            .size([width9/1.5, height9/1.5])
            .value(function (d) { return d.count; }); 

        var nodes = pack.nodes(tree);

        svg9.append('g')
            .attr('transform', 'translate(100, 100)')
            .selectAll('g')
            .data(nodes)
            .enter()
            .append('circle')
            .attr({r: function (d) { return d.r; },
                    cx: function (d) { return d.x; },
                    cy: function (d) { return d.y; }})
            .attr('fill', function (d) { return helpers.color(d.nick); })
            .call(helpers.tooltip4(function (d) { return d.nick; }));
});