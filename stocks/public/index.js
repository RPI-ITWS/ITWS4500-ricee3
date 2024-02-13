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
 
 document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the "Save" button
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', () => {
       saveStockInfo();
    });
 });
 
 async function saveStockInfo() {
    // Fetch the stock information from the server
    const stockId = document.getElementById('stockIdInput').value;
    const currency = document.getElementById('currency-select').value;
 
    try {
       const response = await fetch(`http://localhost:3000/stock/${stockId}?c=${currency}`);
       const data = await response.json();
 
       // Extract the "last" value from the fetched data
       const lastPrice = data.last;
 
       // Create the data object to be sent to the server
       const stockInfo = {
          id: stockId, // Change 'stock' to 'id'
          currency: currency,
          time: new Date().toLocaleString(),
          last: lastPrice // Include the "last" value
       };
 
       // Send the data to the server for saving
       sendDataToServer(stockInfo);
    } catch (error) {
       console.error('Error fetching stock information:', error);
       alert('Failed to fetch stock information');
    }
 }
 
 
 function sendDataToServer(data) {
    // Send the data back to the server for saving
    fetch('/save', {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
       })
       .then(response => {
          if (!response.ok) {
             throw new Error('Failed to save stock information');
          }
          alert('Stock information saved successfully');
       })
       .catch(error => {
          console.error('Error:', error);
          alert('Failed to save stock information');
       });
 }
 
 
 function handleEdit() {
    // Get the input element for the stock ID
    const stockIdInput = document.getElementById('stockIdInput');
 
    // Enable the input field to allow editing
    stockIdInput.disabled = false;
 
    // Clear the input field
    stockIdInput.value = '';
 
    // Focus on the input field for better user experience
    stockIdInput.focus();
 }
 
 const editButton = document.getElementById('edit-button');
 editButton.addEventListener('click', handleEdit);
 
 // Function to edit the data
 
 function editData(data) {
    // Implement the logic to modify the data based on your requirements
 
    // For example, you might want to update the ID field with the new value entered by the user
    const stockIdInput = document.getElementById('stockIdInput');
    const newStockId = stockIdInput.value;
    data.id = newStockId; // Assuming the ID field in your data object is called 'id'
 
    // Once the data is edited, send it back to the server for updating
    sendDataToServer(data); // Assuming you have a function to send data to the server
 }
 
 document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the "Edit" button
    const editButton = document.getElementById('edit-button');
    editButton.addEventListener('click', () => {
       // Initiate the edit process
       initiateEditProcess();
    });
 });
 
 async function initiateEditProcess() {
    try {
       // Fetch available data from the server
       const response = await fetch('/getData');
       const data = await response.json();
 
       // Check if data is available
       if (data && data.data && data.data.length > 0) {
          // Prompt the user to select a specific data entry to edit
          const selectedEntry = prompt('Choose a data entry to edit:\n' + data.data.map(entry => entry.stock + ', ' + entry.currency).join('\n'));
          if (selectedEntry) {
             // Split the selected entry to extract stock and currency
             const [selectedStock, selectedCurrency] = selectedEntry.split(', ');
 
             // Prompt the user to edit the stock and currency for the selected entry
             const newStock = prompt('Enter new stock:');
             const newCurrency = prompt('Enter new currency:');
             if (newStock && newCurrency) {
                // Send a PUT request to the server with the updated data
                const updatedData = {
                   stock: newStock,
                   currency: newCurrency
                };
 
                // Send the updated data to the server for updating
                await updateData(updatedData, selectedStock, selectedCurrency);
             } else {
                alert('Invalid input. Please provide both stock and currency.');
             }
          } else {
             alert('Edit process canceled');
          }
       } else {
          alert('No data available for editing');
       }
    } catch (error) {
       console.error('Error initiating edit process:', error);
       alert('Failed to initiate edit process');
    }
 }
 
 
 async function updateData(newData, stock, currency) {
    try {
       const response = await fetch(`/updateData/${stock}/${currency}`, {
          method: 'PUT',
          headers: {
             'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
       });
       if (!response.ok) {
          throw new Error('Failed to update data');
       }
       // Handle success response
       alert('Data updated successfully');
    } catch (error) {
       console.error('Error updating data:', error);
       alert('Failed to update data');
    }
 }
 
 
 async function handleDelete(stock, currency) {
    try {
       // Fetch times for the specified stock and currency
       const response = await fetch(`/deleteData/${stock}/${currency}`);
       const data = await response.json();
 
       // Check if times are available
       if (data.times && data.times.length > 0) {
          // Let the user choose the time to delete
          const selectedTime = prompt(`Choose a time to delete:\n${data.times.join('\n')}`);
          if (selectedTime) {
             // Perform the deletion with the selected time
             performDeletion(stock, currency, selectedTime);
          } else {
             alert('Deletion canceled');
          }
       } else {
          alert('No data found for the specified stock and currency');
       }
    } catch (error) {
       console.error('Error fetching times for deletion:', error);
       alert('Failed to fetch times for deletion');
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
 
 
 const deleteButton = document.getElementById('delete-button');
 deleteButton.addEventListener('click', () => {
    const stock = prompt('Enter stock:');
    const currency = prompt('Enter currency:');
    if (stock && currency) {
       handleDelete(stock, currency);
    } else {
       alert('Invalid input. Please provide both stock and currency.');
    }
 });
 
 
 async function fetchAndDisplayHistoricalData() {
    try {
       // Check if the history list is already populated
       const historyList = document.getElementById('history-list');
       if (historyList.children.length > 0) {
          // Clear the history list
          historyList.innerHTML = '';
       }
 
       // Fetch historical data from the server
       const response = await fetch('/history');
       const historicalData = await response.json();
 
       // Display the historical data in the UI
       displayHistoricalData(historicalData);
    } catch (error) {
       console.error('Error fetching historical data:', error);
       alert('Failed to fetch historical data');
    }
 }
 
 function displayHistoricalData(data) {
    // Clear previous content
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
 
    // Populate history data
    data.forEach(item => {
       const listItem = document.createElement('li');
       listItem.textContent = `Stock: ${item.stock}, Currency: ${item.currency}, Last Price: ${item.last}, Time: ${item.time}`;
       historyList.appendChild(listItem);
    });
 }
 
 document.addEventListener('DOMContentLoaded', () => {
    const historyButton = document.getElementById('history-button');
    historyButton.addEventListener('click', fetchAndDisplayHistoricalData);
 });
 
 
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
