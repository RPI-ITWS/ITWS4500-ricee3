//index.js

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



// // Event listener for form submission
// document.getElementById('weatherForm').addEventListener('submit', async (event) => {
//   event.preventDefault();
//   const date = document.getElementById('weatherDateInput').value;

//   try {
//       // Fetch weather data from the server
//       const weatherData = await fetchWeatherData(date);
//       // Update UI with weather data
//       updateWeatherUI(weatherData);
//   } catch (error) {
//       console.error('Error fetching weather data:', error);
//       alert('Failed to fetch weather data');
//   }
// });
// // Define a global array to store the history of all weather data submissions
// let weatherSubmissionHistory = [];

// // Function to update UI with weather data and save it in the saved-weather-container
// async function updateWeatherUI(weatherData, repeat = 1) {
//     // Update UI with weather data
//     document.getElementById('id').textContent = `${weatherData.id}`;
//     document.getElementById('date').textContent = `${weatherData.date}`;
//     document.getElementById('tempMin').textContent = `${weatherData.temp_min}°F`;
//     document.getElementById('tempMax').textContent = `${weatherData.temp_max}°F`;
//     document.getElementById('humidity').textContent = `${weatherData.humidity}%`;

//     // Store weather data in the history array
//     weatherSubmissionHistory.push(weatherData);

//     // Clear the saved weather container before appending new data
//     const savedWeatherContainer = document.getElementById('saved-weather-container');

//     // Create a new div to contain the saved weather information
//     const savedWeatherDiv = document.createElement('div');
//     savedWeatherDiv.classList.add('saved-weather');

//      // Create a title for the saved data
//      const title = document.createElement('h2');
//      title.textContent = 'Saved Data';
//      savedWeatherDiv.appendChild(title);

//     // Create elements to display the weather information
//     const idParagraph = document.createElement('p');
//     idParagraph.textContent = `ID: ${weatherData.id}`;
//     const dateParagraph = document.createElement('p');
//     dateParagraph.textContent = `Date: ${weatherData.date}`;
//     const tempMinParagraph = document.createElement('p');
//     tempMinParagraph.textContent = `Minimum Temperature: ${weatherData.temp_min}°F`;
//     const tempMaxParagraph = document.createElement('p');
//     tempMaxParagraph.textContent = `Maximum Temperature: ${weatherData.temp_max}°F`;
//     const humidityParagraph = document.createElement('p');
//     humidityParagraph.textContent = `Humidity: ${weatherData.humidity}%`;

//     // Append weather information elements to the savedWeatherDiv
//     savedWeatherDiv.appendChild(idParagraph);
//     savedWeatherDiv.appendChild(dateParagraph);
//     savedWeatherDiv.appendChild(tempMinParagraph);
//     savedWeatherDiv.appendChild(tempMaxParagraph);
//     savedWeatherDiv.appendChild(humidityParagraph);

//     // Create edit button
//     const editButton = document.createElement('button');
//     editButton.textContent = 'Edit';
//     editButton.addEventListener('click', () => {
//         // Open a pop-up for editing weather information
//         openEditPopup(weatherData);
//     });

//     // Append the savedWeatherDiv to the saved-weather-container
//     savedWeatherContainer.appendChild(savedWeatherDiv);

//     // Append edit button to the savedWeatherDiv
//     savedWeatherDiv.appendChild(editButton);
// }

// // Event listener for the "Save" button for weather info
// document.getElementById('save-button').addEventListener('click', async () => {
//     const date = document.getElementById('weatherDateInput').value;

//     try {
//         // Fetch weather data from the server
//         const response = await fetch('/weather', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ date: date })
//         });
//         if (!response.ok) {
//             throw new Error('Failed to save weather data');
//         }

//         // Parse the response JSON
//         const savedWeatherData = await response.json();


        
//         // Display the latest weather information
//         const currentWeatherData = await fetchWeatherData(date);

//         // Update UI with saved weather data only if it is defined
//         if (isValidWeatherData(savedWeatherData)) {
//             updateWeatherUI(savedWeatherData);
//             saveButtonClickCount++;
//         }

//         // Update UI with current weather data only if it is defined
//         if (isValidWeatherData(currentWeatherData)) {
//             updateWeatherUI(currentWeatherData);
//         }

