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

  console.log("Grouped Categories", groupedCategory);
  
  console.log("Partitioned grouped categories", partition(groupedCategory));
  chart(groupedCategory);


});


const chart = function(data) {
  
  //const root = partition(data);

  //root.each(d => d.current = d)

  const svg2 = d3.select("#svg2")
  const width2 = +svg2.attr('width');
  const height2 = +svg2.attr('height');

  //const svg = d3.select(DOM.svg(width, width))
  //    .style("width", "100%")
  //    .style("height", "auto")
  //    .style("font", "10px sans-serif")

  const g = svg2.append("g") //like before, this is creating a rectangle so we can append elements to the rectangle? 
      .attr("transform", `translate(${width2 / 2},${width2 / 2})`); // providing marginal space?

  const path = g.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1)) // accessing the "descendants" of the "root" in "partition"
    .join("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); }) // I think this line is saying that if the "depth" is bigger than 1, then make it a parent and assign some color
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0) // arcVisible function is defined later
      .attr("d", d => arc(d.current)); // this creates an arc/curve

  path.filter(d => d.children)
      .style("cursor", "pointer") //This makes the first layer of "children" clickable
      .on("click", clicked);

  path.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

  const label = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current)) //labelVisible function is defined later
      .attr("transform", d => labelTransform(d.current)) //labelTransform function is defined later
      .text(d => d.data.name);

  const parent = g.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

  function clicked(p) {
    parent.datum(p.parent || root);

    root.each(d => d.target = {
      x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      y0: Math.max(0, d.y0 - p.depth),
      y1: Math.max(0, d.y1 - p.depth)
    });

    const t = g.transition().duration(750);

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    path.transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => d.current = i(t);
        })
      .filter(function(d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
      })
        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        .attrTween("d", d => () => arc(d.current));

    label.filter(function(d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform(d.current));
  }
  
  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  return svg.node();
}

const partition = data => {  //this splits the data into "parent" "children" format
  const root = d3.hierarchy(data)
    .sum(d => d.value) // I think this line assigns a value to each "child"
    .sort((a, b) => b.value - a.value); // I think this line sort out which "child" belongs to which "parent"?
  return d3.partition()
      .size([2 * Math.PI, root.height + 1]) // this is drawing the circle; hence the pi?
    (root);
}
  
      



