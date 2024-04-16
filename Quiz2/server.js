// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // Import path module

const app = express();
const port = 3000;

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

// Define a schema for quotes data
const quoteSchema = new mongoose.Schema({
    id: Number,
    author: String,
    quote: String
});

// Create a model for quotes data
const QuoteModel = mongoose.model('quotes', quoteSchema);

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to fetch quote data based on ID
app.get('/quotes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Fetch quote data from MongoDB based on the provided ID
        const quoteData = await QuoteModel.findOne({ id });
        if (!quoteData) {
            return res.status(404).json({ error: 'Quote data not found' });
        }
        res.json(quoteData);
    } catch (error) {
        console.error('Error fetching quote data:', error);
        res.status(500).json({ error: 'Failed to fetch quote data', message: error.message });
    }
});

// Endpoint to fetch historical quote data
app.get('/fetchHistoricalQuotes', async (req, res) => {
    try {
        // Fetch all historical quote data from MongoDB
        const historicalQuoteData = await QuoteModel.find();
        res.json(historicalQuoteData);
    } catch (error) {
        console.error('Error fetching historical quote data:', error);
        res.status(500).json({ error: 'Failed to fetch historical quote data', message: error.message });
    }
});

// POST new quote data
app.post('/quotes', async (req, res) => {
    try {
        const { id, author, quote } = req.body;
        const newQuoteData = new QuoteModel({ id, author, quote });
        await newQuoteData.save();
        res.status(201).json(newQuoteData);
    } catch (error) {
        console.error('Error adding quote data:', error);
        res.status(500).json({ error: 'Failed to add quote data', message: error.message });
    }
});

// PUT update quote data by ID
app.put('/quotes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        await QuoteModel.findOneAndUpdate({ id }, updatedData);
        res.json({ message: 'Quote data updated successfully' });
    } catch (error) {
        console.error('Error updating quote data:', error);
        res.status(500).json({ error: 'Failed to update quote data', message: error.message });
    }
});

// DELETE quote data by ID
app.delete('/quotes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await QuoteModel.findOneAndDelete({ id });
        if (!result) {
            return res.status(404).json({ error: 'Quote data not found' });
        }
        res.json({ message: 'Quote data deleted successfully' });
    } catch (error) {
        console.error('Error deleting quote data:', error);
        res.status(500).json({ error: 'Failed to delete quote data', message: error.message });
    }
});

// Endpoint to fetch historical data from MongoDB with IDs 1-100
app.get('/fetchHistoricalData', async (req, res) => {
    try {
        // Query MongoDB for documents with IDs ranging from 1 to 100
        const historicalData = await QuoteModel.find({ id: { $gte: 1, $lte: 100 } });
        
        // Send the historical data as a JSON response
        res.json(historicalData);
    } catch (error) {
        console.error('Error fetching historical data:', error);
        res.status(500).json({ error: 'Failed to fetch historical data' });
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
