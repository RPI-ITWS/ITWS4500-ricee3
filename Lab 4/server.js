const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors()); // Enable CORS for all routes

// Assume you have some data stored in an array for demonstration purposes
let historyData = [
  // ... initial data
];

app.delete('/deleteData/:stockId/:selectedCurrency', (req, res) => {
  const { stockId, selectedCurrency } = req.params;

  // Implement logic to delete data
  const newData = historyData.filter(entry => !(entry.stock === stockId && entry.currency === selectedCurrency));
  historyData = newData;

  res.status(200).json({ message: 'Data deleted successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
