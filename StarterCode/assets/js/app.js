// @TODO: YOUR CODE HERE!

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = 1000;
var height = 500;


function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth*0.6;
    var svgHeight = window.innerHeight-300;



 width = svgWidth - margin.left - margin.right;
 height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our scatter,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "poverty";


// Initial Params
var chosenYAxis = "healthcare";


// Import Data
d3.csv("assets/data/data.csv").then(function(stateData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
      // create date parser
      //var dateParser = d3.timeParse("%d-%b");
    console.log(stateData);
      //rockband,hair_length,num_hits
      // parse data
      //id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,
      //healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,dataSet

      stateData.forEach(function(data) {
        data.state = data.state;
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        
      });

      // create scales
      var xLinearScale = xScale(stateData, chosenXAxis);

      var yLinearScale = yScale(stateData, chosenYAxis);
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);



     var xAxis = chartGroup.append("g")
     .classed("x-axis", true)
     .attr("transform", `translate(0, ${height})`)
     .call(bottomAxis);

     var yAxis = chartGroup.append("g")
     .call(leftAxis);


   // append circles
var circlesGroup = chartGroup.selectAll("circle")
     .data(stateData)
     .enter()
     .append("circle")
     .attr("cx", d => xLinearScale(d[chosenXAxis]))
     .attr("cy", d => yLinearScale(d[chosenYAxis]))
     .attr("r", "22")
     .attr("fill", "blue")
     .attr("opacity", "0.9");
console.log(stateData);



var textVal = chartGroup.selectAll("text")
.data(stateData)
.enter()
.append("text")
.attr("x", d => xLinearScale(d[chosenXAxis])-10)
.attr("y", d => yLinearScale(d[chosenYAxis])+7)
.attr("font-size", "15px")
.attr("color", "white")
.attr("font-weight", "bold")
.attr("value", d => function(d) {return d.abbr})
.attr("text", d => function(d) {return d.abbr})
.text( function(d) {return `${d.abbr}`});




     var labelsXGroup = chartGroup.append("g")
     .attr("transform", `translate(${width / 2}, ${height + 20})`);
     var labelsYGroup = chartGroup.append("g")
     .attr("transform", `translate(0, ${height/2})`);
     


        
        var povertyLabel = labelsXGroup.append("text")
        .attr("y", 10)
        .attr("x", (width/8))
        .attr("dx", "1em")
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("in Poverty (%)");        

        var ageLabel = labelsXGroup.append("text")
        .attr("y", 30)
        .attr("x", (width/8))
        .attr("dx", "5em")
        .attr("class", "axisText")
        .attr("value", "age") // value to grab for event listener
        .classed("active", false)
        .classed("inactive", true)
        .attr("font-weight", "bold")
        .text("Age(Median)");      
        
        var householdIncomeLabel = labelsXGroup.append("text")
        .attr("y", 50)
        .attr("x", (width/8))
        .attr("dx", "5em")
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .attr("value", "income") // value to grab for event listener
        .classed("active", false)
        .classed("inactive", true)
        .text("Household Income (Median)");              

        var healthCareLabel = labelsYGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 4))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .classed("inactive", false)
        .text("Lacks Healthcare(%)");        

        var smokesLabel = labelsYGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - (height / 4))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .attr("value", "smokes") // value to grab for event listener
        .classed("active", false)
        .classed("inactive", true)
        .text("Smokines(%)");    
        

        var obeseLabel = labelsYGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 50)
        .attr("x", 0 - (height / 4))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("value", "obesity") // value to grab for event listener
        .classed("active", false)
        .classed("inactive", true)
        .attr("font-weight", "bold")
        .text("Obese(%)");     
        

         // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup,textVal);

  labelsXGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log("chosenXAxis");
        console.log(chosenXAxis);
        console.log("chosenYAxis");
        console.log(chosenYAxis);
        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);
        yLinearScale =yScale(stateData, chosenYAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);
        
        textVal = renderText(textVal, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup,textVal);

        // changes classes to change bold text
        if (chosenXAxis === "income") {
          householdIncomeLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if(chosenXAxis === "age") {
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
          povertyLabel
          .classed("active", false)
          .classed("inactive", true);
          householdIncomeLabel
          .classed("active", false)
          .classed("inactive", true);
          } else {
            povertyLabel
            .classed("active", true)
            .classed("inactive", false);
            ageLabel
            .classed("active", false)
            .classed("inactive", true);
            householdIncomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        
        
      }
    });

    labelsYGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);
        yLinearScale =yScale(stateData, chosenYAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);
        textVal = renderText(textVal, xLinearScale, chosenXAxis,yLinearScale, chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup,textVal);

        // changes classes to change bold text
       
      

        if (chosenYAxis === "smokes") {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
            healthCareLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if(chosenYAxis === "obesity") {
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
          smokesLabel
          .classed("active", false)
          .classed("inactive", true);
          healthCareLabel
          .classed("active", false)
          .classed("inactive", true);
          } else {
            healthCareLabel
            .classed("active", true)
            .classed("inactive", false);
            smokesLabel
            .classed("active", false)
            .classed("inactive", true);
            obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }        
      }
    });
    // Step 2: Create scale functions
    // ==============================

    // Step 3: Create axis functions
    // ==============================

    // Step 4: Append Axes to the chart
    // ==============================

    // Step 5: Create Circles
    // ==============================

    // Step 6: Initialize tool tip
    // ==============================

    // Step 7: Create tooltip in the chart
    // ==============================

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================

    // Create axes labels

  }).catch(function(error) {
    console.log(error);
  });

}
  
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis]) * 1.05
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating x-scale var upon click on axis label
function yScale(stateData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([0,
      d3.max(stateData, d => d[chosenYAxis]) * 1.1
    ])
    .range([height,0]);

  return yLinearScale;

}  

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

 // function used for updating xAxis var upon click on axis label
 function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function renderText(textVal, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textVal.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis])-10)
    .attr("y", d => newYScale(d[chosenYAxis])+7);
  return textVal;
}

function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup, textVal) {

  
/*
var label;
  if (chosenXAxis === "poverty") {
    label = "Hair Length:";
  }
  else {
    label = "# of Albums:";
  }
*/

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border", "solid")
 .style("border-width", "2px")
 .style("border-radius", "5px")
 .style("padding", "5px")
    .style("color", "white")
    .html(function(d) {
      return (`<strong>${(d.state)}</strong><br>Poverty  :${d[chosenXAxis]}<br>HealthCare :${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  

  circlesGroup.on("mouseover", function(d) {
      d3.select(this)
      .transition()
      .duration(10000)
      toolTip.show(d, this);
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function(d) {
       d3.select(this)
       .transition()
       .duration(500)
        toolTip.hide(d);
      });

      textVal.on("mouseover", function(d) {
          d3.select(this)
          .transition()
          .duration(10000)
          toolTip.show(d, this);
        })
        // Step 4: Create "mouseout" event listener to hide tooltip
          .on("mouseout", function(d) {
           d3.select(this)
           .transition()
          .attr("fill", "white")
           .duration(500)
            toolTip.hide(d);
          });     

  return circlesGroup;
}  


