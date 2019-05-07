const svg1 = d3.select("#svg1");

const width1 = +svg1.attr('width');
const height1 = +svg1.attr('height');

/*const svg3 = d3.select("#svg3");

const width3 = +svg3.attr('width');
const height3 = +svg3.attr('height'); */

var categoryNames = {
  "ART_AND_DESIGN": "Art and design",
  "AUTO_AND_VEHICLES": "Auto and vehicles",
  "BEAUTY": "Beauty",
  "BOOKS_AND_REFERENCE": "Books and reference",
  "BUSINESS": "Business",
  "COMICS": "Comics",
  "COMMUNICATION": "Communication",
  "DATING": "Dating",
  "EDUCATION": "Education",
  "ENTERTAINMENT": "Entertainment",
  "EVENTS": "Events",
  "FINANCE": "Finance",
  "FOOD_AND_DRINK": "Food and drink",
  "HEALTH_AND_FITNESS": "Health and fitness",
  "HOUSE_AND_HOME": "House and home",
  "LIBRARIES_AND_DEMO": "Libraries and demo",
  "LIFESTYLE": "Lifestyle",
  "GAME": "Game",
  "FAMILY": "Family",
  "MEDICAL": "Medical",
  "SOCIAL": "Social",
  "SHOPPING": "Shopping",
  "PHOTOGRAPHY": "Photography",
  "SPORTS": "Sports",
  "TRAVEL_AND_LOCAL": "Travel and local",
  "TOOLS": "Tools",
  "PERSONALIZATION": "Personalization",
  "PRODUCTIVITY": "Productivity",
  "PARENTING": "Parenting",
  "WEATHER": "Weather",
  "VIDEO_PLAYERS": "Video players",
  "NEWS_AND_MAGAZINES": "News and magazines",
  "MAPS_AND_NAVIGATION": "Maps and navigation"
};


