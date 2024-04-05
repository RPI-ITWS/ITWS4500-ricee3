// server.js

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const port = 3000;
 
// Define a schema for weather data
const weatherSchema = new mongoose.Schema({
    id: Number,
    date: String,
    temp_min: Number,
    temp_max: Number,
    humidity: Number
});

// Create a model for weather data
const WeatherModel = mongoose.model('weathers', weatherSchema);
module.exports = WeatherModel;

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Elizabeth:e6IQB7oo8kaKld0E@cluster0.i1bykxg.mongodb.net/lab5', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the application if unable to connect to MongoDB
});


// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// // Route to serve the index.html file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'page2.html'));
// });



// // Endpoint to fetch weather data by date
app.get('/weather/:date', async (req, res) => {
    try {
        const date = req.params.date;
        // Fetch weather data from MongoDB based on the provided date
        const weatherData = await WeatherModel.findOne({ date });
        if (!weatherData) {
            return res.status(404).json({ error: 'Weather data not found' });
        }
        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data', message: error.message });
    }
});


// Endpoint to fetch historical weather data
app.get('/fetchHistoricalWeather', async (req, res) => {
    try {
        const historicalWeatherData = await WeatherModel.find();
        res.json(historicalWeatherData);
    } catch (error) {
        console.error('Error fetching historical weather data:', error);
        res.status(500).json({ error: 'Failed to fetch historical weather data', message: error.message });
    }
});



// POST new weather data
app.post('/weather', async (req, res) => {
    try {
        const weatherData = req.body;
        const newWeatherData = new WeatherModel(weatherData);
        await newWeatherData.save();
        res.status(201).json(newWeatherData);
    } catch (error) {
        console.error('Error adding weather data:', error);
        res.status(500).json({ error: 'Failed to add weather data', message: error.message });
    }
});

// // PUT update weather data by ID
app.put('/weather/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        await WeatherModel.findByIdAndUpdate(id, updatedData);
        res.json({ message: 'Weather data updated successfully' });
    } catch (error) {
        console.error('Error updating weather data:', error);
        res.status(500).json({ error: 'Failed to update weather data', message: error.message });
    }
});

// DELETE weather data by ID
app.delete('/weather/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await WeatherModel.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'Weather data not found' });
        }
        res.json({ message: 'Weather data deleted successfully' });
    } catch (error) {
        console.error('Error deleting weather data:', error);
        res.status(500).json({ error: 'Failed to delete weather data', message: error.message });
    }
});





// // STOCKSSSS




// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public' , 'index.html'));
});


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
 



// Route to fetch stock data based on stock symbol
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


// Route to fetch stock data based on ID range
app.get('/fetchDataByIdRange', async (req, res) => {
    try {
        const minId = 1; // Minimum ID in the range
        const maxId = 100; // Maximum ID in the range

        // Fetch stock data from MongoDB based on the ID range
        const stockData = await StockModel.find({ id: { $gte: minId, $lte: maxId } });
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



    // Save stock information
    app.post('/save', async (req, res) => {
      try {
          const stockInfo = req.body;
          const result = await collection.insertOne(stockInfo);
          res.json({ success: true, insertedId: result.insertedId });
      } catch (error) {
          console.error('Error saving stock information:', error);
          res.status(500).json({ success: false, message: 'Failed to save stock information' });
      }
  });

  // Update stock information
  app.put('/updateData/:id', async (req, res) => {
      try {
          const id = req.params.id;
          const newData = req.body;
          const result = await collection.updateOne({ _id: ObjectId(id) }, { $set: newData });
          if (result.matchedCount === 0) {
              return res.status(404).json({ success: false, message: 'Data not found' });
          }
          res.json({ success: true });
      } catch (error) {
          console.error('Error updating stock information:', error);
          res.status(500).json({ success: false, message: 'Failed to update stock information' });
      }
  });

  // Delete stock information
  app.delete('/deleteData/:id', async (req, res) => {
      try {
          const id = req.params.id;
          const result = await collection.deleteOne({ _id: ObjectId(id) });
          if (result.deletedCount === 0) {
              return res.status(404).json({ success: false, message: 'Data not found' });
          }
          res.json({ success: true });
      } catch (error) {
          console.error('Error deleting stock information:', error);
          res.status(500).json({ success: false, message: 'Failed to delete stock information' });
      }
  });

  // Fetch historical data
  app.get('/history', async (req, res) => {
      try {
          const historicalData = await collection.find({}).toArray();
          res.json(historicalData);
      } catch (error) {
          console.error('Error fetching historical data:', error);
          res.status(500).json({ success: false, message: 'Failed to fetch historical data' });
      }
  });


  // Assuming you're using Express.js for your server

// Endpoint to fetch historical data from MongoDB with IDs 1-100
app.get('/fetchHistoricalData', async (req, res) => {
   try {
       // Query MongoDB for documents with IDs ranging from 1 to 100
       const historicalData = await HistoricalData.find({ _id: { $gte: 1, $lte: 100 } });
       
       // Send the historical data as a JSON response
       res.json(historicalData);
   } catch (error) {
       console.error('Error fetching historical data:', error);
       res.status(500).json({ error: 'Failed to fetch historical data' });
   }
});


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



 //LAB 7

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page3.html'));
});
