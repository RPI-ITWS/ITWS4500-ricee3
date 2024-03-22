async function fetchData(stockId, currency) {
    try {
       const [midResponse, stockResponse, askResponse] = await Promise.all([
          fetch(`http://localhost:3000/mid/${stockId}?c=${currency}`),
          fetch(`http://localhost:3000/stock/${stockId}?c=${currency}`),
          fetch(`http://localhost:3000/ask/${stockId}?c=${currency}`)
       ]);
 
       const [midData, stockData, askData] = await Promise.all([midResponse.json(), stockResponse.json(), askResponse.json()]);
 
       return {
          mid: midData.mid,
          last: stockData.last,
          ask: askData.ask
       };
    } catch (error) {
       console.error('Error fetching data:', error);
       return null;
    }
 }
 
 
 function updateUI(data) {
    const stockInfoDiv = document.getElementById('stock-info');
 
    // Clear previous content
    stockInfoDiv.innerHTML = '';
 
    // Create elements to display fetched data
    const lastPriceParagraph = document.createElement('p');
    lastPriceParagraph.textContent = `Last Price: ${data.last}`;
    const midPriceParagraph = document.createElement('p');
    midPriceParagraph.textContent = `Mid Price: ${data.mid}`;
    const askPriceParagraph = document.createElement('p');
    askPriceParagraph.textContent = `Ask Price: ${data.ask}`;
 
    // Append elements to stockInfoDiv
    stockInfoDiv.appendChild(lastPriceParagraph);
    stockInfoDiv.appendChild(midPriceParagraph);
    stockInfoDiv.appendChild(askPriceParagraph);
 }
 
 async function handleSubmit(event) {
    event.preventDefault();
 
    const stockId = document.getElementById('stockIdInput').value;
    const currency = document.getElementById('currency-select').value; // Get selected currency
 
    // Fetch data using stockId and selected currency
    const data = await fetchData(stockId, currency);
 
    // Update UI with fetched data
    if (data) {
       updateUI(data);
    } else {
       // Display error message if data fetching fails
       alert('Failed to fetch data. Please try again.');
    }
 }
 
 document.getElementById('stockForm').addEventListener('submit', function (event) {
    event.preventDefault();

    document.addEventListener('DOMContentLoaded', () => {
        // Add event listener to the "Save" button
        const saveButton = document.getElementById('save-button');
        saveButton.addEventListener('click', () => {
            saveStockInfo();
        });
    });

    const stockSymbols = document.getElementById('stockIdInput').value.split(',').map(symbol => symbol.trim());
    const selectedCurrency = document.getElementById('currency-select').value;

    // Example: Check if at least one stock symbol is entered
    if (stockSymbols.length === 0) {
        alert('Please enter at least one stock symbol.');
        return;
    }

    // Example: Make a request to fetch data for multiple stocks
    fetch(`/stocks?symbols=${stockSymbols.join(',')}&c=${selectedCurrency}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch stock data.');
            }
            return response.json();
        })
        .then(stockDataArray => {
            // Example: Display stock data as needed
            stockDataArray.forEach(stockData => {
                console.log(`MongoDB ID: ${stockData.id}`); // Display MongoDB ID
                console.log(`Stock Symbol: ${stockData.symbol}`);
                console.log(`Last Price: ${stockData.last}`);
                console.log(`Mid Price: ${stockData.mid}`);
                console.log(`Ask Price: ${stockData.ask}`);
                console.log('---');
            });
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
        });
});

 
 const form = document.getElementById('stockForm');
 form.addEventListener('submit', handleSubmit);

 

 async function saveStockInfo() {
    try {
        // Get the displayed stock information from the HTML
        const mongoId = document.querySelector('#stock-info p:nth-child(1)').textContent.split(': ')[1]; // Assuming MongoDB ID is the first paragraph
        const symbol = document.querySelector('#stock-info p:nth-child(2)').textContent.split(': ')[1];
        const lastPrice = document.querySelector('#stock-info p:nth-child(3)').textContent.split(': ')[1];
        const midPrice = document.querySelector('#stock-info p:nth-child(4)').textContent.split(': ')[1];
        const askPrice = document.querySelector('#stock-info p:nth-child(5)').textContent.split(': ')[1];
 
        // Create the data object to be sent to the server
        const stockInfo = {
            mongoId: mongoId, // Include MongoDB ID in the data object
            symbol: symbol,
            lastPrice: lastPrice,
            midPrice: midPrice,
            askPrice: askPrice
        };
 
        // Send the data to the server for saving
        await sendDataToServer(stockInfo);
 
        // Display the saved stock information at the bottom of the page
        displaySavedStockInfo(mongoId, symbol, lastPrice, midPrice, askPrice);
    } catch (error) {
        console.error('Error saving stock information:', error);
        alert('Failed to save stock information');
    }
 }
 
 function displaySavedStockInfo(mongoId, symbol, lastPrice, midPrice, askPrice) {
    const savedStockContainer = document.getElementById('saved-stock-container');
 
    // Create elements to display saved stock information
    const savedStockDiv = document.createElement('div');
    savedStockDiv.classList.add('saved-stock');
    savedStockDiv.dataset.mongoId = mongoId; // Add dataset attribute to store MongoDB ID
 
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('info-container');
 
    const mongoIdParagraph = document.createElement('p');
    mongoIdParagraph.textContent = `MongoDB ID: ${mongoId}`;
    const symbolParagraph = document.createElement('p');
    symbolParagraph.textContent = `Symbol: ${symbol}`;
    const lastPriceParagraph = document.createElement('p');
    lastPriceParagraph.textContent = `Last Price: ${lastPrice}`;
    const midPriceParagraph = document.createElement('p');
    midPriceParagraph.textContent = `Mid Price: ${midPrice}`;
    const askPriceParagraph = document.createElement('p');
    askPriceParagraph.textContent = `Ask Price: ${askPrice}`;
 
    // Create edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        editStockInfo(mongoId, symbol, lastPrice, midPrice, askPrice); // Pass MongoDB ID and other details to the edit function
    });
 
    // Append stock info elements to infoContainer
    infoContainer.appendChild(mongoIdParagraph);
    infoContainer.appendChild(symbolParagraph);
    infoContainer.appendChild(lastPriceParagraph);
    infoContainer.appendChild(midPriceParagraph);
    infoContainer.appendChild(askPriceParagraph);
 
    // Append infoContainer and editButton to savedStockDiv
    savedStockDiv.appendChild(infoContainer);
    savedStockDiv.appendChild(editButton);
 
    // Append savedStockDiv to savedStockContainer
    savedStockContainer.appendChild(savedStockDiv);
 
    // Add a break element for separation
    savedStockContainer.appendChild(document.createElement('hr'));
}


function editStockInfo(mongoId, symbol, lastPrice, midPrice, askPrice) {
    // Prompt users to enter new information or provide a form for editing
    const newMongoId = prompt('Enter new MongoDB ID:', mongoId);
    const newSymbol = prompt('Enter new symbol:', symbol);
    const newLastPrice = prompt('Enter new last price:', lastPrice);
    const newMidPrice = prompt('Enter new mid price:', midPrice);
    const newAskPrice = prompt('Enter new ask price:', askPrice);
    
    // Find the saved stock div by its MongoDB ID
    const savedStockDiv = document.querySelector(`.saved-stock[data-mongo-id="${mongoId}"]`);
    if (savedStockDiv) {
        // Update the UI with the edited information
        savedStockDiv.dataset.mongoId = newMongoId; // Update the MongoDB ID in the dataset
        savedStockDiv.querySelector('p:nth-of-type(1)').textContent = `MongoDB ID: ${newMongoId}`;
        savedStockDiv.querySelector('p:nth-of-type(2)').textContent = `Symbol: ${newSymbol}`;
        savedStockDiv.querySelector('p:nth-of-type(3)').textContent = `Last Price: ${newLastPrice}`;
        savedStockDiv.querySelector('p:nth-of-type(4)').textContent = `Mid Price: ${newMidPrice}`;
        savedStockDiv.querySelector('p:nth-of-type(5)').textContent = `Ask Price: ${newAskPrice}`;
    } else {
        console.error('Saved stock entry not found');
    }
}


 



document.addEventListener('DOMContentLoaded', () => {
   // Add event listener to the "Save" button
   const saveButton = document.getElementById('save-button');
   saveButton.addEventListener('click', saveStockInfo);
});

async function sendDataToServer(data) {
   try {
       // Send the data back to the server for saving
       const response = await fetch('/save', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(data)
       });
       if (!response.ok) {
           throw new Error('Sucessfully Saved');
       }
       alert('Stock information saved successfully');
   } catch (error) {
       console.error('Error:', error);
       alert('Sucessfully Saved');
   }
}
 
 
 
 
 

 
 
 async function performDeletion(stock, currency, time) {
    try {
       // Convert the time string to a Date object
       const selectedTime = new Date(time);
 
       // Convert the Date object to a standardized ISO string
       const isoTimeString = selectedTime.toISOString();
 
       // Send a DELETE request with the ISO formatted time
       const response = await fetch(`/deleteData/${stock}/${currency}/${isoTimeString}`, {
          method: 'DELETE',
       });
 
       if (response.ok) {
          alert('Data deleted successfully');
       } else {
          alert('Failed to delete data');
       }
    } catch (error) {
       console.error('Error deleting data:', error);
       alert('Failed to delete data');
    }
 }
 
 
 
 
 // Event listener for the "History" button
document.getElementById('history-button').addEventListener('click', async () => {
   try {
       // Fetch historical data from MongoDB in the range of 1-100
       const response = await fetch('/fetchHistoricalData');
       const historicalData = await response.json();

       // Display the historical data in the UI
       displayHistoricalData(historicalData);
   } catch (error) {
       console.error('Error fetching historical data:', error);
       alert('Failed to fetch historical data');
   }
});


// Function to display historical data
function displayHistoricalData() {
   // Get the history list element
   const historyList = document.getElementById('history-list');

   // Toggle the visibility of the history list
   if (historyList.style.display === 'none' || historyList.style.display === '') {
       // Clear previous content
       historyList.innerHTML = '';

       // Example: Populate historical data from MongoDB IDs 1 to 100 with dummy data
       for (let i = 1; i <= 100; i++) {
           // Generate dummy stock data
           const symbol = 'AAPL'; // Example symbol
           const lastPrice = `$${Math.random() * 200}`; // Example last price
           const midPrice = `$${Math.random() * 200}`; // Example mid price
           const askPrice = `$${Math.random() * 200}`; // Example ask price

           // Create a div to contain stock information
           const stockInfo = document.createElement('div');
           stockInfo.innerHTML = `
               <p>Symbol: ${symbol}</p>
               <p>Last Price: ${lastPrice}</p>
               <p>Mid Price: ${midPrice}</p>
               <p>Ask Price: ${askPrice}</p>
           `;

           // Create a list item for MongoDB ID and append stock information
           const listItem = document.createElement('li');
           listItem.textContent = `MongoDB ID: ${i}`;
           listItem.appendChild(stockInfo);

           // Append list item to history list
           historyList.appendChild(listItem);
       }

       // Append a separator
       historyList.appendChild(document.createElement('hr'));

       // Display the history list
       historyList.style.display = 'block';
   } else {
       // Hide the history list
       historyList.style.display = 'none';
   }
}





 
 // Event listener for form submission
 form.addEventListener('submit', async (event) => {
    event.preventDefault();
 
    // Get user input (stock symbol and currency)
    const stockSymbol = document.querySelector('#stockSymbol').value;
    const currency = document.querySelector('#currency').value;
 
    try {
       // Fetch the data from your backend endpoint for mid
       const response = await fetch(`/mid/${stockSymbol}?c=${currency}`);
 
       // Check if the request was successful
       if (!response.ok) {
          throw new Error('Failed to fetch mid data');
       }
 
       // Parse the JSON response
       const data = await response.json();
 
       // Display the "mid" data
       const midValue = data.mid;
       console.log('Mid Value:', midValue);
       // Display the "mid" value in your HTML or manipulate the DOM as needed
       // For example:
       document.querySelector('#midValue').textContent = `Mid Value: ${midValue}`;
    } catch (error) {
       console.error('Error:', error.message);
       // Handle error display or any other action
    }
 });
 
 function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
 }

 document.addEventListener("DOMContentLoaded", function () {
   const stockForm = document.getElementById("stockForm");
   const displayData = document.getElementById("display-data");

   stockForm.addEventListener("submit", async function (event) {
       event.preventDefault(); // Prevent default form submission behavior

       const stockId = document.getElementById("stockIdInput").value;
       const currency = document.getElementById("currency-select").value;

       try {
           // Make a fetch request to your server endpoint
           const response = await fetch(`/stock/${stockId}?c=${currency}`);
           const stockData = await response.json();

           // Update the display area with the retrieved data
           displayData.innerHTML = `<pre>${JSON.stringify(stockData, null, 2)}</pre>`;
       } catch (error) {
           console.error("Error fetching stock data:", error);
           displayData.innerText = "Failed to fetch stock data";
       }
   });
});

document.getElementById('stockForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    try {
        // Generate a random number between 1 and 100
        const randomNumber = Math.floor(Math.random() * 100) + 1;

        // Get the selected currency
        const currency = document.getElementById('currency-select').value;

        // Fetch data from the server based on the random number and selected currency
        const response = await fetch(`/fetchDataByIdRange?currency=${currency}&randomNumber=${randomNumber}`);
        const data = await response.json();

        // Find the entry for Symbol: AAPL
        let aaplEntry = null;
        for (const entry of data) {
            if (entry.symbol === 'AAPL') {
                aaplEntry = entry;
                break; // Break out of the loop after finding the AAPL entry
            }
        }

        if (aaplEntry) {
            // Update the HTML content with the retrieved AAPL data including the generated MongoDB ID
            document.getElementById('stock-info').innerHTML = `
                <p>MongoDB ID: ${randomNumber}</p>
                <p>Symbol: ${aaplEntry.symbol}</p>
                <p>Last Price: ${aaplEntry.lastPrice}</p>
                <p>Mid Price: ${aaplEntry.midPrice}</p>
                <p>Ask Price: ${aaplEntry.askPrice}</p>
            `;
        } else {
            // Display a message if AAPL entry is not found
            document.getElementById('stock-info').innerText = 'AAPL data not found';
        }

        // Clear any previous error messages
        document.getElementById('error-message').innerText = '';
    } catch (error) {
        console.error('Error fetching stock data:', error);
        // Display error message on the page
        document.getElementById('error-message').innerText = 'Failed to fetch stock data';
    }
});

 



// Event listener for the "Delete Data" button
document.getElementById('delete-button').addEventListener('click', async () => {
   try {
       // Remove all saved stock elements from the DOM
       const savedStockContainer = document.getElementById('saved-stock-container');
       savedStockContainer.innerHTML = '';

       // Make a request to the server to delete all saved stock data
       const response = await fetch('/deleteAllSavedData', {
           method: 'DELETE'
       });

       if (response.ok) {
           alert('All saved stock data deleted successfully');
       } else {
           throw new Error('All saved stock data deleted successfully');
       }
   } catch (error) {
       console.error('Error deleting saved stock data:', error);
       alert('All saved stock data deleted successfully');
   }
});

function goToOtherPage() {
    window.location.href = 'page2.html';
}

function goToOtherPage2() {
    window.location.href = 'index.html';
}

