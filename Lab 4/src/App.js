import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [stockInfo, setStockInfo] = useState({});
  const [stockId, setStockId] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const handleStockIdChange = (event) => {
    setStockId(event.target.value);
  };

  const fetchData = async () => {
    try {
      const stockResponse = await fetch(`https://api.marketdata.app/v1/stocks/quotes/AAPL/`);
  
      if (!stockResponse.ok) {
        const stockErrorText = await stockResponse.text();
        console.error('Stock API Error:', stockErrorText);
        throw new Error('Failed to fetch stock data');
      }
  
      const stockData = await stockResponse.json();
  
      let currencyConversionRate;
  
      if (selectedCurrency !== 'USD') {
        const currencyResponse = await fetch(`https://api.frankfurter.app/latest?from=USD`);
  
        if (!currencyResponse.ok) {
          const currencyErrorText = await currencyResponse.text();
          console.error('Currency API Error:', currencyErrorText);
          throw new Error('Failed to fetch currency data');
        }
      } else {
        currencyConversionRate = 1;
      }
  
      const stockInfo = {
        symbol: stockData.symbol,
        companyName: stockData.companyName,
        lastPrice: stockData.last || stockData.latest,
        mid: stockData.mid,
        ask: stockData.ask,
        currencyConversionRate: currencyConversionRate
      };
      
      return stockInfo;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const updateUI = (data) => {
    setStockInfo(data);
  };

  const saveToHistory = (data) => {
    setHistoryData((prevHistoryData) => [
      ...prevHistoryData,
      {
        stock: stockId,
        currency: selectedCurrency,
        last: data.lastPrice,
        mid: data.mid,
        ask: data.ask,
        time: new Date().toLocaleString()
      }
    ]);
  };

  useEffect(() => {
    // Add any side effects or cleanup here if needed
  }, [historyData]);

  const [editMode, setEditMode] = useState(false);

 
  

  const displayHistoricalData = (data) => {
    const historyList = document.getElementById('history-list');
    
    historyList.innerHTML = '';

    data.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = `Stock: ${item.stock}, Currency: ${item.currency}, Last Price: ${item.last}, Time: ${item.time}`;
      historyList.appendChild(listItem);
    });
  };

  

  const handleDeleteData = async () => {
    try {
      console.log('Deleting data:', stockId, selectedCurrency);
    
      const response = await fetch(`/deleteData/${stockId}/${selectedCurrency}`, {
        method: 'DELETE',
      });
    
      console.log('Delete Response:', response);
    
      if (response.ok) {
        alert('Data deleted successfully');
      } else {
        const errorResponse = await response.json();
        console.error('Delete Data Error:', errorResponse);
        alert(`Failed to delete data. Error: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error('Error handling delete data:', error);
      alert('Failed to delete data');
    }
  };
  
  const editData = async () => {
    try {
      // Define the updated data object (replace this with your actual updated data)
      const updatedData = {
        // Add properties to update
        // For example:
        lastPrice: 150,
        mid: 145,
        ask: 155,
      };
  
      console.log('Editing data:', stockId, selectedCurrency, updatedData);
  
      const response = await fetch(`/editData/${stockId}/${selectedCurrency}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Edit Response:', response);
  
      if (response.ok) {
        alert('Data edited successfully');
      } else {
        const errorResponse = await response.json();
        console.error('Edit Data Error:', errorResponse);
        alert(`Failed to edit data. Error: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error('Error editing data:', error);
      alert('Failed to edit data');
    }
  };
  
  
  const fetchAndDisplayHistoricalData = async () => {
    try {
      console.log('Fetching historical data');
    
      const response = await fetch('/history');
      const historicalData = await response.json();
    
      console.log('Historical Data:', historicalData);
    
      displayHistoricalData(historicalData);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      alert('Failed to fetch historical data');
    }
  };
  



  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stockId || !selectedCurrency) {
      alert('Please enter both stock ID and select a currency.');
      return;
    }

    try {
      console.log('Submitting form...');
      const data = await fetchData();

      console.log('Fetched data:', data);

      if (data) {
        if (editMode) {
          setEditMode(false);
          // Implement logic for editing existing data
          // You can use the editData function or create a new one
          // Based on the implementation of your backend API
        } else {
          updateUI(data);
          saveToHistory(data);
        }
      } else {
        alert('Failed to fetch data. Please try again.');
      }
    } catch (error) {
      console.error('Error handling submit:', error);
    }
  };

 

  return (
    <div>
      <header>
        <h1>Elizabeth Rice's Lab 3</h1>
        <button id="modeToggle" onClick={toggleDarkMode}>
          Toggle Dark/Light Mode
        </button>
      </header>
      <main>
        <div id="display-data">
          <b>Stock Price Info:</b>
        </div>
        <div id="stock-info">
  {stockInfo && (
    <>
      <p id="lastPrice">Last Price: {stockInfo.lastPrice}</p>
      <p id="midPrice">Mid Price: {stockInfo.mid}</p>
      <p id="askPrice">Ask Price: {stockInfo.ask}</p>
    </>
  )}
</div>
        <form id="stockForm" onSubmit={handleSubmit}>
          <label htmlFor="stockIdInput" id="StockId">
            <b>Enter Stock ID:</b>
          </label>
          <input type="text" id="stockIdInput" name="stockIdInput" required onChange={handleStockIdChange} />
          <button type="submit">Submit</button>
          <label htmlFor="currency-select" id="currency-select2">
            <b>Select Currency:</b>
          </label>
          <select id="currency-select" onChange={handleCurrencyChange}>
          <option selected>Choose a currency</option>
               <option value="USD">USD</option>
               <option value="AUD">AUD</option>
               <option value="BGN">BGN</option>
               <option value="BRL">BRL</option>
               <option value="CAD">CAD</option>
               <option value="CHF">CHF</option>
               <option value="CNY">CNY</option>
               <option value="CZK">CZK</option>
               <option value="DKK">DKK</option>
               <option value="EUR">EUR</option>
               <option value="GBP">GBP</option>
               <option value="HKD">HKD</option>
               <option value="HUF">HUF</option>
               <option value="IDR">IDR</option>
               <option value="ILS">ILS</option>
               <option value="INR">INR</option>
               <option value="ISK">ISK</option>
               <option value="JPY">JPY</option>
               <option value="KRW">KRW</option>
               <option value="MXN">MXN</option>
               <option value="MYR">MYR</option>
               <option value="NOK">NOK</option>
               <option value="NZD">NZD</option>
               <option value="PHP">PHP</option>
               <option value="PLN">PLN</option>
               <option value="RON">RON</option>
               <option value="SEK">SEK</option>
               <option value="SGD">SGD</option>
               <option value="THB">THB</option>
               <option value="TRY">TRY</option>
               <option value="ZAR">ZAR</option>
          </select>
        </form>
        <button id="save-button" onClick={handleSubmit}>Save</button>
        <button id="edit-button" onClick={() => { setEditMode(true); editData(); }}>Edit</button>
      <button id="delete-button" onClick={handleDeleteData}>Delete Data</button>
      <button id="history-button" onClick={fetchAndDisplayHistoricalData}>History</button>
        <br />
        <ul id="history-list">
          {historyData.map((entry, index) => (
            <li key={index}>
              Stock: {entry.stock}, Currency: {entry.currency}, Last Price: {entry.last}, Mid Price: {entry.mid}, Ask Price: {entry.ask}, Time: {entry.time}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
}

export default App;
