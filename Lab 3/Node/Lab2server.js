const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const articles = [];
const https = require('https');
const http = require('http');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../lab2.html'));
});

app.get('/news', (req, res) => {
  res.json(articles); // Send the entire array of articles as JSON
});

app.get('/news/:articleId', (req, res) => {
  const articleId = parseInt(req.params.articleId);
  const article = articles.find(article => article.id === articleId);

  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ error: 'Article not found' });
  }
});

app.post('/news', (req, res) => {
  const newArticle = req.body;
  newArticle.id = articles.length + 1; // Assign a new ID
  articles.push(newArticle);
  res.status(201).json(newArticle);
});

// 5. PUT /news - Bulk update all articles
app.put('/news', (req, res) => {
  // Assuming you send an array of updated articles in the request body
  jsonData.news = req.body;
  res.sendStatus(204);
});

// 6. PUT /news/### - Update specific article
app.put('/news/:id', (req, res) => {
  const articleId = req.params.id;
  const updatedArticle = req.body;
  const index = jsonData.news.findIndex(article => article.uuid === articleId);

  if (index !== -1) {
    jsonData.news[index] = updatedArticle;
    res.sendStatus(204);
  } else {
    res.status(404).send('Article not found');
  }
});

// 7. DELETE /news/### - Delete specific article
app.delete('/news/:id', (req, res) => {
  const articleId = req.params.id;
  const index = jsonData.news.findIndex(article => article.uuid === articleId);

  if (index !== -1) {
    jsonData.news.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send('Article not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


app.get('/weather-and-news', async (req, res) => {
  try {
    const latitude = 42.7284;
    const longitude = -73.6918;

    // Fetch weather data from OpenWeatherMap API using provided coordinates
    const weatherData = await fetchWeatherData(latitude, longitude);

    // Combine weather data with news articles
    const responseData = {
      weather: weatherData,
      news: articles,
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/add-external-data', async (req, res) => {
  try {
    // Fetch data from an external API
    const externalData = await fetchExternalData();

    // Add the external data to your JSON object
    // Assuming the external data has a structure similar to your articles
    articles.push(...externalData);

    res.status(201).json({ message: 'Data added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/update-external-data/:id', async (req, res) => {
  const articleId = req.params.id;

  try {
    // Fetch updated data from an external API
    const updatedData = await fetchUpdatedData(articleId);

    // Update the corresponding article in your JSON object
    const index = articles.findIndex(article => article.id === articleId);

    if (index !== -1) {
      articles[index] = updatedData;
      res.sendStatus(204);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function fetchWeatherData(latitude, longitude) {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
}


const memes = [
  {
    ID: 1,
    bottomText: 'Good!',
    image: 'http://imgflip.com/s/meme/Grumpy-Cat.jpg',
    name: 'Grumpy Cat',
    tags: 'Tardar Sauce, Tabatha Bundesen, Felis domesticus',
    topText: '',
  },
  // Add more meme data here...
];

app.get('/', (req, res) => {
  res.render('index', { memes });
});

app.get('/:id', (req, res) => {
  const memeId = parseInt(req.params.id);
  const meme = memes.find((m) => m.ID === memeId);
  res.render('meme', { meme });
});




