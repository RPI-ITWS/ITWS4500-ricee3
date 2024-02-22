import React, { useState } from 'react';
import './App.css';
import Container from './Container.js';

function App() {

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
          <p id="lastPrice"></p>
          <p id="midPrice"></p>
          <p id="askPrice"></p>
          <p id="last-price"></p>
        </div>
        <form id="stockForm">
          <label htmlFor="stockIdInput" id="StockId">
            <b>Enter Stock ID:</b>
          </label>
          <input type="text" id="stockIdInput" name="stockIdInput" required />
          <button type="submit">Submit</button>
          <label htmlFor="currency-select" id="currency-select2">
            <b>Select Currency:</b>
          </label>
          <select id="currency-select">
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
        <button id="save-button">Save</button>
        <button id="edit-button">Edit</button>
        <button id="delete-button">Delete Data</button>
        <button id="history-button">History</button>
        <br />
        <ul id="history-list"></ul>
      </main>
    </div>
  );
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
}

export default App;