//         // Optionally, provide a success message to the user
//         alert('Weather information saved successfully');
//     } catch (error) {
//         console.error('Error saving weather data:', error);
//         alert('Failed to save weather information. Please try again.');
//     }
// });

// // Function to check if the weather data is valid
// function isValidWeatherData(weatherData) {
//     return weatherData &&
//         weatherData.id !== undefined &&
//         weatherData.date !== undefined &&
//         weatherData.temp_min !== undefined &&
//         weatherData.temp_max !== undefined &&
//         weatherData.humidity !== undefined;
// }

// // Event listener for the "Delete" button
// document.getElementById('delete-button').addEventListener('click', () => {
//     // Get the container element that holds the saved weather information
//     const savedWeatherContainer = document.getElementById('saved-weather-container');

//     // Remove all child elements from the container
//     while (savedWeatherContainer.firstChild) {
//         savedWeatherContainer.removeChild(savedWeatherContainer.firstChild);
//     }

//     // Remove the weather data input
//     const weatherDataInput = document.getElementById('weatherDateInput');
//     weatherDataInput.value = ''; // Clear the input field
// });

// // Event listener for the "History" button
// document.getElementById('history-button').addEventListener('click', () => {
//   const historyList = document.getElementById('history-list');
//   const historyButton = document.getElementById('history-button');
  
//   // Toggle visibility of history list
//   if (historyList.style.display === 'none' || !historyList.style.display) {
//       historyList.style.display = 'block';
//       historyButton.textContent = 'Hide History';
//   } else {
//       historyList.style.display = 'none';
//       historyButton.textContent = 'Show History';
//   }

//   // Clear previous history
//   historyList.innerHTML = '';

//   // Create title for the history container
//   const historyTitle = document.createElement('h2');
//   historyTitle.textContent = 'History';
//   historyList.appendChild(historyTitle);

//   // Iterate over weatherSubmissionHistory array and display historical weather information
//   weatherSubmissionHistory.forEach(weatherData => {
//       const historyEntry = document.createElement('div');
//       historyEntry.classList.add('history-entry'); // Add a class for styling

//       // Create individual paragraphs for each weather data
//       const idParagraph = document.createElement('p');
//       idParagraph.textContent = `ID: ${weatherData.id}`;
//       const dateParagraph = document.createElement('p');
//       dateParagraph.textContent = `Date: ${weatherData.date}`;
//       const tempMinParagraph = document.createElement('p');
//       tempMinParagraph.textContent = `Minimum Temperature: ${weatherData.temp_min}°F`;
//       const tempMaxParagraph = document.createElement('p');
//       tempMaxParagraph.textContent = `Maximum Temperature: ${weatherData.temp_max}°F`;
//       const humidityParagraph = document.createElement('p');
//       humidityParagraph.textContent = `Humidity: ${weatherData.humidity}%`;

//       // Append individual paragraphs to history entry
//       historyEntry.appendChild(idParagraph);
//       historyEntry.appendChild(dateParagraph);
//       historyEntry.appendChild(tempMinParagraph);
//       historyEntry.appendChild(tempMaxParagraph);
//       historyEntry.appendChild(humidityParagraph);

//       // Append history entry to history list
//       historyList.appendChild(historyEntry);

//       // Add a line separating each history data
//       const separator = document.createElement('hr');
//       historyList.appendChild(separator);
//   });
// });



// // Function to open a popup notification for editing weather information
// function openEditPopup(weatherData) {
//   // Create a notification container
//   const notificationContainer = document.createElement('div');
//   notificationContainer.classList.add('edit-notification'); // Add the class for styling

//   // Create input fields for editing weather information
//   const idInput = createInput('ID:', 'idInput', weatherData.id);
//   const dateInput = createInput('Date:', 'dateInput', weatherData.date);
//   const tempMinInput = createInput('Minimum Temperature:', 'tempMinInput', weatherData.temp_min);
//   const tempMaxInput = createInput('Maximum Temperature:', 'tempMaxInput', weatherData.temp_max);
//   const humidityInput = createInput('Humidity:', 'humidityInput', weatherData.humidity);

//   // Create a submit button
//   const submitButton = document.createElement('button');
//   submitButton.textContent = 'Submit';
//   submitButton.addEventListener('click', () => {
//     // Update weather information
//     weatherData.id = document.getElementById('idInput').value;
//     weatherData.date = document.getElementById('dateInput').value;
//     weatherData.temp_min = document.getElementById('tempMinInput').value;
//     weatherData.temp_max = document.getElementById('tempMaxInput').value;
//     weatherData.humidity = document.getElementById('humidityInput').value;

