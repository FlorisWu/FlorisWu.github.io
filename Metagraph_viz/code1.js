//d3.select('rect').transition().style('fill','red')

d3.select('rect')
    .transition().style('fill','red').attr('x',200)
    .transition().attr('y',200)

/*d3.select('rect')
    .transition().style('fill','red')
    .each('start', function(){console.log("Stahp, you are making me blush");})
    .each('end', function() {console.log("crap, I am all red now");})*/


d3.select('svg')
    .append('text')
    .attr({x:100,y:100})
    .text("I'm growing!")
    .transition()
    .styleTween('font',function () {
        return d3.interpolate('12px Helvetica','36px Comic Sans MS')
    })
    .duration(3000);


var width=1024,
    height=768,
    svg1=d3.select('#graph1')
            .append('svg')
            .attr({width:width,
                    height:height});

var eases = ['linear', 'poly(4)','quad', 'cubic', 'sin', 'exp', 'circle', 'elastic(10,-5)','back(0.5)',
                'bounce','cubic-in','cubic-out','cubic-in-out','cubic-out-in'],
    y=d3.scale.ordinal().domain(eases).rangeBands([50,500]);

eases.forEach(function (ease) {
    var transition = svg1.append('circle')
    .attr({cx:130, // creating new circles
        cy: y(ease), // y scale for vertical replacement
        r: y.rangeBand()/2-5})  
    .transition()
    .delay(400)
    .duration(2900)
    .attr({cx:400});


    if (ease.indexOf('(') > -1) { // this code checks the number inside the parentheses in the ease string
        var args = ease.match(/[0-9]+/g),
            type = ease.match(/^[a-z]+/);

        transition.ease(type, args[0],args[1]);
    } else {
        transition.ease(ease);
    }

svg1.append('text')
        .text(ease)
        .attr({x:10,
        y: y(ease)+5}); });


var width2 = 1000,
    height2 = 900,
    svg2 = d3.select('#graph2')
            .append('svg')
            .attr({width:width2,
            height:height2});

var position = function(t) {
    var a=80, b=1, c=1, d=80;
    return {x: Math.cos(a*t) - Math.pow(Math.cos(b*t),3),
            y: Math.sin(c*t) - Math.pow(Math.sin(d*t),3)};
};

var t_scale = d3.scale.linear().domain([500,25000]).range([0,2*Math.PI]),
    x = d3.scale.linear().domain([-2,2]).range([100,width-100]),
    y = d3.scale.linear().domain([-2,2]).range([height-100,100]);

var brush = svg2.append('circle') // "brush" to fly around and pretend it's drawing
                .attr({r:4}),
    previous = position(0); // variable to hold the "previous" position so that we can draw straight lines


var step = function(time) { // moves the brush and draws a line between previous and current points
    if (time > t_scale.domain()[1]) {
        return true;
    }

    var t = t_scale(time),
        pos = position(t);

    brush.attr({cx: x(pos.x),
                cy: y(pos.y)});
    svg2.append('line')
        .attr({x1: x(previous.x),
                y1: y(previous.y),
                x2: x(pos.x),
                y2: y(pos.y),
                stroke: 'steelblue',
                'stroke-width': 1.3});
    previous = pos;
};

var timer = d3.timer(step, 500);

var width3 = 1024,
    height3 = 768,
    svg3 = d3.select('#graph3')
            .append('svg')
            .attr({width: width3,
                    height: height3});

var radiate = function(pos) { //creating a function that will emulate ripples in a pond using 3 circles
    d3.range(3).forEach(function(d) {
        svg3.append('circle')
            .attr({cx: pos[0],
                    cy: pos[1],
                    r: 0})
            .style('opacity','1')
            .transition()
            .duration(1000)
            .delay(d*50)
                .attr('r',50)
                .style('opacity', '0.00001')
                .remove();
    });
}; // the rariate function creates three circles centered around [x,y]; 
// a transition will grow the circles, reduce their opacity, and in the end, remove them

svg3.on('click', function () {
    radiate(d3.mouse(this));
})

svg3.on('touchstart', function () {
    d3.touches(this).map(radiate);
});


var width4 = 1200,
    height4 = 450,
    svg4 = d3.select('#graph4')
            .append('svg')
            .attr({width: width4,
                    height: height4});

svg4.append('image')
   .attr({'xlink:href':'parallax_base.png',
            width: width4,
            height: height4});
        
var screen_width = 900,
    lines = d3.range(screen_width/6),
    x = d3.scale.ordinal().domain(lines).rangeBands([0,screen_width]);

svg4.append('g')
    .selectAll('line')
    .data(lines)
    .enter()
    .append('line')
    .style('shape-rendering','crispEdges')
    .attr({stroke: 'black',
            'stroke-width': x.rangeBand()-1,
            x1: function(d) {return x(d);},
            y1:0,
            x2: function(d) {return x(d);},
            y2: height});

var drag = d3.behavior.drag()
        .origin(Object)
        .on('drag',function() {
            d3.select(this)
              .attr('transform', 'translate('+d3.event.x+',0)')
              .datum({x: d3.event.x, y:0});
        })

svg4.select('g')
    .datum({x:0,y:0})
    .call(drag);