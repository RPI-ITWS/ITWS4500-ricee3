const express = require('express');
const mongoose = require('mongoose');
const WeatherModel = require('./lab6/models/WeatherModel');

const app = express();
const port = 3000;

// MongoDB connection URI for localhost
const mongoURI = 'mongodb+srv://ericee3:ITWS4500@cluster0.i1bykxg.mongodb.net/lab5'; // Assuming MongoDB is running on the default port

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Event listeners for MongoDB connection events
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', async () => {
  console.log('Connected to MongoDB');
});

// Define a route handler for the root URL
app.get('/', async (req, res) => {
  try {
    // Fetch data from MongoDB
    const weatherData = await WeatherModel.find();
    
    // Log the fetched data
    console.log('Fetched weather data:', weatherData);

    // Send the weather data as a JSON response
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).json({ error: 'Failed to fetch data from MongoDB' });
  }
});


// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
