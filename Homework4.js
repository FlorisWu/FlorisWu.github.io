var title1 = d3.select("#title2");

title1
    .style("color","black")
    .style("font-family", "Arial");

var svg = d3.select("svg");
var rect1=svg.selectAll(".rect1");
var rect2=svg.selectAll(".rect2");

rect1.style("fill", "pink");
rect2.style("fill", "black");

function removeRect1() {
    var Rect1s = svg.selectAll(".rect1")
        .data([]);

    Rect1s.exit().remove();
}

function enterRect1() {
    var Rectangles=svg.selectAll(".rect1")
        .data([1]);
    
    Rectangles.enter().append("rect")
        .attr("class","rect1")
        .attr("x", 100)
        .attr("y", 140)
        .attr("width",30)
        .attr("height",123)
        .style("fill", "pink");
    
        Rectangles.enter().append("rect")
        .attr("class","rect1")
        .attr("x", 200)
        .attr("y", 118)
        .attr("width",30)
        .attr("height",145)
        .style("fill", "pink");

        Rectangles.enter().append("rect")
        .attr("class","rect1")
        .attr("x", 300)
        .attr("y", 106)
        .attr("width",30)
        .attr("height",157)
        .style("fill", "pink");

        Rectangles.enter().append("rect")
        .attr("class","rect1")
        .attr("x", 400)
        .attr("y", 100)
        .attr("width",30)
        .attr("height",163)
        .style("fill", "pink");

        Rectangles.enter().append("rect")
        .attr("class","rect1")
        .attr("x", 500)
        .attr("y", 118)
        .attr("width",30)
        .attr("height",145)
        .style("fill", "pink");

}


