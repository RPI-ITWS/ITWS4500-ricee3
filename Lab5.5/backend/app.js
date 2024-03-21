const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

const articleSchema = new mongoose.Schema({
    articleNumber: Number,
    source: {
      id: String,
      name: String
    },
    author: String,
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: String,
    content: String
  });
  
const Article = mongoose.model('Article', articleSchema, 'articles');

const mongoUri = process.env.MONGODB;
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Failed to connect to MongoDB', error));

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.static('public'));

const OPENWEATHERMAP_API_KEY = '3913bbbcaaf2a22e7c15f9a6be06b973';
const YELP_API_KEY = 'A_Htc0kRERnfNtMFchCx7J0yJkDnezb4sJDYRGh8bweGYMaxGosvL7ujnS-8cKA3YjmTVOQZ7fiBqxokvcR9eFXAUWu4IfISDPDah3K60ivb-cOU_24hbVY9CUi9ZXYx';
const NEWSAPI_KEY = '41ca52ed56574cd7a11c8f31fa152e91';

let articles = [];

fs.readFile('project.json', (err, data) => {
    if (err) throw err;
    articles = JSON.parse(data);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/news', (req, res) => {
    let articleNumbers = articles.map((article, index) => index + 1);
    res.send(articleNumbers);
});

app.get('/news/:id', (req, res) => {
    const articleId = parseInt(req.params.id);
    const article = articles[articleId - 1];
    if (article) {
        res.send(article);
    } else {
        res.status(404).send('Article not found');
    }
});

app.post('/news', (req, res) => {
    const newArticle = req.body;
    articles.push(newArticle);
    fs.writeFile('project.json', JSON.stringify(articles, null, 4), err => { 
        if (err) {
            console.error('Error saving the article', err);
            res.status(500).send('Error saving the article');
            return;
        }
        res.send('Article added successfully');
    });
});

app.put('/news', (req, res) => {
    const updatedArticles = req.body;
    fs.writeFile('project.json', JSON.stringify(updatedArticles, null, 4), err => {
        if (err) {
            console.error('Error updating articles', err);
            res.status(500).send('Error updating articles');
            return;
        }
        res.send('Articles updated successfully');
    });
});

app.put('/news/:id', (req, res) => {
    const articleId = parseInt(req.params.id, 10) - 1;
    if (articleId >= 0 && articleId < articles.length) {
        articles[articleId] = req.body;
        fs.writeFile('project.json', JSON.stringify(articles, null, 2), err => {
            if (err) {
                console.error('Error updating the article', err);
                res.status(500).send('Error updating the article');
                return;
            }
            res.json({ message: 'Article updated successfully' });
        });
    } else {
        res.status(404).send('Article not found');
    }
});

app.delete('/news/:id', (req, res) => {
    const articleId = parseInt(req.params.id, 10) - 1;
    if (articleId >= 0 && articleId < articles.length) {
        articles.splice(articleId, 1);
        fs.writeFile('project.json', JSON.stringify(articles, null, 2), err => {
            if (err) {
                console.error('Error deleting the article', err);
                res.status(500).send('Error deleting the article');
                return;
            }
            res.json({ message: 'Article deleted successfully' });
        });
    } else {
        res.status(404).send('Article not found');
    }
});

app.get('/news/search/:keyword', (req, res) => {
    const keyword = req.params.keyword.toLowerCase();
    const searchResults = articles.filter(article => 
        article.Title.toLowerCase().includes(keyword) || 
        article.Description.toLowerCase().includes(keyword)
    );
    res.send(searchResults);
});

