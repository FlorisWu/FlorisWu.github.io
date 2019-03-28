const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = function(data) {
    const xValue = d => d.rating
    const yValue = d => d.category
    const margin = { top:50, right:40, bottom:75, left:250};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    /* creating x scale for x axis */
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, xValue)])
      .range([0, innerWidth]);
      
    /* creating y scale for y axis */
    const yScale = d3.scalePoint()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.5);

    /* creating color scale to indicate the number of apps at each unique data point */
    var myColor = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { //setting range of color to be the range of our data
        return d.count;
      })) 
      .range(['Khaki','black']);

    
    /* group element g */
    const a = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    /* showing M (million) instead of G on the x axis */
    const xAxisTickFormat = number =>
      d3.format('.3s')(number)
        .replace('G', 'B');

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(xAxisTickFormat)
      .tickSize(-innerHeight); /* adding vertical lines */


      const xAxisA = a.append('g').call(xAxis)
      .attr('transform', `translate(0, ${innerHeight})`);
 
     xAxisA.select('.domain').remove();
 
     xAxisA.append('text')
       .attr('class', 'axis-label')
       .attr('y', 60) 
       .attr('x', innerWidth / 2)
       .attr('fill', 'black')
       .text('Rating');
 
     a.append('text')
       .attr('class', 'title')
       .attr('y', -10) /* moving up by 10 px */
       .text('Category')

    /* creating the data points */
    a.selectAll('circle').data(data)
      .enter().append('circle')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', 3)
        .attr("fill", function(d) {
          return myColor(d.count);
        })
      .on("mouseover", function(d) {
        var xPosition = d3.select(this).attr("cx")
        var yPosition = d3.select(this).attr("cy")
    
    
        d3.select("tooltip")
        .style("left", xPosition+"px")
        .style("top", yPosition+"px")
        .select("#value")
        .text(d);
      
        d3.select("#tooltip").classed("hidden", false);
       })
       .selectAll("circle")
         .on("mouseout", function() {
          d3.select("#tooltip").classed("hidden", true);
       })
    
    
    /* remove unnecessary lines */
    a.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('.domain')
      .remove();

    
        
};


d3.csv("googleplaystore.csv", function(error, data) {
  console.log("csv:", data);
  data.forEach(function(d) {
    d.Rating =+ d.Rating;
  });
  
  var currentData = data.filter(function(d) {
    return d.Rating <= 5 && d.Rating >= 0;
  });
  
  var groupedCategory_Rating = d3.nest() //grouping data by category
    .key(function(d) {
      return d.Category + " " + d.Rating;
    })
    .entries(currentData); // d3.nest always needs this .entries line!
  
  groupedCategory_Rating.forEach(function(d) {
    d.count = d.values.length; //finding count of apps for each unique data point
  });

  groupedCategory_Rating.forEach(function(d) {
    d.category = d.values[0].Category; //finding the unique category for each unique data point so we dont have to put multiple data points at one location
  });

  groupedCategory_Rating.forEach(function(d) {
    d.rating = d.values[0].Rating; //finding unique rating for each data point
  });
  
  console.log("Grouped Categories and Rating", groupedCategory_Rating);
  render(groupedCategory_Rating);
  
console.log("Current Data", currentData);
});



