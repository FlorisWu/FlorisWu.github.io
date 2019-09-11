const svg1=d3.select("#svg1");

const width1 = +svg1.attr('width');
const height1 = +svg1.attr('height');


const render = function(data) {
    const xValue = d => d.x // d => d.rating here is basically saying "for each datum in data, set its xValue to be its rating"
    const yValue = d => d.y
    const margin = { top:50, right:40, bottom:75, left:250};
    const innerWidth = width1 - margin.left - margin.right;
    const innerHeight = height1 - margin.top - margin.bottom;
    
    /* creating x scale for x axis */
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, xValue), d3.max(data, xValue)+0.1])
      .range([0, innerWidth]);
      
    console.log("d3.max(data, xValue):", d3.max(data, xValue));
    console.log("d3.min(data, xValue):", d3.min(data, xValue));
    console.log("data:", data);

    /* creating y scale for y axis */
    const yScale = d3.scaleLinear()
    .domain([d3.min(data, yValue), d3.max(data, yValue)+0.1])
      .range([0, innerHeight]);

    /* creating color scale to indicate the number of apps at each unique data point */
    var myColor = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { //setting range of color to be the range of our data
        return d.z;
      })) 
      .range(['rgb(152,202,249)','black']);

    // creating radius scale to for the bubble chart - larger count with larger size of circle on the chart and vice versa
    var circleSize = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { //setting range of color to be the range of our data
        return d.z;
      })) 
      .range([3,10]);

    
    /* grouping element a to make a rectangle which will be transformed to give us marginal space; 
    elements will then get added to this rectangle, such as text, circles... 
    this is done by a.append in the code below */
    const a = svg1.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`); //this line is using the margin convention to create some space for our axis at the margin
      /* margin.left pushes the rectangle to the right; margin.top pushes it down */

    /* showing 0.5 instead of 500m on the x axis, and keeping only one 0 after decimal point*/
    const xAxisTickFormat = number =>
      d3.format('.2s')(number)
        .replace('500', '0.5')
        .replace('m', ' ');

    

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(xAxisTickFormat)
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
       .text('Rating');

 
      /*a.append('text')
       .attr('class', 'title')
       .attr('y', -10) /* moving up by 10 px */
       /*.text('Category')*/

    /* creating the data points */
    a.selectAll('circle').data(data)
      .enter().append('circle') //using the "enter" function (of "enter", "update" and "exit") of a d3 data join here 
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', function(d) {return circleSize(d.z);})
        .attr("fill", function(d) {return myColor(d.z);})
    
      /* creating tooltips for data points */
      .on('click', function(d) {
        console.log(d);
      })
      .on("mousemove", function(d) {
        var mouse=d3.mouse(document.body);
        
        d3.select("#tooltip")
        .style("display", "block")
        .html(yValue(d) +" apps with rating "+xValue(d)+ ": " +d.count)
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

d3.csv("MDS_election_2008.csv", function(error, data) {
    

    data.forEach(function(d) {
        d.x = parseFloat(d.x);
        d.y = parseFloat(d.y);
        d.z = parseFloat(d.z);
    });

    console.log("csv:", data);
    
    //render(groupedCategory_Rating);
    render(data);
    

  });