app.get('/citydata/:zip', async (req, res) => {
    const zip = req.params.zip;

    try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
        const yelpResponse = await axios.get(`https://api.yelp.com/v3/businesses/search?location=${zip}`, {
            headers: { Authorization: `Bearer ${YELP_API_KEY}` }
        });

        const pageContent = generateCityDataContent(weatherResponse.data, yelpResponse.data.businesses);

        res.send(pageContent);
    } catch (error) {
        console.error('API request failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

function generateCityDataContent(weatherData, yelpBusinesses) {
    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

    let weatherHtml = `
        <h2>Weather in ${weatherData.name}</h2>
        <img src="${iconUrl}" alt="Weather icon" style="width:50px;height:50px;">
        <p>Temperature: ${weatherData.main.temp}°C</p>
        <p>Description: ${weatherData.weather[0].description}</p>
    `;

    let yelpHtml = '<h2>Top Yelp Businesses</h2><ul>';
    yelpBusinesses.forEach(business => {
        yelpHtml += `<li><a href="${business.url}" target="_blank">${business.name}</a> - ${business.rating} stars</li>`;
    });
    yelpHtml += '</ul>';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>City Data for ${weatherData.name}</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        </head>
        <body>
            <div class="container">
                ${weatherHtml}
                ${yelpHtml}
            </div>
        </body>
        </html>
    `;
}

app.get('/food/cafes/:zip', async (req, res) => {
    const zip = req.params.zip;

    try {
        const zippoResponse = await axios.get(`http://api.zippopotam.us/us/${zip}`);
        const yelpResponse = await axios.get(`https://api.yelp.com/v3/businesses/search?term=cafes&location=${zip}&sort_by=rating`, {
            headers: { Authorization: `Bearer ${YELP_API_KEY}` }
        });

        const locationData = zippoResponse.data;
        const cafes = yelpResponse.data.businesses.map(business => ({
            name: business.name,
            rating: business.rating,
            address: business.location.address1,
            phone: business.display_phone,
            url: business.url
        }));

        const pageContent = generateCafeContent(locationData, cafes, zip);
        res.send(pageContent);
    } catch (error) {
        console.error('API request failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

function generateCafeContent(locationData, cafes, zip) {

    let locationHtml = `<h2>Location Information for ${zip}</h2>
                         <p>Place: ${locationData.places[0]['place name']}</p>
                         <p>State: ${locationData.places[0].state}</p>
                         <p>Longitude: ${locationData.places[0].longitude}, Latitude: ${locationData.places[0].latitude}</p>`;

    let cafesHtml = '<h2>Top Rated Cafes</h2><ul>';
    cafes.forEach(cafe => {
        cafesHtml += `<li>
                        <h3><a href="${cafe.url}" target="_blank">${cafe.name}</a></h3>
                        <p>Rating: ${cafe.rating} stars</p>
                        <p>Address: ${cafe.address}</p>
                        <p>Phone: ${cafe.phone}</p>
                      </li>`;
    });
    cafesHtml += '</ul>';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Location and Yelp Data for ${zip}</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        </head>
        <body>
            <div class="container">
                ${locationHtml}
                ${cafesHtml}
            </div>
        </body>
        </html>
    `;
}

app.get('/food/health/:zip', async (req, res) => {
    const zip = req.params.zip;

    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
        const weatherResponse = await axios.get(weatherUrl);
        const { humidity, feels_like } = weatherResponse.data.main;
        const cityName = weatherResponse.data.name;

        const yelpUrl = `https://api.yelp.com/v3/businesses/search?location=${zip}&categories=restaurants&sort_by=rating&attributes=health_and_safety_measures`;
        const yelpResponse = await axios.get(yelpUrl, { headers: { Authorization: `Bearer ${YELP_API_KEY}` } });
        const restaurants = yelpResponse.data.businesses;

        const pageContent = generateHealthContent(cityName, humidity, feels_like, restaurants);
        res.send(pageContent);
    } catch (error) {
        console.error('API request failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

function generateHealthContent(city, humidity, feelsLike, restaurants) {
    let restaurantsHtml = restaurants.map(restaurant => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${restaurant.name}</h5>
                <p class="card-text">${restaurant.location.address1}, ${restaurant.location.city}</p>
                <p class="card-text">Rating: ${restaurant.rating} stars</p>
                <a href="${restaurant.url}" target="_blank" class="btn btn-primary">View on Yelp</a>
            </div>
        </div>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Health and Safety Measures in ${city}</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        </head>
        <body>
            <div class="container mt-4">
                <h1>Top Rated Restaurants with Health and Safety Measures in ${city}</h1>
                <div class="weather-info mb-4">
                    <h2>Weather Information</h2>
                    <p>Humidity: ${humidity}%</p>
                    <p>Feels Like: ${feelsLike}°C</p>
                </div>
                ${restaurantsHtml}
            </div>
        </body>
        </html>
    `;
}

app.get('/food/cuisines/:zip', async (req, res) => {
    const zip = req.params.zip;
    let state;

    try {
        const locationResponse = await axios.get(`http://api.zippopotam.us/us/${zip}`);
        state = locationResponse.data.places[0].state;

        const cuisines = ['american', 'chinese', 'greek', 'indian', 'italian', 'japanese', 'korean', 'mexican', 'thai'];
        const cuisineData = [];

        for (const cuisine of cuisines) {
            const yelpResponse = await axios.get(`https://api.yelp.com/v3/businesses/search?term=${cuisine}&location=${state}&limit=3`, {
                headers: { Authorization: `Bearer ${YELP_API_KEY}` }
            });
            cuisineData.push({
                cuisine,
                restaurants: yelpResponse.data.businesses
            });
        }

        const pageContent = generateCuisineContent(state, cuisineData);
        res.send(pageContent);
    } catch (error) {
        console.error('API request failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

function generateCuisineContent(state, cuisineData) {
    const content = cuisineData.map(({ cuisine, restaurants }) => `
        <div class="cuisine-group">
            <h3>${cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}</h3>
            <div class="restaurants row">
                ${restaurants.map(restaurant => `
                    <div class="col-md-4">
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">${restaurant.name}</h5>
                                <p class="card-text">${restaurant.location.address1}, ${restaurant.location.city}</p>
                                <p class="card-text">Rating: ${restaurant.rating} stars</p>
                                <a href="${restaurant.url}" target="_blank" class="btn btn-primary">View on Yelp</a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>State Food Stats for ${state}</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
            <style>
                .cuisine-group { margin-bottom: 30px; }
                .restaurants .card { height: 100%; }
            </style>
        </head>
        <body>
            <div class="container mt-5">
                <h1>Top Cuisines in ${state}</h1>
                ${content}
            </div>
        </body>
        </html>
    `;
}

app.get('/weather/:zip', async (req, res) => {
    const zip = req.params.zip;

    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        const newsUrl = `https://newsapi.org/v2/everything?q=${weatherData.name} weather&apiKey=${NEWSAPI_KEY}`;
        const newsResponse = await axios.get(newsUrl);
        const newsArticles = newsResponse.data.articles;

        const pageContent = generateWeatherContent(weatherData, newsArticles);
        res.send(pageContent);
    } catch (error) {
        console.error('API request failed:', error);
        res.status(500).send('Internal Server Error');
    }
});

function generateWeatherContent(weatherData, newsArticles) {
    const sunriseTime = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();

    let articlesHtml = newsArticles.map(article => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description}</p>
                <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
            </div>
        </div>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Weather and News for ${weatherData.name}</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        </head>
        <body>
            <div class="container mt-5">
                <h1>Weather Details for ${weatherData.name}</h1>
                <p>Temperature: ${weatherData.main.temp}°C</p>
                <p>Description: ${weatherData.weather[0].description}</p>
                <p>Latitude: ${weatherData.coord.lat}</p>
                <p>Longitude: ${weatherData.coord.lon}</p>
                <p>Minimum Temperature: ${weatherData.main.temp_min}°C</p>
                <p>Maximum Temperature: ${weatherData.main.temp_max}°C</p>
                <p>Pressure: ${weatherData.main.pressure} hPa</p>
                <p>Sunrise: ${sunriseTime}</p>
                <p>Sunset: ${sunsetTime}</p>
                <h2>Related News</h2>
                ${articlesHtml}
            </div>
        </body>
        </html>
    `;
}

app.get('/news/combined/:keyword', async (req, res) => {
    const keyword = req.params.keyword.toLowerCase();

    const searchResults = articles.filter(article => 
        article.Title.toLowerCase().includes(keyword) || 
        article.Description.toLowerCase().includes(keyword)
    );

    try {
        const newsApiResponse = await axios.get(`https://newsapi.org/v2/everything?q=${keyword}&apiKey=${NEWSAPI_KEY}`);
        const newsApiResults = newsApiResponse.data.articles;

        const pageContent = generateKeywordContent(searchResults, newsApiResults);
        res.send(pageContent);
    } catch (error) {
        console.error('Error fetching data from NewsAPI:', error);
        res.status(500).send('Internal Server Error');
    }
});

function generateKeywordContent(localData, apiData) {
    let content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Search Results for Keyword</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        </head>
        <body>
        <div class="container mt-4">
        <h1>Search Results</h1>
        <div class="row">
            <div class="col-md-6">
                <h2>Local Articles</h2>
                ${localData.map(article => `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h5 class="card-title">${article.Title}</h5>
                            <p class="card-text">${article.Description}</p>
                            <a href="${article.Link}" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="col-md-6">
                <h2>NewsAPI Articles</h2>
                ${apiData.map(article => `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.description}</p>
                            <a href="${article.url}" class="btn btn-primary">Read More</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
        </body>
        </html>
    `;

    return content;
}

app.post('/news/add/:keyword/:index', async (req, res) => {
    const { keyword, index } = req.params;
    let parsedIndex = parseInt(index, 10);

    if (isNaN(parsedIndex)) {
        return res.status(400).send('Index must be a number.');
    }

    try {
        const newsApiResponse = await axios.get(`https://newsapi.org/v2/everything?q=${keyword}&apiKey=${NEWSAPI_KEY}`);
        const articlesFromApi = newsApiResponse.data.articles;
        
        if (parsedIndex < 0 || parsedIndex >= articlesFromApi.length) {
            return res.status(404).send('Article index out of range.');
        }

        const articleToAdd = articlesFromApi[parsedIndex];
        const newArticle = {
            Title: articleToAdd.title,
            Link: articleToAdd.url,
            Description: articleToAdd.description,
            Date: articleToAdd.publishedAt,
            Category: keyword
        };

        fs.readFile('project.json', (err, data) => {
            if (err) {
                console.error('Failed to read project.json:', err);
                return res.status(500).send('Failed to read project data.');
            }

            const existingArticles = JSON.parse(data.toString());
            existingArticles.push(newArticle);

            fs.writeFile('project.json', JSON.stringify(existingArticles, null, 2), (err) => {
                if (err) {
                    console.error('Failed to write to project.json:', err);
                    return res.status(500).send('Failed to update project data.');
                }

                res.send({ message: 'Article added successfully', article: newArticle });
            });
        });
    } catch (error) {
        console.error('Error fetching data from NewsAPI:', error);
        res.status(500).send('Failed to fetch data from NewsAPI.');
    }
});

app.put('/news/update/:localIndex/:apiIndex/:keyword', async (req, res) => {
    const { localIndex, apiIndex, keyword } = req.params;
    let parsedLocalIndex = parseInt(localIndex, 10);
    let parsedApiIndex = parseInt(apiIndex, 10);

    if (isNaN(parsedLocalIndex) || isNaN(parsedApiIndex)) {
        return res.status(400).send('Both indices must be valid numbers.');
    }

    try {
        const newsApiResponse = await axios.get(`https://newsapi.org/v2/everything?q=${keyword}&apiKey=${NEWSAPI_KEY}`);
        const articlesFromApi = newsApiResponse.data.articles;
        
        if (parsedApiIndex < 0 || parsedApiIndex >= articlesFromApi.length) {
            return res.status(404).send('API article index out of range.');
        }

        fs.readFile('project.json', (err, data) => {
            if (err) {
                console.error('Failed to read project.json:', err);
                return res.status(500).send('Failed to read project data.');
            }

            const existingArticles = JSON.parse(data.toString());
            
            if (parsedLocalIndex < 0 || parsedLocalIndex >= existingArticles.length) {
                return res.status(404).send('Local article index out of range.');
            }

            const articleFromApi = articlesFromApi[parsedApiIndex];
            const updatedArticle = {
                Title: articleFromApi.title,
                Link: articleFromApi.url,
                Description: articleFromApi.description,
                Date: articleFromApi.publishedAt,
                Category: keyword
            };

            existingArticles[parsedLocalIndex] = updatedArticle;

            fs.writeFile('project.json', JSON.stringify(existingArticles, null, 2), err => {
                if (err) {
                    console.error('Failed to write to project.json:', err);
                    return res.status(500).send('Failed to update project data.');
                }

                res.send({ message: 'Article updated successfully', article: updatedArticle });
            });
        });
    } catch (error) {
        console.error('Error fetching data from NewsAPI:', error);
        res.status(500).send('Failed to fetch data from NewsAPI.');
    }
});

app.delete('/news/deleteByKeyword/:keyword', (req, res) => {
    const { keyword } = req.params;
    const lowerCaseKeyword = keyword.toLowerCase();

    fs.readFile('project.json', (err, data) => {
        if (err) {
            console.error('Failed to read project.json:', err);
            return res.status(500).send('Failed to read project data.');
        }

        let articles = JSON.parse(data.toString());

        const filteredArticles = articles.filter(article => 
            !article.Title.toLowerCase().includes(lowerCaseKeyword) && 
            !article.Description.toLowerCase().includes(lowerCaseKeyword)
        );

        fs.writeFile('project.json', JSON.stringify(filteredArticles, null, 2), err => {
            if (err) {
                console.error('Failed to write project.json:', err);
                return res.status(500).send('Failed to update project data.');
            }
            res.send('Articles containing the keyword were deleted successfully.');
        });
    });
});

app.delete('/news/deleteByCategory/:category', (req, res) => {
    const { category } = req.params;
    const lowerCaseCategory = category.toLowerCase();

    fs.readFile('project.json', (err, data) => {
        if (err) {
            console.error('Failed to read project.json:', err);
            return res.status(500).send('Failed to read project data.');
        }

        let articles = JSON.parse(data.toString());

        const filteredArticles = articles.filter(article =>
            article.Category && article.Category.toLowerCase() !== lowerCaseCategory
        );

        fs.writeFile('project.json', JSON.stringify(filteredArticles, null, 2), err => {
            if (err) {
                console.error('Failed to write project.json:', err);
                return res.status(500).send('Failed to update project data.');
            }
            res.send(`Articles in the '${category}' category were deleted successfully.`);
        });
    });
});

app.get('/db', async (req, res) => {
    try {
      const articles = await Article.find()
      res.json(articles.map(article => article.articleNumber));
    } catch (error) {
      res.status(500).send({ message: 'Error fetching article numbers', error });
    }
  });
  
app.post('/db', async (req, res) => {
    try {
      const maxArticle = await Article.findOne().sort({articleNumber: -1});
      const maxArticleNumber = maxArticle ? maxArticle.articleNumber : 0;

      const newsArticle = new Article({
        ...req.body,
        articleNumber: req.body.articleNumber 
      });
  
      await newsArticle.save();
      res.send({ message: 'Article added successfully', id: newsArticle._id, articleNumber: newsArticle.articleNumber, body: newsArticle });
    } catch (error) {
      console.error('Error adding article:', error);
      res.status(500).send({ message: 'Error adding article', error });
    }
    console.log(req.body);
  });

app.put('/db', async (req, res) => {
    try {
      const updateResult = await Article.updateMany({}, { $set: req.body.update });
      if (updateResult.modifiedCount === 0) {
        res.send('No documents were updated');
      } else {
        res.send(`${updateResult.modifiedCount} documents were updated successfully`);
      }
    } catch (error) {
      res.status(500).send({ message: 'Error updating documents', error });
    }
  });
  
app.delete('/db', async (req, res) => {
    try {
      await Article.deleteMany({});
      res.send('All articles deleted successfully');
    } catch (error) {
      res.status(500).send({ message: 'Error deleting articles', error });
    }
  });

app.get('/db/:number', async (req, res) => {
    const articleNumber = parseInt(req.params.number);
    try {
      const article = await Article.findOne({ articleNumber });
      if (article) {
        res.json(article);
      } else {
        res.status(404).send('Article not found');
      }
    } catch (error) {
      res.status(500).send({ message: 'Error fetching article', error });
    }
  });
  
app.post('/db/:number', (req, res) => {
    // this operation is not allowed
    res.status(400).send('Error: Direct POST request to /db/:number is not allowed.');
  });

app.put('/db/:number', async (req, res) => {
    const articleNumber = parseInt(req.params.number);
    try {
      const result = await Article.updateOne({ articleNumber }, { $set: req.body });
      if (result.modifiedCount === 0) {
        res.status(404).send('Article not found or no change made');
      } else {
        res.send('Article updated successfully');
      }
    } catch (error) {
      res.status(500).send({ message: 'Error updating article', error });
    }
  });

app.delete('/db/:number', async (req, res) => {
    const articleNumber = parseInt(req.params.number);
    try {
      await Article.deleteOne({ articleNumber });
      res.send('Article deleted successfully');
    } catch (error) {
      res.status(500).send({ message: 'Error deleting article', error });
    }
  });

app.get('/db/analytics/:number1/:number2', async (req, res) => {
    const number1 = parseInt(req.params.number1);
    const number2 = parseInt(req.params.number2);

    if (isNaN(number1) || isNaN(number2)) {
        return res.status(400).send('Both numbers must be valid integers.');
    }

    try {
        const articles = await Article.find({ articleNumber: { $in: [number1, number2] } });

        if (articles.length !== 2) {
            return res.status(404).send('One or both articles not found.');
        }

        const article1 = articles.find(article => article.articleNumber === number1);
        const article2 = articles.find(article => article.articleNumber === number2);

        const wordCount1 = article1.content.split(/\s+/).length;
        const wordCount2 = article2.content.split(/\s+/).length;
        const pubDate1 = new Date(article1.publishedAt);
        const pubDate2 = new Date(article2.publishedAt);
        const pubDateDifference = Math.abs(pubDate2 - pubDate1) / (1000 * 3600 * 24);

        res.json({
            comparison: {
                article1: {
                    articleNumber: article1.articleNumber,
                    title: article1.title,
                    wordCount: wordCount1,
                    publishedAt: article1.publishedAt
                },
                article2: {
                    articleNumber: article2.articleNumber,
                    title: article2.title,
                    wordCount: wordCount2,
                    publishedAt: article2.publishedAt
                },
                analytics: {
                    wordCountDifference: Math.abs(wordCount1 - wordCount2),
                    publicationDateDifference: pubDateDifference.toFixed(2) + " day(s)"
                }
            }
        });
    } catch (error) {
        console.error('Error comparing articles:', error);
        res.status(500).send({ message: 'Error comparing articles', error });
    }
});

app.listen(4000);