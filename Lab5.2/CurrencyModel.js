const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    amount: Number,
    base: String,
    date: Date,
    rates: Object,
    AUD: String,
    BGN: String,
    BRL: String,
    CAD: String
});

// Create a Mongoose model
const CurrencyModel = mongoose.model('Currency', currencySchema);

module.exports = CurrencyModel;
