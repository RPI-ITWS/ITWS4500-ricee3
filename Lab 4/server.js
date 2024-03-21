const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.static('public'));

// Assume you have some data stored in an array for demonstration purposes
let historyData = [
  // ... initial data
];

// Route to delete data
app.delete('/deleteData/:stockId/:selectedCurrency', (req, res) => {
  try {
    const { stockId, selectedCurrency } = req.params;

    // Implement logic to delete data
    historyData = historyData.filter(entry => !(entry.stock === stockId && entry.currency === selectedCurrency));

    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