const render = function(data) {
    const xValue = d => d.rating // d => d.rating here is basically saying "for each datum in data, set its xValue to be its rating"
    const yValue = d => d.category
    const margin = { top:50, right:40, bottom:75, left:250};
    const innerWidth = width1 - margin.left - margin.right;
    const innerHeight = height1 - margin.top - margin.bottom;
    
    /* creating x scale for x axis */
    const xScale = d3.scaleLinear()
      .domain([2.8, d3.max(data, xValue)+0.1])
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
      .range(['rgb(152,202,249)','black']);

    // creating radius scale to for the bubble chart - larger count with larger size of circle on the chart and vice versa
    var circleSize = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { //setting range of color to be the range of our data
        return d.count;
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

 
      a.append('text')
       .attr('class', 'title')
       .attr('y', -10) /* moving up by 10 px */
       .text('Category')

    /* creating the data points */
    a.selectAll('circle').data(data)
      .enter().append('circle') //using the "enter" function (of "enter", "update" and "exit") of a d3 data join here 
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', function(d) {return circleSize(d.count);})
        .attr("fill", function(d) {return myColor(d.count);})
    
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

  var groupedCategory_Rating_filtered = groupedCategory_Rating.filter(function(d) {
    return d.count >= 10;
  });

  console.log("grouped data filtered", groupedCategory_Rating_filtered);
  
  console.log("Grouped Categories and Rating", groupedCategory_Rating);
  //render(groupedCategory_Rating);
  render(groupedCategory_Rating_filtered);
  
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
      width = 1030 - margin.right - margin.left,
      height = 1000 - margin.top - margin.bottom,
      radius = width/3;


var color=d3.scaleOrdinal()
        //.range(["#87CEFA", "#1E90FF","#00BFFF", "#000080","#0000FF"])
        .range(["#BBDEFB", "#98CAF9", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2","#64B5F6"])


// generating the arc for the pie chart; we need the arc generator first before we can create the pie.
var arc = d3.arc()
      .outerRadius(radius-10) //specifying outer radius
      .innerRadius(radius-180); //specifying inner radius

// once you've set up the arc generator, you can set up the pie generator.
var pie = d3.pie()
      .sort(null) // we don't really want to sort any values
      .value(function(d) {
        return d.count; // returning value of each category
      });

var labelArc = d3.arc() // this function sets our labels to be at the outside of each arc
      .outerRadius(radius+60)
      .innerRadius(radius);

const svg2=d3.select("#svg2").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
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

  var g = svg2.selectAll(".arc") // this line is selecting all the elements with the class name "arc"; it doesnt exist yet, but it will after it reaches the line .enter().append()
        .data(pie(groupedCategory)) // for the pie function, if you go up and check the function, it returns d.count
        .enter().append("g") // all group elements "g" will have the class name "arc"; so we can style them together in css
        .attr("class", "arc");




  // append path of the arc
  g.append("path")
    .attr("d", arc) //passing the arc generator we created earlier
    .style("fill", function(d) {return color(d.data.category)})

    /* creating tooltips */
    .on('click', function(d) {
      console.log(d);
    })
    .on("mousemove", function(d) {
      var mouse=d3.mouse(document.body);
      
      d3.select("#tooltip")
      .style("display", "block")
      .html(d.data.category +" apps: " +d.data.count)
      .style("left", mouse[0]+"px")
      .style("top", mouse[1]-20+"px");
    })

    .on("mouseout", function(d) {
      d3.select("#tooltip")
           .style("display","none")
    })


    .transition() // transition, ease, duration and attrTween are used to create the animation where the pie chart pops up
    .ease(d3.easeLinear)
    .duration(3000)
    .attrTween("d", pieTween) // pieTween is defined at the bottom

      // append the text (labels)
  g.append("text")
  .transition() // transition, ease, duration and attrTween are used to create the animation where the text goes from center to outside
  .ease(d3.easeLinear)
  .duration(3000)
  
  .attr("transform", function(d) {return "translate(" + (labelArc.centroid(d)[0]-40) + "," + labelArc.centroid(d)[1] + ")";  }) //centroid helps identify the path of each text label from center to the edge; labelArc.centroid(d)[0]-40 is to re-adjust all the text lables by moving them to the left by 40 px
  //.attr("dy", ".35em")
  .text(function(d) {if (d.data.count >=300) {
    return d.data.category ;
  }})
    
    

  

});

  


function pieTween(b) {
  b.innerRadius = 0; // need to start at 0 to transition from 0 to a full arc
  var i = d3.interpolate({startAngle:0, endAngle:0}, b); // the angle should start at 0 and end at 0
  return function(t) {return arc(i(t));};

};

/*
var color1=['blue'];
var color2=['red'];

function drawBars(width,colors) {
  rectangles = svg3.selectAll('a').selectAll('rect');
  var Data = rectangles.data(colors);

  Data.enter().append('rect')
    .attr('y', d => yScale(yValue(d)))
    .attr('width', width)
    .attr('height', 20)
    .attr('fill', function(d) {return d;});

  Data
    .attr('y', d => yScale(yValue(d)))
    .attr('width', width)
    .attr('height', 20)
    .attr('fill', function(d) {return d;});

  Data.exit().remove();

};

/* Third visualization */ /*
const render2 = function(data) {
  const xValue = d => d.Reviews
  const xValue2 = d => d.Current_reviews
  const yValue = d => d.App
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
  
  /* group element g */ /*
  const a = svg3.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`); 

  
  const xAxisTickFormat = number =>
    d3.format('.3s')(number);
      //.replace('G', 'B');

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(-innerHeight); /* adding vertical lines */

/*
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
     .attr('y', -10) /* moving up by 10 px */ /*
     .text('Random title')

    
  
  
  a.selectAll('rect').data(data)
    .enter().append('rect')
      .attr('y', d => yScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth()/2)
      .attr('fill', "#64B5F6");

    /*a.data(data).append('rect')
      .attr('y', d => yScale(yValue(d)))
      .attr('width', d => xScale(xValue2(d)))
      .attr('height', yScale.bandwidth())
      .attr('fill', 'red') */

  
  /* remove unnecessary lines */ /*
  a.append('g')
    .call(d3.axisLeft(yScale))
    .selectAll('.domain, .tick line')
    .remove();
  
};



d3.csv("third_visualization.csv", function(error, data) {
  data.forEach(function(d) {
    d.Reviews =+ d.Reviews;
    d.Current_reviews =+ d.Current_reviews;
  });

 
  
  /*var currentData = data.filter(function(d) {
    return d.Rating <= 5 && d.Rating >= 0 && d.Reviews>=20000000;
  });
  console.log(currentData)*/ /*
  
  render2(data);
}); */

/*
d3.csv("googleplaystore.csv", function(error, data) {
  data.forEach(function(d) {
      d.Reviews = +d.Reviews;
  });
  render2(data);
});*/
