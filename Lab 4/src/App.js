import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [stockInfo, setStockInfo] = useState({});
  const [stockId, setStockId] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
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
      const stockResponse = await fetch(
        `https://api.marketdata.app/v1/stocks/quotes/${stockId}/`
      );

      if (!stockResponse.ok) {
        const stockErrorText = await stockResponse.text();
        console.error("Stock API Error:", stockErrorText);
        throw new Error("Failed to fetch stock data");
      }

      const stockData = await stockResponse.json();

      console.log("Stock Data:", stockData);

      let lastPrice, midPrice, askPrice;

      // Determine last price
      if ("last" in stockData && stockData.last !== null) {
        lastPrice = stockData.last;
      } else if ("latest" in stockData && stockData.latest !== null) {
        lastPrice = stockData.latest;
      } else if (
        "lastExtendedHours" in stockData &&
        stockData.lastExtendedHours !== null
      ) {
        lastPrice = stockData.lastExtendedHours;
      } else {
        console.error("Invalid last price data:", stockData);
        throw new Error("Failed to determine last price");
      }

      // Determine ask price
      if ("ask" in stockData && stockData.ask !== null) {
        askPrice = stockData.ask;
      } else {
        console.error("Invalid ask price data:", stockData);
        throw new Error("Failed to determine ask price");
      }

      if (
        "bid" in stockData &&
        "ask" in stockData &&
        !isNaN(stockData.bid) &&
        !isNaN(stockData.ask)
      ) {
        midPrice = (parseFloat(stockData.bid) + parseFloat(stockData.ask)) / 2;
      } else if ("last" in stockData && stockData.last !== null) {
        midPrice = stockData.last;
      } else if ("latest" in stockData && stockData.latest !== null) {
        midPrice = stockData.latest;
      } else if (
        "lastExtendedHours" in stockData &&
        stockData.lastExtendedHours !== null
      ) {
        midPrice = stockData.lastExtendedHours;
      } else {
        console.error("Invalid mid price data:", stockData);
        throw new Error("Failed to determine mid price");
      }

      let currencyConversionRate;

      if (selectedCurrency !== "USD") {
        const currencyResponse = await fetch(
          `https://api.frankfurter.app/latest?from=USD&to=${selectedCurrency}`
        );
        const currencyData = await currencyResponse.json();

        if (!currencyResponse.ok || !currencyData.rates[selectedCurrency]) {
          console.error("Invalid Currency Conversion Data:", currencyData);
          throw new Error("Failed to fetch currency conversion data");
        }

        currencyConversionRate = currencyData.rates[selectedCurrency];
      } else {
        currencyConversionRate = 1;
      }

      const stockInfo = {
        symbol: stockData.symbol,
        companyName: stockData.companyName,
        lastPrice: calculatePrice(lastPrice, currencyConversionRate),
        mid: calculatePrice(midPrice, currencyConversionRate),
        ask: calculatePrice(askPrice, currencyConversionRate),
        currencyConversionRate: currencyConversionRate,
      };

      return stockInfo;
    } catch (error) {
      console.error("Error fetching data:", error);
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
        time: new Date().toLocaleString(),
      },
    ]);
  };

  useEffect(() => {
    // Add any side effects or cleanup here if needed
  }, [historyData]);

  const [editMode, setEditMode] = useState(false);

  const displayHistoricalData = (data) => {
    const historyList = document.getElementById("history-list");

    historyList.innerHTML = "";

    data.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Stock: ${item.stock}, Currency: ${item.currency}, Last Price: ${item.last}, Time: ${item.time}`;
      historyList.appendChild(listItem);
    });
  };

  // React Frontend

  const handleDeleteData = (index) => {
    try {
      console.log("Deleting data at index:", index);

      setHistoryData((prevHistoryData) =>
        prevHistoryData.filter((entry, i) => i !== index)
      );

      alert("Data deleted successfully");
    } catch (error) {
      console.error("Error handling delete data:", error);
      alert("Failed to delete data");
    }
  };

  const handleDeleteDataAll = () => {
    try {
      console.log("Deleting all data");

      // Clear all data in historyData
      setHistoryData([]);

      alert("All data deleted successfully");
    } catch (error) {
      console.error("Error handling delete data:", error);
      alert("Failed to delete data");
    }
  };

  const handleEditData = (index, isHistory) => {
    try {
      const newStockId = prompt("Enter the new stock ID:");
      const newCurrency = prompt("Enter the new currency:");

      if (newStockId && newCurrency) {
        if (isHistory) {
          // Editing historical data
          const updatedHistory = [...historyData];
          updatedHistory[index] = {
            ...updatedHistory[index],
            stock: newStockId,
            currency: newCurrency,
          };
          setHistoryData(updatedHistory);
          alert("Historical data edited successfully");
        } else {
          // Editing saved data
          const updatedSavedData = {
            ...stockInfo,
            stockId: newStockId,
            selectedCurrency: newCurrency,
          };
          setStockInfo(updatedSavedData);
          alert("Saved data edited successfully");
        }
      } else {
        alert("Please enter valid stock ID and currency.");
      }
    } catch (error) {
      console.error("Error handling edit data:", error);
      alert("Failed to edit data");
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

      console.log("Editing data:", stockId, selectedCurrency, updatedData);

      const response = await fetch(`/editData/${stockId}/${selectedCurrency}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Edit Response:", response);

      if (response.ok) {
        alert("Data edited successfully");
      } else {
        const errorResponse = await response.json();
        console.error("Edit Data Error:", errorResponse);
        alert(`Failed to edit data. Error: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error("Error editing data:", error);
      alert("Failed to edit data");
    }
  };

  const fetchAndDisplayHistoricalData = async () => {
    try {
      console.log("Fetching historical data");

      const response = await fetch("/history");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch historical data. Status: ${response.status}`
        );
      }

      const historicalData = await response.json();

      console.log("Historical Data:", historicalData);

      // Log the data before updating the state and displaying
      // This will help you ensure that the backend response is as expected
      displayHistoricalData(historicalData);
      setHistoryData(historicalData);
    } catch (error) {
      console.error("Error fetching historical data:", error.message);
      alert("Failed to fetch historical data");
    }
  };

  const handleHistoryButtonClick = async () => {
    try {
      console.log("fetching historical data");

      // Save the data first
      const data = await fetchData();

      console.log("Fetched data:", data);

      if (data) {
        // Check if the data is already in the history
        const isInHistory = historyData.some(
          (entry) =>
            entry.stock === data.symbol && entry.currency === selectedCurrency
        );

        if (!isInHistory) {
          // If not in history, save it
          saveToHistory(data);
          alert("History Shown Below"); // Optionally, you can notify the user that data is saved.
        } else {
          alert("Data is already in history.");
        }
      } else {
        alert("Failed to fetch data. Please try again.");
      }

      // Toggle the visibility of the history section
      setShowHistory(!showHistory);
    } catch (error) {
      console.error("Error handling history button click:", error);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Saving data:", stockId, selectedCurrency);
      const data = await fetchData();

      console.log("Fetched data:", data);

      if (data) {
        saveToHistory(data);
        alert("Saving Stock to History"); // Optionally, you can notify the user that data is saved.
      } else {
        alert("Failed to fetch data. Please try again.");
      }
    } catch (error) {
      console.error("Error handling save:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stockId || !selectedCurrency) {
      alert("Please enter both stock ID and select a currency.");
      return;
    }

    try {
      console.log("Submitting form...");
      const data = await fetchData();

      console.log("Fetched data:", data);

      if (data) {
        if (editMode) {
          setEditMode(false);
          // Implement logic for editing existing data
          // You can use the editData function or create a new one
          // Based on the implementation of your backend API
        } else {
          updateUI(data);
        }
      } else {
        alert("Failed to fetch data. Please try again.");
      }
    } catch (error) {
      console.error("Error handling submit:", error);
    }
  };

  const calculatePrice = (price, conversionRate) => {
    return (price * conversionRate).toFixed(2); // Adjust decimal places as needed
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
          <input
            type="text"
            id="stockIdInput"
            name="stockIdInput"
            required
            onChange={handleStockIdChange}
          />
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
        <button id="save-button" onClick={handleSave}>
          Save
        </button>
        <button id="delete-button" onClick={handleDeleteDataAll}>
          Delete All
        </button>
        <button id="history-button" onClick={handleHistoryButtonClick}>
          History
        </button>
        <br />
        <ul id="history-list">
          {historyData.map((entry, index) => (
            <li key={index} className="history-item">
              <div className="history-content">
                Stock: {entry.stock}, Currency: {entry.currency}, Last Price:{" "}
                {entry.last}, Mid Price: {entry.mid}, Ask Price: {entry.ask},
                Time: {entry.time}
              </div>
              <button
                className="edit-button2"
                onClick={() => handleEditData(index, true)}
              >
                Edit
              </button>
              <button
                className="delete-button2"
                onClick={() => handleDeleteData(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
}

export default App;
