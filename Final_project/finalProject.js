const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

var categoryNames = {
  "ART_AND_DESIGN": "art and design",
  "AUTO_AND_VEHICLES": "auto and vehicles",
  "BEAUTY": "beauty",
  "BOOKS_AND_REFERENCE": "books and reference",
  "BUSINESS": "business",
  "COMICS": "comics",
  "COMMUNICATION": "communication",
  "DATING": "dating",
  "EDUCATION": "education",
  "ENTERTAINMENT": "entertainment",
  "EVENTS": "events",
  "FINANCE": "finance",
  "FOOD_AND_DRINK": "food and drink",
  "HEALTH_AND_FITNESS": "health and fitness",
  "HOUSE_AND_HOME": "house and home",
  "LIBRARIES_AND_DEMO": "libraries and demo",
  "LIFESTYLE": "lifestyle",
  "GAME": "game",
  "FAMILY": "family",
  "MEDICAL": "medical",
  "SOCIAL": "social",
  "SHOPPING": "shopping",
  "PHOTOGRAPHY": "photography",
  "SPORTS": "sports",
  "TRAVEL_AND_LOCAL": "travel and local",
  "TOOLS": "tools",
  "PERSONALIZATION": "personalization",
  "PRODUCTIVITY": "productivity",
  "PARENTING": "parenting",
  "WEATHER": "weather",
  "VIDEO_PLAYERS": "video players",
  "NEWS_AND_MAGAZINES": "news and magazines",
  "MAPS_AND_NAVIGATION": "maps and navigation"
};


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
    
      /* creating tooltips for data points */
      .on('click', function(d) {
        console.log(d);
      })
      .on("mousemove", function(d) {
        var mouse=d3.mouse(document.body);
        
        d3.select("#tooltip")
        .style("display", "block")
        .html("Number of "+ yValue(d) +" apps with rating "+xValue(d)+ ": " +d.count)
        .style("left", mouse[0]+"px")
        .style("top", mouse[1]-20+"px");
      })

      .on("mouseout", function(d) {
        d3.select("#tooltip")
             .style("display","none")
      });
    
    
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
    d.newNames = categoryNames[d.Category]
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
    d.category = d.values[0].newNames; //finding the unique category for each unique data point so we dont have to put multiple data points at one location
  });

  groupedCategory_Rating.forEach(function(d) {
    d.rating = d.values[0].Rating; //finding unique rating for each data point
  });
  
  console.log("Grouped Categories and Rating", groupedCategory_Rating);
  render(groupedCategory_Rating);
  
console.log("Current Data", currentData);
});



