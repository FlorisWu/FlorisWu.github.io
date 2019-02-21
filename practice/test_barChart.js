const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = function(data) {
    const xValue = d => d.random_variable
    const yValue = d => d.country
    const margin = { top:50, right:40, bottom:75, left:250};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, xValue)])
      .range([0, innerWidth]);
      
    const yScale = d3.scaleBand()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.1);
    
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
       .text('x axis');
 
     a.append('text')
       .attr('class', 'title')
       .attr('y', -10) /* moving up by 10 px */
       .text('Random title')

    a.selectAll('rect').data(data)
      .enter().append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height', yScale.bandwidth());
    
    /* remove unnecessary lines */
    a.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('.domain, .tick line')
      .remove();
    
};

d3.csv("testData_barchart.csv", function(error, data) {
    data.forEach(function(d) {
        d.random_variable = +d.random_variable*1000;
    });
    render(data);
});