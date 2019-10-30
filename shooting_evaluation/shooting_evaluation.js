console.log("test");

const svg1 = d3.select("#svg1");

const width1 = +svg1.attr('width');
const height1 = +svg1.attr('height');



const render = function(data) {
    const xValue = d => d.pred // d => d.rating here is basically saying "for each datum in data, set its xValue to be its rating"
    const yValue = d => d.diff
    const margin = { top:50, right:40, bottom:75, left:250};
    const innerWidth = width1 - margin.left - margin.right;
    const innerHeight = height1 - margin.top - margin.bottom;
    
    /* creating x scale for x axis */
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, xValue)-0.01, d3.max(data, xValue)+0.01])
      .range([0, innerWidth]);
      
    /* creating y scale for y axis */
    const yScale = d3.scaleLinear()
        .domain([-d3.min(data, yValue)+0.01, -d3.max(data, yValue)-0.04])
        .range([0, innerHeight]);



    
    /* grouping element a to make a rectangle which will be transformed to give us marginal space; 
    elements will then get added to this rectangle, such as text, circles... 
    this is done by a.append in the code below */
    const a = svg1.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`); //this line is using the margin convention to create some space for our axis at the margin
      /* margin.left pushes the rectangle to the right; margin.top pushes it down */

    /* showing 0.5 instead of 500m on the x axis, and keeping only one 0 after decimal point*/
    const xAxisTickFormat = number =>
      d3.format('.2s')(number);
        //.replace('500', '0.5')
        //.replace('m', ' ');

    

    const xAxis = d3.axisBottom(xScale)
      //.tickFormat(xAxisTickFormat)
      .tickSize(-innerHeight); /* adding vertical lines */


      const xAxisA = a.append('g').call(xAxis)
      .attr('transform', `translate(0, ${innerHeight})`);

    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth); 


      const yAxisA = a.append('g').call(yAxis);
          //.attr('transform', `translate(0, ${innerWidth})`);
 
     //xAxisA.select('.domain').remove();
 
     xAxisA.append('text')
       .attr('class', 'axis-label')
       .attr('y', 60) //specifying y position if the label "Rating"
       .attr('x', innerWidth / 2) // specifying x position
       //.attr('fill', 'black')
       .text('Shot quality');

 
      a.append('text')
       .attr('class', 'title')
       .attr('y', -10) /* moving up by 10 px */
       .text('Shooter quality')

    /* creating the data points */
    a.selectAll('circle').data(data)
      .enter().append('circle') //using the "enter" function (of "enter", "update" and "exit") of a d3 data join here 
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', 3)
        //.attr("fill", function(d) {return myColor(d.count);})
    
      /* creating tooltips for data points */
      .on('click', function(d) {
        console.log(d);
      })
      .on("mousemove", function(d) {
        var mouse=d3.mouse(document.body);
        
        d3.select("#tooltip")
        .style("display", "block")
        .html(d.Group)
        .style("left", mouse[0]+"px")
        .style("top", mouse[1]-20+"px");
      })

      .on("mouseout", function(d) {
        d3.select("#tooltip")
             .style("display","none")
      });
    
    
    /* remove unnecessary lines */
    /*a.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('.domain')
      .remove();*/

    
        
};



d3.csv("shooting_evaluation.csv", function(error, data) {
  console.log("csv:", data);
  data.forEach(function(d) {
    d.diff =+ d.diff;
    d.pred =+ d.pred 
});
render(data);
});
