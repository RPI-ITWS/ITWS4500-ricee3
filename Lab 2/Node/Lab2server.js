const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())

// Load articles from the JSON file
const articles = require('../lab2.json');

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