//     // Close the notification
//     notificationContainer.remove();

//     // Update UI with edited weather information
//     updateWeatherUI(weatherData);
//   });

//   // Append input fields and submit button to the notification container
//   notificationContainer.appendChild(idInput);
//   notificationContainer.appendChild(dateInput);
//   notificationContainer.appendChild(tempMinInput);
//   notificationContainer.appendChild(tempMaxInput);
//   notificationContainer.appendChild(humidityInput);
//   notificationContainer.appendChild(submitButton);

//   // Append the notification container to the body
//   document.body.appendChild(notificationContainer);
// }



// // Function to create an input field
// function createInput(labelText, id, value) {
//   const label = document.createElement('label');
//   label.textContent = labelText;
//   const input = document.createElement('input');
//   input.setAttribute('type', 'text');
//   input.setAttribute('id', id);
//   input.setAttribute('value', value);
//   const container = document.createElement('div');
//   container.appendChild(label);
//   container.appendChild(input);
//   return container;
// }


// function updateUI(data) {
//   const stockInfoDiv = document.getElementById('stock-info');

//   // Clear previous content
//   stockInfoDiv.innerHTML = '';

//   // Create elements to display fetched data
//   const lastPriceParagraph = document.createElement('p');
//   lastPriceParagraph.textContent = `Last Price: ${data.last}`;
//   const midPriceParagraph = document.createElement('p');
//   midPriceParagraph.textContent = `Mid Price: ${data.mid}`;
//   const askPriceParagraph = document.createElement('p');
//   askPriceParagraph.textContent = `Ask Price: ${data.ask}`;

//   // Append elements to stockInfoDiv
//   stockInfoDiv.appendChild(lastPriceParagraph);
//   stockInfoDiv.appendChild(midPriceParagraph);
//   stockInfoDiv.appendChild(askPriceParagraph);
// }

// async function handleSubmit(event) {
//   event.preventDefault();

//   const stockId = document.getElementById('stockIdInput').value;
//   const currency = document.getElementById('currency-select').value; // Get selected currency

//   // Fetch data using stockId and selected currency
//   const data = await fetchData(stockId, currency);

//   // Update UI with fetched data
//   if (data) {
//      updateUI(data);
//   } else {
//      // Display error message if data fetching fails
//      alert('Failed to fetch data. Please try again.');
//   }
// }

// document.getElementById('stockForm').addEventListener('submit', function (event) {
//   event.preventDefault();

//   document.addEventListener('DOMContentLoaded', () => {
//       // Add event listener to the "Save" button
//       const saveButton = document.getElementById('save-button');
//       saveButton.addEventListener('click', () => {
//           saveStockInfo();
//       });
//   });

//   const stockSymbols = document.getElementById('stockIdInput').value.split(',').map(symbol => symbol.trim());
//   const selectedCurrency = document.getElementById('currency-select').value;

//   // Example: Check if at least one stock symbol is entered
//   if (stockSymbols.length === 0) {
//       alert('Please enter at least one stock symbol.');
//       return;
//   }

//   // Example: Make a request to fetch data for multiple stocks
//   fetch(`/stocks?symbols=${stockSymbols.join(',')}&c=${selectedCurrency}`)
//       .then(response => {
//           if (!response.ok) {
//               throw new Error('Failed to fetch stock data.');
//           }
//           return response.json();
//       })
//       .then(stockDataArray => {
//           // Example: Display stock data as needed
//           stockDataArray.forEach(stockData => {
//               console.log(`MongoDB ID: ${stockData.id}`); // Display MongoDB ID
//               console.log(`Stock Symbol: ${stockData.symbol}`);
//               console.log(`Last Price: ${stockData.last}`);
//               console.log(`Mid Price: ${stockData.mid}`);
//               console.log(`Ask Price: ${stockData.ask}`);
//               console.log('---');
//           });
//       })
//       .catch(error => {
//           console.error('Error fetching stock data:', error);
//       });
// });


// const form = document.getElementById('stockForm');
// form.addEventListener('submit', handleSubmit);



