const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 3000; // Set your desired port

app.use(express.json());

// Endpoint to fetch a random activity or activity based on the provided type
app.get('/api/activity', async (req, res) => {
  try {
    const { type, participants } = req.query;
    let apiUrl = 'https://www.boredapi.com/api/activity';

    // If type is provided, use it to get a specific activity
    if (type) {
      apiUrl += `?type=${type}`;
      // Optionally, include additional parameters like participants
      if (participants) {
        apiUrl += `&participants=${participants}`;
      }
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
