// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
  }
  
  // Function to navigate to Lab 5 page
  function goToOtherPage() {
    window.location.href = "index.html";
  }
  
  function goToOtherPage2() {
    window.location.href = "page2.html";
  }
  
  function goToOtherPage3() {
      window.location.href = "page3.html";
    }
  
  // Function to fetch weather data from the server
  async function fetchWeatherData(date) {
    try {
        const response = await fetch(`/weather/${date}`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
  }
  




  // LAB 7
  
  // Define dimensions and margins for the SVG
  const width = 600;
  const height = 500; // Adjusted height for both visualizations
  const margin = { top: 20, right: 20, bottom: 100, left: 40 };
  
  // Calculate inner width and height
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Select the container element for the bar chart
  const svgBarChart = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height / 2); // Half of the height for the bar chart
  
  // Create a group element for the bar chart and translate it to have margins
  const gBarChart = svgBarChart.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Fetch data from MongoDB server for the bar chart
  fetch("/fetchHistoricalWeather")
    .then(response => response.json())
    .then(data => {
      // Create scales for the bar chart
      const xScaleBarChart = d3.scaleBand()
        .domain(data.map((d, i) => i.toString()))
        .range([0, innerWidth])
        .padding(0.1);
  
      const yScaleBarChart = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.temp_max)])
        .range([innerHeight / 2, 0]); // Half of the inner height for the bar chart
  
      // Add bars to the bar chart
      gBarChart.selectAll("rect")
        .data(data)
        .enter().append("rect")
          .attr("x", (d, i) => xScaleBarChart(i.toString()))
          .attr("y", d => yScaleBarChart(d.temp_max))
          .attr("width", xScaleBarChart.bandwidth())
          .attr("height", d => innerHeight / 2 - yScaleBarChart(d.temp_max))
          .attr("fill", "steelblue");
  
      // Add x-axis for the bar chart
      gBarChart.append("g")
        .attr("transform", `translate(0, ${innerHeight / 2})`)
        .call(d3.axisBottom(xScaleBarChart));
  
      // Add y-axis for the bar chart
      gBarChart.append("g")
        .call(d3.axisLeft(yScaleBarChart));
    })
    .catch(error => {
      console.error("Error fetching data for bar chart:", error);
    });
  
  // Select the container element for the line graph
  const svgLineGraph = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height / 2); // Half of the height for the line graph
  
  // Create a group element for the line graph and translate it to have margins
  const gLineGraph = svgLineGraph.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Fetch data from MongoDB server for the line graph
  fetch("/fetchHistoricalWeather")
    .then(response => response.json())
    .then(data => {
      // Parse date strings to Date objects
      data.forEach(d => {
        d.date = new Date(d.date);
      });
  
      // Create scales for the line graph
      const xScaleLineGraph = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, innerWidth]);
  
      const yScaleLineGraph = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.temp_max)])
        .range([innerHeight / 2, 0]); // Half of the inner height for the line graph
  
      // Define the line function for the line graph
      const line = d3.line()
        .x(d => xScaleLineGraph(d.date))
        .y(d => yScaleLineGraph(d.temp_max));
  
      // Add the line to the line graph
      gLineGraph.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);
  
      // Add x-axis for the line graph
      gLineGraph.append("g")
        .attr("transform", `translate(0, ${innerHeight / 2})`)
        .call(d3.axisBottom(xScaleLineGraph));
  
      // Add y-axis for the line graph
      gLineGraph.append("g")
        .call(d3.axisLeft(yScaleLineGraph));
    })
    .catch(error => {
      console.error("Error fetching data for line graph:", error);
    });
    
  // Select the container element for the scatter plot
  const svgScatterPlot = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height / 2); // Half of the height for the scatter plot
  
  // Create a group element for the scatter plot and translate it to have margins
  const gScatterPlot = svgScatterPlot.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Fetch data from MongoDB server for the scatter plot
  fetch("/fetchHistoricalWeather")
    .then(response => response.json())
    .then(data => {
      // Create scales for the scatter plot
      const xScaleScatterPlot = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.temp_max)])
        .range([0, innerWidth]);
  
      const yScaleScatterPlot = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.humidity)])
        .range([innerHeight / 2, 0]); // Half of the inner height for the scatter plot
  
      // Add circles to the scatter plot
      gScatterPlot.selectAll("circle")
        .data(data)
        .enter().append("circle")
          .attr("cx", d => xScaleScatterPlot(d.temp_max))
          .attr("cy", d => yScaleScatterPlot(d.humidity))
          .attr("r", 5) // Adjust the radius as needed
          .attr("fill", "steelblue")
          .attr("opacity", 0.7);
  
      // Add x-axis for the scatter plot
      gScatterPlot.append("g")
        .attr("transform", `translate(0, ${innerHeight / 2})`)
        .call(d3.axisBottom(xScaleScatterPlot))
        .append("text")
          .attr("fill", "#000")
          .attr("x", innerWidth)
          .attr("y", -10)
          .attr("text-anchor", "end")
          .text("Max Temperature");
  
      // Add y-axis for the scatter plot
      gScatterPlot.append("g")
        .call(d3.axisLeft(yScaleScatterPlot))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Humidity (%)");
    })
    .catch(error => {
      console.error("Error fetching data for scatter plot:", error);
    });