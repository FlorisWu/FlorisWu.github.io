console.log("hello!")

var title = d3.select("#title");

title
    .attr("class", "big")
    .style("color","red")
    .style("font-family", "Comic Sans MS");

var svg = d3.select("svg");
var circles=svg.selectAll(".dot");

function changeColor(color){
    d3.selectAll(".dot").attr("fill", color);
}

function dance() {
    circles.attr("cx", function() {
        return Math.random() * 200;
    });
}

var starterData = [
    {name: "A", height: 72},
    {name: "B", height: 67},
    {name: "C", height: 64},
    {name: "D", height: 86}
];


function redrawCircles() {
    var newCircles=svg.selectAll(".dot")
        .data(starterData);
    
    newCircles.enter().append("circle")
        .attr("class","dot")
        .attr("cx", function() {
            return Math.random() * 200;
        })
        .attr("cy", 50)
        .attr("r", 20);

    newCircles.attr("r", function(d){
        return d.height / 2;
    });

    newCircles.exit().remove();
}