// async function saveStockInfo() {
//   try {
//       // Get the displayed stock information from the HTML
//       const mongoId = document.querySelector('#stock-info p:nth-child(1)').textContent.split(': ')[1]; // Assuming MongoDB ID is the first paragraph
//       const symbol = document.querySelector('#stock-info p:nth-child(2)').textContent.split(': ')[1];
//       const lastPrice = document.querySelector('#stock-info p:nth-child(3)').textContent.split(': ')[1];
//       const midPrice = document.querySelector('#stock-info p:nth-child(4)').textContent.split(': ')[1];
//       const askPrice = document.querySelector('#stock-info p:nth-child(5)').textContent.split(': ')[1];

//       // Create the data object to be sent to the server
//       const stockInfo = {
//           mongoId: mongoId, // Include MongoDB ID in the data object
//           symbol: symbol,
//           lastPrice: lastPrice,
//           midPrice: midPrice,
//           askPrice: askPrice
//       };

//       // Send the data to the server for saving
//       await sendDataToServer(stockInfo);

//       // Display the saved stock information at the bottom of the page
//       displaySavedStockInfo(mongoId, symbol, lastPrice, midPrice, askPrice);
//   } catch (error) {
//       console.error('Error saving stock information:', error);
//       alert('Failed to save stock information');
//   }
// }

// function displaySavedStockInfo(mongoId, symbol, lastPrice, midPrice, askPrice) {
//   const savedStockContainer = document.getElementById('saved-stock-container');

//   // Create elements to display saved stock information
//   const savedStockDiv = document.createElement('div');
//   savedStockDiv.classList.add('saved-stock');
//   savedStockDiv.dataset.mongoId = mongoId; // Add dataset attribute to store MongoDB ID

//   const infoContainer = document.createElement('div');
//   infoContainer.classList.add('info-container');

//   const mongoIdParagraph = document.createElement('p');
//   mongoIdParagraph.textContent = `MongoDB ID: ${mongoId}`;
//   const symbolParagraph = document.createElement('p');
//   symbolParagraph.textContent = `Symbol: ${symbol}`;
//   const lastPriceParagraph = document.createElement('p');
//   lastPriceParagraph.textContent = `Last Price: ${lastPrice}`;
//   const midPriceParagraph = document.createElement('p');
//   midPriceParagraph.textContent = `Mid Price: ${midPrice}`;
//   const askPriceParagraph = document.createElement('p');
//   askPriceParagraph.textContent = `Ask Price: ${askPrice}`;

//   // Create edit button
//   const editButton = document.createElement('button');
//   editButton.textContent = 'Edit';
//   editButton.addEventListener('click', () => {
//       editStockInfo(mongoId, symbol, lastPrice, midPrice, askPrice); // Pass MongoDB ID and other details to the edit function
//   });

//   // Append stock info elements to infoContainer
//   infoContainer.appendChild(mongoIdParagraph);
//   infoContainer.appendChild(symbolParagraph);
//   infoContainer.appendChild(lastPriceParagraph);
//   infoContainer.appendChild(midPriceParagraph);
//   infoContainer.appendChild(askPriceParagraph);

//   // Append infoContainer and editButton to savedStockDiv
//   savedStockDiv.appendChild(infoContainer);
//   savedStockDiv.appendChild(editButton);

//   // Append savedStockDiv to savedStockContainer
//   savedStockContainer.appendChild(savedStockDiv);

//   // Add a break element for separation
//   savedStockContainer.appendChild(document.createElement('hr'));
// }


// function editStockInfo(mongoId, symbol, lastPrice, midPrice, askPrice) {
//   // Prompt users to enter new information or provide a form for editing
//   const newMongoId = prompt('Enter new MongoDB ID:', mongoId);
//   const newSymbol = prompt('Enter new symbol:', symbol);
//   const newLastPrice = prompt('Enter new last price:', lastPrice);
//   const newMidPrice = prompt('Enter new mid price:', midPrice);
//   const newAskPrice = prompt('Enter new ask price:', askPrice);
  
