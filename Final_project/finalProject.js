const svg1 = d3.select("#svg1");

const width1 = +svg1.attr('width');
const height1 = +svg1.attr('height');

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
    const xValue = d => d.rating // d => d.rating here is basically saying "for each datum in data, set its xValue to be its rating"
    const yValue = d => d.category
    const margin = { top:50, right:40, bottom:75, left:250};
    const innerWidth = width1 - margin.left - margin.right;
    const innerHeight = height1 - margin.top - margin.bottom;
    
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
      .enter().append('circle') //using the "enter" function (of "enter", "update" and "exit") of a d3 data join here 
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
    d.newNames = categoryNames[d.Category] //rewriting names of categories
  });
  
  var currentData = data.filter(function(d) {
    return d.Rating <= 5 && d.Rating >= 0;
  });
  
  var groupedCategory_Rating = d3.nest() //grouping data by category and rating
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

  var groupedCategory = d3.nest() //grouping data by category
    .key(function(d) {
      return d.Category;
    })
    .entries(currentData);

  groupedCategory.forEach(function(d) {
    d.count = d.values.length;
    d.name = d.values[0].newNames;
  })

  
console.log("grouped catogories", groupedCategory)
});



/* second visualization */
 


// setting up margin and radius
var margin = {top:20,right:20,bottom:20,left:20},
      width = 500 - margin.right - margin.left,
      height = 500 - margin.top - margin.bottom,
      radius = width/2;

// generating the arc for the pie chart; we need the arc generator first before we can create the pie.
var arc = d3.arc()
      .outerRadius(radius-10) //specifying outer radius
      .innerRadius(0); //specifying intter radius

// once you've set up the arc generator, you can set up the pie generator.
var pie = d3.pie()
      .sort(null) // we don't really want to sort any values
      .value(function(d) {
        return d.count; // returning value of each category
      });

var labelArc = d3.arc() // this function sets our labels to be in the center of each arc
      .outerRadius(radius-50)
      .innerRadius(radius-50);

const svg2=d3.select("#svg2");

//const width2 = +svg2.attr('width');
//const height2 = +svg2.attr('height');

const g = svg2.append('g') //just like before, we are creating a group element
        .attr('transform', "translate(" + width/2 + "," + height/2 + ") "); //translating so that the center of is at half of the width and half of the height


// import data using the d3.csv() function
d3.csv("googleplaystore.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.Rating =+ d.Rating;
    d.newNames = categoryNames[d.Category] //rewriting names of categories
  });
  
  var currentData = data.filter(function(d) {
    return d.Rating <= 5 && d.Rating >= 0;
  });

  var groupedCategory = d3.nest() //grouping data by category
    .key(function(d) {
      return d.Category;
    })
    .entries(currentData);

  groupedCategory.forEach(function(d) {
    d.count = d.values.length;
    d.name = d.values[0].newNames;

  });

  console.log(groupedCategory);

  // parse data
  groupedCategory.forEach(function(d) {
    d.count = d.count;
    d.category = d.name;
  });

  //console.log(groupedCategory);

  // now we need to create the arcs using the SVG. the arc element does not exist on the DOM but will be created after through the enter function
  // append g elements (arc)

  var g = svg2.selectAll("arc") // this line is selecting all the elements with the class name "arc"; it doesnt exist yet, but it will after it reaches the line .enter().append()
        .data(pie(groupedCategory)) // for the pie function, if you go up and check the function, it returns d.count
        .enter().append("g") // all group elements "g" will have the class name "arc"; so we can style them together in css
        .attr("class", "arc");

  // append path of the arc
  g.append("path")
    .attr("d", arc) //passing the arc generator we created earlier
    .style("fill", "blue")

  // append the text (labels)
  g.append("text")
    .attr("transform", function(d) {return "translate(" + labelArc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function(d){ return d.category;} );

});

