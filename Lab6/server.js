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
module.exports = WeatherModel; // Export the WeatherModel for reuse

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Elizabeth:e6IQB7oo8kaKld0E@cluster0.i1bykxg.mongodb.net/lab5', {
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
    res.sendFile(path.join(__dirname, 'public', 'page2.html'));
});



// Endpoint to fetch weather data by date
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
        // Fetch all historical weather data from MongoDB
        const historicalWeatherData = await WeatherModel.find();
        res.json(historicalWeatherData);
    } catch (error) {
        console.error('Error fetching historical weather data:', error);
        res.status(500).json({ error: 'Failed to fetch historical weather data', message: error.message });
    }
});

// Endpoint to delete weather data by date
app.delete('/deleteWeather/:date', async (req, res) => {
    try {
        const date = req.params.date;
        // Delete weather data from MongoDB based on the provided date
        const result = await WeatherModel.deleteOne({ date });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Weather data not found' });
        }
        res.json({ message: 'Weather data deleted successfully' });
    } catch (error) {
        console.error('Error deleting weather data:', error);
        res.status(500).json({ error: 'Failed to delete weather data', message: error.message });
    }
});



// Endpoint to handle saving weather information
app.post('/weather', async (req, res) => {
    try {
        const weatherData = req.body;

        // Save the weather data to MongoDB
        const newWeatherData = new WeatherModel(weatherData);
        await newWeatherData.save();

        // Respond with a success status and the saved data
        res.status(201).json(newWeatherData);
    } catch (error) {
        console.error('Error saving weather data:', error);
        res.status(500).json({ error: 'Failed to save weather data', message: error.message });
    }
});