//   // Find the saved stock div by its MongoDB ID
//   const savedStockDiv = document.querySelector(`.saved-stock[data-mongo-id="${mongoId}"]`);
//   if (savedStockDiv) {
//       // Update the UI with the edited information
//       savedStockDiv.dataset.mongoId = newMongoId; // Update the MongoDB ID in the dataset
//       savedStockDiv.querySelector('p:nth-of-type(1)').textContent = `MongoDB ID: ${newMongoId}`;
//       savedStockDiv.querySelector('p:nth-of-type(2)').textContent = `Symbol: ${newSymbol}`;
//       savedStockDiv.querySelector('p:nth-of-type(3)').textContent = `Last Price: ${newLastPrice}`;
//       savedStockDiv.querySelector('p:nth-of-type(4)').textContent = `Mid Price: ${newMidPrice}`;
//       savedStockDiv.querySelector('p:nth-of-type(5)').textContent = `Ask Price: ${newAskPrice}`;
//   } else {
//       console.error('Saved stock entry not found');
//   }
// }






// document.addEventListener('DOMContentLoaded', () => {
//  // Add event listener to the "Save" button
//  const saveButton = document.getElementById('save-button');
//  saveButton.addEventListener('click', saveStockInfo);
// });

// async function sendDataToServer(data) {
//  try {
//      // Send the data back to the server for saving
//      const response = await fetch('/save', {
//          method: 'POST',
//          headers: {
//              'Content-Type': 'application/json'
//          },
//          body: JSON.stringify(data)
//      });
//      if (!response.ok) {
//          throw new Error('Sucessfully Saved');
//      }
//      alert('Stock information saved successfully');
//  } catch (error) {
//      console.error('Error:', error);
//      alert('Sucessfully Saved');
//  }
// }








// async function performDeletion(stock, currency, time) {
//   try {
//      // Convert the time string to a Date object
//      const selectedTime = new Date(time);

//      // Convert the Date object to a standardized ISO string
//      const isoTimeString = selectedTime.toISOString();

//      // Send a DELETE request with the ISO formatted time
//      const response = await fetch(`/deleteData/${stock}/${currency}/${isoTimeString}`, {
//         method: 'DELETE',
//      });

//      if (response.ok) {
//         alert('Data deleted successfully');
//      } else {
//         alert('Failed to delete data');
//      }
//   } catch (error) {
//      console.error('Error deleting data:', error);
//      alert('Failed to delete data');
//   }
// }




// // Event listener for the "History" button
// document.getElementById('history-button').addEventListener('click', async () => {
//  try {
//      // Fetch historical data from MongoDB in the range of 1-100
//      const response = await fetch('/fetchHistoricalData');
//      const historicalData = await response.json();

//      // Display the historical data in the UI
//      displayHistoricalData(historicalData);
//  } catch (error) {
//      console.error('Error fetching historical data:', error);
//      alert('Failed to fetch historical data');
//  }
// });


// // Function to display historical data
// function displayHistoricalData() {
//  // Get the history list element
//  const historyList = document.getElementById('history-list');

//  // Toggle the visibility of the history list
//  if (historyList.style.display === 'none' || historyList.style.display === '') {
//      // Clear previous content
//      historyList.innerHTML = '';

//      // Example: Populate historical data from MongoDB IDs 1 to 100 with dummy data
//      for (let i = 1; i <= 100; i++) {
//          // Generate dummy stock data
//          const symbol = 'AAPL'; // Example symbol
//          const lastPrice = `$${Math.random() * 200}`; // Example last price
//          const midPrice = `$${Math.random() * 200}`; // Example mid price
//          const askPrice = `$${Math.random() * 200}`; // Example ask price

//          // Create a div to contain stock information
//          const stockInfo = document.createElement('div');
//          stockInfo.innerHTML = `
//              <p>Symbol: ${symbol}</p>
//              <p>Last Price: ${lastPrice}</p>
//              <p>Mid Price: ${midPrice}</p>
//              <p>Ask Price: ${askPrice}</p>
//          `;

//          // Create a list item for MongoDB ID and append stock information
//          const listItem = document.createElement('li');
//          listItem.textContent = `MongoDB ID: ${i}`;
//          listItem.appendChild(stockInfo);

//          // Append list item to history list
//          historyList.appendChild(listItem);
//      }

//      // Append a separator
//      historyList.appendChild(document.createElement('hr'));

//      // Display the history list
//      historyList.style.display = 'block';
//  } else {
//      // Hide the history list
//      historyList.style.display = 'none';
//  }
// }






// // Event listener for form submission
// form.addEventListener('submit', async (event) => {
//   event.preventDefault();

