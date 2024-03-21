const mongoose = require('mongoose');

// Define a schema for stock data
const stockSchema = new mongoose.Schema({
   symbol: String,
   lastPrice: Number,
   midPrice: Number,
   askPrice: Number,
});

// Create a model for stock data
const StockModel = mongoose.model('Stock', stockSchema);

module.exports = StockModel;
