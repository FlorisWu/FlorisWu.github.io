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
});
