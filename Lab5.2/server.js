const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;



// Define a schema for stock data
const stockSchema = new mongoose.Schema({
   id: Number,
   symbol: String,
   askPrice: String,
   askPrice: String,
   midPrice: String
});

// Create a model for stock data
const StockModel = mongoose.model('callahans', stockSchema);
module.exports = StockModel;



// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://ericee3:ITWS4500@cluster0.i1bykxg.mongodb.net/lab5', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start the server after successful connection
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1); // Exit the application if unable to connect to MongoDB
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/// Route to fetch stock data based on stock symbol and currency
app.get('/fetchData', async (req, res) => {
   const stockSymbol = req.query.stockSymbol;

   try {
       // Fetch stock data based on the provided stock symbol from MongoDB
       const stockData = await StockModel.findOne({ symbol: stockSymbol });
       console.log('Stock Data:', stockData);

       if (!stockData) {
           return res.status(404).json({ error: 'Data not found' });
       }

       // Send the stock data back to the frontend
       res.json(stockData);
   } catch (error) {
       console.error('Error fetching data:', error);
       res.status(500).json({ error: 'Failed to fetch data', message: error.message });
   }
});


// Route to fetch stock data based on symbol
app.get('/stock/:symbol', async (req, res) => {
    try {
        const symbol = req.params.symbol;
        console.log('Fetching stock data for symbol:', symbol);
        
        // Fetch stock data from MongoDB based on the provided symbol
        const stockData = await StockModel.findOne({ symbol });
        console.log('Stock Data:', stockData);

        if (!stockData) {
            return res.status(404).json({ error: 'Stock not found' });
        }

        // Fetch currency data for USD
        const currencyData = await CurrencyModel.findOne({ base: 'USD' });

        if (!currencyData) {
            return res.status(404).json({ error: 'Currency data not found' });
        }

        // Calculate converted prices based on currency rates
        const askPrice = stockData.ask * currencyData.rates[symbol];
        const midPrice = stockData.mid * currencyData.rates[symbol];
        const lastPrice = stockData.last * currencyData.rates[symbol];

        // Send the stock data along with calculated prices as a JSON response
        res.json({
            stockData,
            askPrice,
            midPrice,
            lastPrice
        });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data', message: error.message });
    }
});

// Handle 404 errors for all other routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.post('/addStock', async (req, res) => {
   try {
       const jsonData = req.body.data;
       console.log('Received JSON data:', jsonData); // Check the received JSON data in the server logs
       // Your code to process and save the JSON data to MongoDB
       res.json({ message: 'Stock data added successfully' });
   } catch (error) {
       console.error('Error adding stock data:', error);
       res.status(500).json({ error: 'Failed to add stock data', message: error.message });
   }
});
