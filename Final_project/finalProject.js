d3.csv("googleplaystore.csv", function(error, data) {
    console.log("csv:", data);
});

const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = function(data) {
    const xValue = d => d.Rating
    const yValue = d => d.Category
    const margin = { top:50, right:40, bottom:75, left:250};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, xValue)])
      .range([0, innerWidth]);
      
    const yScale = d3.scalePoint()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.5);
    
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

    a.selectAll('circle').data(data)
      .enter().append('circle')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', 3);
    
    /* remove unnecessary lines */
    a.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('.domain')
      .remove();
    
};

d3.csv("googleplaystore.csv", function(error, data) {
    data.forEach(function(d) {
        d.Rating = +d.Rating;
    });
    render(data);
});