//   // Get user input (stock symbol and currency)
//   const stockSymbol = document.querySelector('#stockSymbol').value;
//   const currency = document.querySelector('#currency').value;

//   try {
//      // Fetch the data from your backend endpoint for mid
//      const response = await fetch(`/mid/${stockSymbol}?c=${currency}`);

//      // Check if the request was successful
//      if (!response.ok) {
//         throw new Error('Failed to fetch mid data');
//      }

//      // Parse the JSON response
//      const data = await response.json();

//      // Display the "mid" data
//      const midValue = data.mid;
//      console.log('Mid Value:', midValue);
//      // Display the "mid" value in your HTML or manipulate the DOM as needed
//      // For example:
//      document.querySelector('#midValue').textContent = `Mid Value: ${midValue}`;
//   } catch (error) {
//      console.error('Error:', error.message);
//      // Handle error display or any other action
//   }
// });

// function toggleDarkMode() {
//   const body = document.body;
//   body.classList.toggle('dark-mode');
// }

// document.addEventListener("DOMContentLoaded", function () {
//  const stockForm = document.getElementById("stockForm");
//  const displayData = document.getElementById("display-data");

//  stockForm.addEventListener("submit", async function (event) {
//      event.preventDefault(); // Prevent default form submission behavior

//      const stockId = document.getElementById("stockIdInput").value;
//      const currency = document.getElementById("currency-select").value;

//      try {
//          // Make a fetch request to your server endpoint
//          const response = await fetch(`/stock/${stockId}?c=${currency}`);
//          const stockData = await response.json();

//          // Update the display area with the retrieved data
//          displayData.innerHTML = `<pre>${JSON.stringify(stockData, null, 2)}</pre>`;
//      } catch (error) {
//          console.error("Error fetching stock data:", error);
//          displayData.innerText = "Failed to fetch stock data";
//      }
//  });
// });

// document.getElementById('stockForm').addEventListener('submit', async function(event) {
//   event.preventDefault();

//   try {
//       // Generate a random number between 1 and 100
//       const randomNumber = Math.floor(Math.random() * 100) + 1;

//       // Get the selected currency
//       const currency = document.getElementById('currency-select').value;

//       // Fetch data from the server based on the random number and selected currency
//       const response = await fetch(`/fetchDataByIdRange?currency=${currency}&randomNumber=${randomNumber}`);
//       const data = await response.json();

//       // Find the entry for Symbol: AAPL
//       let aaplEntry = null;
//       for (const entry of data) {
//           if (entry.symbol === 'AAPL') {
//               aaplEntry = entry;
//               break; // Break out of the loop after finding the AAPL entry
//           }
//       }

//       if (aaplEntry) {
//           // Update the HTML content with the retrieved AAPL data including the generated MongoDB ID
//           document.getElementById('stock-info').innerHTML = `
//               <p>MongoDB ID: ${randomNumber}</p>
//               <p>Symbol: ${aaplEntry.symbol}</p>
//               <p>Last Price: ${aaplEntry.lastPrice}</p>
//               <p>Mid Price: ${aaplEntry.midPrice}</p>
//               <p>Ask Price: ${aaplEntry.askPrice}</p>
//           `;
//       } else {
//           // Display a message if AAPL entry is not found
//           document.getElementById('stock-info').innerText = 'AAPL data not found';
//       }

//       // Clear any previous error messages
//       document.getElementById('error-message').innerText = '';
//   } catch (error) {
//       console.error('Error fetching stock data:', error);
//       // Display error message on the page
//       document.getElementById('error-message').innerText = 'Failed to fetch stock data';
//   }
// });





// // Event listener for the "Delete Data" button
// document.getElementById('delete-button').addEventListener('click', async () => {
//  try {
//      // Remove all saved stock elements from the DOM
//      const savedStockContainer = document.getElementById('saved-stock-container');
//      savedStockContainer.innerHTML = '';

//      // Make a request to the server to delete all saved stock data
//      const response = await fetch('/deleteAllSavedData', {
//          method: 'DELETE'
//      });

//      if (response.ok) {
//          alert('All saved stock data deleted successfully');
//      } else {
//          throw new Error('All saved stock data deleted successfully');
//      }
//  } catch (error) {
//      console.error('Error deleting saved stock data:', error);
//      alert('All saved stock data deleted successfully');
//  }
// });
 


// LAB 7
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
