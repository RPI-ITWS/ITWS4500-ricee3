const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();
const moment = require('moment');

const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB);
const db = client.db("lab5");
const collection = db.collection('weathers');
const etl = db.collection('etl');



const app = express();
const port = 3000;

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'lab6/build')));
app.use(bodyParser.json());
app.use('./weatherIcons', express.static('path/to/weatherIcons'));

const troyWeatherHistory = require('./public/twh.json');
const newsJson = require('./public/lab6.json');

const articlesIndex = newsJson.results.map((item, index) => {
  return {
    index: index,
    title: item.title,
    id: item.article_id
  };
});

function kelvinToFahrenheit(kelvin) {
  const fahrenheit = (kelvin - 273.15) * 9 / 5 + 32;
  return Math.round(fahrenheit * 1000) / 1000;
}

function weatherUrl(lat, lon) {
  var Wurl = 'https://api.openweathermap.org/data/2.5/weather?lat=';
  Wurl += lat;
  Wurl += '&lon=';
  Wurl += lon;
  Wurl += '&appid=0e62dbe493df9b5e8a160864b72d7992';
  return Wurl;
}

function boredUrl(parameters) {
  var Wurl = 'https://www.boredapi.com/api/activity';
  if (parameters.accessibility) {
    Wurl += '?minaccessibility=0&maxaccessibility=';
    Wurl += parameters.accessiblity;
  }
  if (parameters.type) {
    Wurl += '?type=';
    Wurl += parameters.type;
  }
  if (parameters.participants) {
    Wurl += '?participants';
    Wurl += parameters.participants;
  }
  if (parameters.price) {
    Wurl += '?minprice=0&maxprice=';
    Wurl += parameters.price;
  }
  return Wurl;
}
function restCountry(country) {
  var site = 'https://restcountries.com/v3.1/alpha/';
  return (site + country);
}
function positionStack(lat, lon) {
  var site = 'http://api.positionstack.com/v1/reverse?access_key=fabdfcb6c0ad15cf826f2c9496fe3d5c&query=';
  site += lat;
  site += ',';
  site += lon;
  return site;
}
function frankUrl(denom) {
  var site = 'https://api.frankfurter.app/latest?from=';
  return (site + denom);
}
async function getLoc(lat, lon) {
  return new Promise(async (resolve, reject) => {
    const site = positionStack(lat, lon);

    try {
      const response = await fetch(site);
      //if (!response.ok) throw new Error('Network response was not ok.');

      const data = await response.json();
      const cntyInfo = {
        region: data.data[0].region,
        countrycode: data.data[0].country_code,
        country: data.data[0].country,
      };
      resolve(cntyInfo);
    } catch (error) {
      reject(error);
    }
  });
}

// async function listDatabases(client){
//   databasesList = await client.db().admin().listDatabases();

//   console.log("Databases:");
//   databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

//GET / is done by the public folder
/*using:
  1. image_url
  2. description
  3. article_id
  4. link
  5. title
*/

// GET /news = retrieve a listing of article numbers (hint: you can use headers for this if you don’t want to send the list in the body of your response; hint2: consider pagination, since you have a lot of articles!)
app.get('/news', (req, res) => {
  const startIndex = parseInt(req.query.start) || 0;

  // Use slice to get articles starting from the specified index
  var selectedArticles = [];
  let x = 0;
  let numArts = 25;
  while (x < numArts) {
    curIndex = (startIndex + x) % articlesIndex.length;
    if (articlesIndex[curIndex].title) {
      selectedArticles.push(articlesIndex[curIndex])
    }
    else { numArts++; }
    x++;
  }
  res.send(selectedArticles);
});

app.get('/news/size', (req, res) => {

  if (newsJson.results.length) { res.json({ size: newsJson.results.length }); }
  else { res.status(404).send('Size not found'); }
});

app.get('/news/:id', (req, res) => {
  const articleId = parseInt(req.params.id);
  // res.send(articlesIndex.at(courseId));
  const article = newsJson.results[articleId];
  if (articleId >= 0 && articleId < newsJson.results.length && article.title) {
    res.send(`{
      "article_id": "${article.article_id}",
      "title": "${article.title}",
      "link": "${article.link}",
      "description": "${article.description}",
      "image_url": "${article.image_url}"
    }`);
  } else {
    res.status(404).send('Article not found');
  }
});

//Get1 -- get the region information for Troy and weather
app.get('/troy/weather', async (req, res) => {
  const lat = 42.730128;
  const lon = -73.681768;
  const Wurl = weatherUrl(lat, lon);
  const Lurl = restCountry('USA');

  try {
    // Fetch weather data
    const weatherResponse = await fetch(Wurl);
    const weatherData = await weatherResponse.json();

    // Fetch location data
    const locationResponse = await fetch(Lurl);
    const locationData = await locationResponse.json();

    //Territory Info
    const terrInfo = {
      region: 'New York',
      countrycode: 'USA',
      country: 'United States',
    };
    // Combine weather and location data
    const combinedData = {
      weather: weatherData,
      location: locationData,
      region: terrInfo
    };

    // Send the combined data back to the client
    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});
//Get2 -- get region information for troy and exchange
app.get('/troy/denomination', async (req, res) => {
  const Furl = frankUrl('USD');
  const Lurl = restCountry('USA');

  try {
    // Fetch weather data
    const currencyReponse = await fetch(Furl);
    const currencyData = await currencyReponse.json();
    // Fetch location data
    const locationResponse = await fetch(Lurl);
    const locationData = await locationResponse.json();

    //Territory Info
    const terrInfo = {
      region: 'New York',
      countrycode: 'USA',
      country: 'United States',
    };
    // Combine weather and location data
    const combinedData = {
      currency: currencyData,
      location: locationData,
      region: terrInfo
    };

    // Send the combined data back to the client
    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});
//Get3 -- get the coordinates for your location and country information
app.get('/local/weather', urlencodedParser, async (req, res) => {
  const lat = req.query.lat || 42.7360256;
  const lon = req.query.lon || -73.6690176; // Make sure this matches the client-side naming
  const Wurl = weatherUrl(lat, lon);
  const terrInfo = await getLoc(lat, lon);
  const Lurl = restCountry(terrInfo.countrycode);

  try {
    // Fetch weather data
    const weatherResponse = await fetch(Wurl);
    const weatherData = await weatherResponse.json();

    // Fetch location data
    const locationResponse = await fetch(Lurl);
    const locationData = await locationResponse.json();

    // Combine weather and location data
    const combinedData = {
      weather: weatherData,
      location: locationData,
      region: terrInfo
    };

    // Send the combined data back to the client
    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});
//get local weather and activity
app.get('/local/activity', urlencodedParser, async (req, res) => {
  const lat = req.query.lat || 42.7360256;
  const lon = req.query.lon || -73.6690176; // Make sure this matches the client-side naming
  const Wurl = weatherUrl(lat, lon);

  const parameters = {
    accessibility: req.query.accessibility,
    type: req.query.type,
    participants: req.query.participants,
    price: req.query.price
  };
  // console.log(parameters);
  const Aurl = boredUrl(parameters);
  const RAurl = 'https://www.boredapi.com/api/activity';


  try {
    // Fetch weather data
    const weatherResponse = await fetch(Wurl);
    const weatherData = await weatherResponse.json();
    let activityData;
    try {
      const activityResponse = await fetch(Aurl);
      if (!activityResponse.ok) {
        throw new Error('API request failed with status ' + activityResponse.status);
      }
      activityData = await activityResponse.json();

      // Check if the specific error message is present in the response
      if (activityData.error === "Endpoint not found") {
        // Make a second API call if the first one failed with a specific error
        const fallbackResponse = await fetch(RAurl);
        if (!fallbackResponse.ok) {
          throw new Error('Fallback API request failed with status ' + fallbackResponse.status);
        }
        const fallbackData = await fallbackResponse.json();
        // Use fallbackData as needed
      } else {
        // Use activityData as needed
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    }


    // Combine weather and location data
    const combinedData = {
      weather: weatherData,
      activity: activityData
    };

    // Send the combined data back to the client
    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

//Get4 -- get the stock price for you local currency
app.get('/stock/:id', (req, res) => {
  var stockJSON;

  var stockURL = 'https://api.marketdata.app/v1/stocks/quotes/' + req.params.id + '/';
  var moneyURL = 'https://api.frankfurter.app/latest?from=USD';
  const currency = req.query.c;
  fetch(stockURL)
    .then((stockResp) => {
      if (!stockResp.ok) {
        res.status(500);
        res.json({ 'message': 'I was not able to fetch that stock :(' });
      } else {
        return stockResp.json();
      }
    })
    .then((stockData) => {
      stockJSON = stockData;
      fetch(moneyURL)
        .then((moneyResp) => {
          if (!moneyResp.ok) {
            res.status(500);
            res.json({ 'message': 'I was not able to fetch the conversions :(' });
          } else {
            return moneyResp.json();
          }
        })
        .then((moneyJSON) => {
          LastStockJSON = { "price": stockJSON['last'][0] }
          if (currency in moneyJSON['rates'])
            res.json(Object.assign(LastStockJSON, { currency: moneyJSON['rates'][currency] }));
          else
            res.json(Object.assign(LastStockJSON, moneyJSON));
        });
    });
});
//Get5 -- get the mid price for your local currency
app.get('/mid/:id', (req, res) => {
  var stockJSON;

  var stockURL = 'https://api.marketdata.app/v1/stocks/quotes/' + req.params.id + '/';
  var moneyURL = 'https://api.frankfurter.app/latest?from=USD';
  const currency = req.query.c;
  fetch(stockURL)
    .then((stockResp) => {
      if (!stockResp.ok) {
        res.status(500);
        res.json({ 'message': 'I was not able to fetch that stock :(' });
      } else {
        return stockResp.json();
      }
    })
    .then((stockData) => {
      stockJSON = stockData;
      fetch(moneyURL)
        .then((moneyResp) => {
          if (!moneyResp.ok) {
            res.status(500);
            res.json({ 'message': 'I was not able to fetch the conversions :(' });
          } else {
            return moneyResp.json();
          }
        })
        .then((moneyJSON) => {
          LastStockJSON = { "price": stockJSON['mid'][0] }
          if (currency in moneyJSON['rates'])
            res.json(Object.assign(LastStockJSON, { currency: moneyJSON['rates'][currency] }));
          else
            res.json(Object.assign(LastStockJSON, moneyJSON));
        });
    });
});
//Get6 -- get the asking price with your local currency
app.get('/ask/:id', (req, res) => {
  var stockJSON;

  var stockURL = 'https://api.marketdata.app/v1/stocks/quotes/' + req.params.id + '/';
  var moneyURL = 'https://api.frankfurter.app/latest?from=USD';
  const currency = req.query.c;
  fetch(stockURL)
    .then((stockResp) => {
      if (!stockResp.ok) {
        res.status(500);
        res.json({ 'message': 'I was not able to fetch that stock :(' });
      } else {
        return stockResp.json();
      }
    })
    .then((stockData) => {
      stockJSON = stockData;
      fetch(moneyURL)
        .then((moneyResp) => {
          if (!moneyResp.ok) {
            res.status(500);
            res.json({ 'message': 'I was not able to fetch the conversions :(' });
          } else {
            return moneyResp.json();
          }
        })
        .then((moneyJSON) => {
          LastStockJSON = { "price": stockJSON['ask'][0] }
          if (currency in moneyJSON['rates'])
            res.json(Object.assign(LastStockJSON, { currency: moneyJSON['rates'][currency] }));
          else
            res.json(Object.assign(LastStockJSON, moneyJSON));
        });
    });
});


// POST /news = append a news article to the end of the JSON object
app.post('/news', urlencodedParser, (req, res) => {
  const article = {
    'article_id': req.body.article_id,
    'title': req.body.title,
    'link': req.body.link,
    'description': req.body.description,
    'image_url': req.body.image_url
    // Add other fields as needed
  };
  newsJson.results.push(article);

  fs.writeFileSync('./public/lab6.json', JSON.stringify(newsJson), 'utf8', (err) => {
    if (err) {
      res.status(500).send('Error with updating article.')
      return
    }
    res.status(200).send('Article successfully appended.');
  });
});

// POST endpoint. This POST endpoint must add data from at least one of your external APIs to your JSON object.
app.post('/troy/weather', urlencodedParser, async (req, res) => {
  const lat = 42.730128;
  const lon = -73.681768;
  const Wurl = weatherUrl(lat, lon);
  const weatherResponse = await fetch(Wurl);
  const weatherData = await weatherResponse.json();

  const now = moment().format('YYYY-MM-DD HH:mm:ss');

  troyWeatherHistory[now] = weatherData;
  fs.writeFileSync('./public/twh.json', JSON.stringify(troyWeatherHistory), 'utf8', (err) => {
    if (err) {
      res.status(500).send('Error with updating article.')
      return
    }
    res.status(200).send('Article successfully appended.');
  });
});

// PUT /news = bulk update all your articles in one field
app.put('/news', urlencodedParser, (req, res) => {
  newsJson.results.forEach((article, index) => {
    if (req.body.title != '') {
      article.title = req.body.title;
    }
    if (req.body.article_id != '') {
      article.article_id = req.body.article_id;
    }
    if (req.body.link != '') {
      article.link = req.body.link;
    }
    if (req.body.description != '') {
      article.description = req.body.description;
    }
    if (req.body.image_url != '') {
      article.image_url = req.body.image_url;
    }
  });
  fs.writeFileSync('./public/lab6.json', JSON.stringify(newsJson), 'utf8', (err) => {
    if (err) {
      res.status(500).send('Error with updating article.')
      return
    }
    res.send('Article successfully appended.');
  });
});

// PUT /news/### = update the specific article
app.put('/news/:id', urlencodedParser, (req, res) => {
  const articleId = parseInt(req.params.id);
  if (articleId >= 0 && articleId < newsJson.results.length && newsJson.results[articleId].title) {

    if (req.body.title != '') {
      newsJson.results[articleId].title = req.body.title;
    }
    if (req.body.article_id != '') {
      newsJson.results[articleId].article_id = req.body.article_id;
    }
    if (req.body.link != '') {
      newsJson.results[articleId].link = req.body.link;
    }
    if (req.body.description != '') {
      newsJson.results[articleId].description = req.body.description;
    }
    if (req.body.image_url != '') {
      newsJson.results[articleId].image_url = req.body.image_url;
    }
    fs.writeFileSync('./public/lab6.json', JSON.stringify(newsJson), 'utf8', (err) => {
      if (err) {
        res.status(500).send('Error with updating article.')
        return
      }
      res.send('Article successfully appended.');
    });
  } else {
    res.status(404).send('Article not found');
  }
});

// PUT endpoint. This PUT endpoint must update data in your JSON object from at least one of your external APIs
app.put('/troy/weather', urlencodedParser, async (req, res) => {
  const lat = 42.730128;
  const lon = -73.681768;
  const Wurl = weatherUrl(lat, lon);
  const weatherResponse = await fetch(Wurl);
  const weatherData = await weatherResponse.json();


  switch (req.body.type) {
    case 't':
      Object.entries(troyWeatherHistory).forEach(([date, data]) => {
        data.main.temp = weatherData.main.temp;
      });
      break;
    case 'f':
      Object.entries(troyWeatherHistory).forEach(([date, data]) => {
        data.main.feels_like = weatherData.main.feels_like;
      });
      break;
    case 'w':
      Object.entries(troyWeatherHistory).forEach(([date, data]) => {
        data.wind.speed = weatherData.wind.speed;
      });
      break;
  }
  fs.writeFileSync('./public/twh.json', JSON.stringify(troyWeatherHistory), 'utf8', (err) => {
    if (err) {
      res.status(500).send('Error with updating article.')
      return
    }
    res.status(200).send('Article successfully appended.');
  });
});

// DELETE /news/### = delete the specific article
app.delete('/news/:id', (req, res) => {
  const articleId = parseInt(req.params.id);
  if (articleId >= 0 && articleId < newsJson.results.length && newsJson.results[articleId].title) {
    newsJson.results[articleId].title = '';
    newsJson.results[articleId].article_id = '';
    newsJson.results[articleId].link = '';
    newsJson.results[articleId].description = '';
    newsJson.results[articleId].image_url = '';
    // console.log(req.body.image_url);
    // console.log(newsJson.results[articleId].image_url);
    fs.writeFileSync('./public/lab6.json', JSON.stringify(newsJson), 'utf8', (err) => {
      if (err) {
        res.status(500).send('Error with updating article.')
        return
      }
      res.send('Article successfully appended.');
    });
  } else {
    res.status(404).send('Article not found');
  }
});

app.get('/db/size', async (req, res) => {
  try {
    await client.connect();
    const documents = await collection.find({}, { projection: { _id: 0, id: 1 } }).toArray();
    console.log
    res.json({
      message: "IDs from the lab6 collection",
      size: parseInt(documents.length)
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

app.get('/db/etl1', async (req, res) => {
  const lat = 42.730128;
  const lon = -73.681768;
  let Wurl = `https://api.openweathermap.org/data/2.5/weather?lat=`;
  Wurl += lat;
  Wurl += '&lon=';
  Wurl += lon;
  Wurl += '&appid=0e62dbe493df9b5e8a160864b72d7992&units=imperial';
  let weatherData;

  try {
    const weatherResponse = await fetch(Wurl);
    weatherData = await weatherResponse.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).send('Error fetching weather data');
  }

  try {
    await client.connect();
    const highestIdDocument = await etl.find().sort({ id: -1 }).limit(1).toArray();

    let nextId = 0;
    if (highestIdDocument.length > 0) {
      nextId = highestIdDocument[0].id + 1;
    }

    const article = {
      id: nextId,
      temperature: weatherData.main.temp,
      feelsLike: weatherData.main.feels_like,
      windSpeed: weatherData.wind.speed,
      humidity: weatherData.main.humidity,
      timeField: new Date((weatherData.dt) * 1000),
      etl: "etl1"
    };

    const result = await etl.insertOne(article);

    if (result.acknowledged) {
      res.status(200).json({ message: 'POST request successful, article appended!', id: nextId });
    } else {
      throw new Error('Article insertion not acknowledged.');
    }
  } catch (e) {
    console.error('Error inserting document:', e);
    return res.status(500).json({ error: 'Error inserting document.' });
  } finally {
    await client.close();
  }
});
app.get('/db/etl2', async (req, res) => {
  let weatherData;
  const Wurl = "https://api.open-meteo.com/v1/forecast?latitude=42.730128&longitude=-73.681768&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&daily=temperature_2m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York";

  try {
    const weatherResponse = await fetch(Wurl);
    weatherData = await weatherResponse.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).send('Error fetching weather data');
  }

  try {
    await client.connect();
    const highestIdDocument = await etl.find().sort({ id: -1 }).limit(1).toArray();

    let nextId = 0;
    if (highestIdDocument.length > 0) {
      nextId = highestIdDocument[0].id + 1;
    }

    const article = {
      id: nextId,
      temperature: weatherData.current.temperature_2m,
      feelsLike: weatherData.current.apparent_temperature,
      windSpeed: weatherData.current.wind_speed_10m,
      humidity: weatherData.current.relative_humidity_2m,
      timeField: new Date(weatherData.current.time),
      etl: "etl2"
    };

    const result = await etl.insertOne(article);

    if (result.acknowledged) {
      res.status(200).json({ message: 'POST request successful, article appended!', id: nextId });
    } else {
      throw new Error('Article insertion not acknowledged.');
    }
  } catch (e) {
    console.error('Error inserting document:', e);
    return res.status(500).json({ error: 'Error inserting document.' });
  } finally {
    await client.close();
  }

});
app.get('/db/etl3', async (req, res) => {
  let weatherData;
  const Wurl = "http://api.weatherapi.com/v1/current.json?key=77dadc8d79944dacb64165321242903&q=42.730128,-73.681768&aqi=no";

  try {
    const weatherResponse = await fetch(Wurl);
    weatherData = await weatherResponse.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).send('Error fetching weather data');
  }

  try {
    await client.connect();
    const highestIdDocument = await etl.find().sort({ id: -1 }).limit(1).toArray();

    let nextId = 0;
    if (highestIdDocument.length > 0) {
      nextId = highestIdDocument[0].id + 1;
    }

    const article = {
      id: nextId,
      temperature: weatherData.current.temp_f,
      feelsLike: weatherData.current.feelslike_f,
      windSpeed: weatherData.current.wind_mph,
      humidity: weatherData.current.humidity,
      timeField: new Date(weatherData.location.localtime),
      etl: "etl3"
    };

    const result = await etl.insertOne(article);

    if (result.acknowledged) {
      res.status(200).json({ message: 'POST request successful, article appended!', id: nextId });
    } else {
      throw new Error('Article insertion not acknowledged.');
    }
  } catch (e) {
    console.error('Error inserting document:', e);
    return res.status(500).json({ error: 'Error inserting document.' });
  } finally {
    await client.close();
  }

});

// GET request logic on /db/:number should fetch one specific document from the collection
app.get('/db/:id', async (req, res) => {
  const articleId = parseInt(req.params.id);
  try {
    await client.connect();
    const document = await collection.findOne({ id: articleId }, { projection: { _id: 0 } });
    if (document) {
      res.json({
        message: "Document with id from the lab6 collection",
        document: document
      });
    } else {
      res.status(404).json({ error: "Document with id from the lab6 collection not found" })
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});
//the GET request is on /db, you should get a listing of all valid document numbers in the collection
app.get('/db', async (req, res) => {
  try {
    await client.connect();
    const documents = await collection.find({}, { projection: { _id: 0, id: 1 } }).toArray();
    const ids = documents.map(doc => doc.id); // Converting ObjectId to String
    res.json({
      message: "IDs from the lab6 collection",
      ids: ids
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

//A POST request to a /db/:number endpoint should result in an error.
app.post('/db/:id', (req, res) => {
  res.status(403).json({ error: "You cant post to a specific id." });
});
//The POST request logic should allow you to add a new document to the collection and the document to add will be in the body of the POST request.
app.post('/db', urlencodedParser, async (req, res) => {
  try {
    await client.connect();
    const highestIdDocument = await collection.find().sort({ id: -1 }).limit(1).toArray();

    let nextId = 0;
    if (highestIdDocument.length > 0) {
      nextId = highestIdDocument[0].id + 1;
    }

    const article = {
      id: nextId,
      article_id: req.body.article_id,
      title: req.body.title,
      link: req.body.link,
      description: req.body.description,
      image_url: req.body.image_url
    };

    const result = await collection.insertOne(article);

    if (result.acknowledged) {
      //console.log('Article successfully appended with id:', result.insertedId);
      res.status(200).json({ message: 'POST request successful, article appended!', id: nextId });
    } else {
      throw new Error('Article insertion not acknowledged.');
    }
  } catch (e) {
    //console.error('Error with updating article:', e);
    res.status(500).json({ error: 'Error with updating article.' });
  } finally {
    await client.close();
  }

});

//The PUT logic on /db/:number should allow you to update an existing document.
app.put('/db/:id', urlencodedParser, async (req, res) => {
  const articleId = parseInt(req.params.id);
  try {
    await client.connect();

    const document = await collection.findOne({ id: articleId }, { projection: { _id: 0 } });
    if (!document) {
      res.status(404).json({ error: "Document with id from the lab6 collection not found" })
      console.error("Document not found", 404);
    }
    else {
      const result = await collection.updateOne(
        { id: articleId },
        {
          $set: {
            title: req.body.title ? req.body.title : document.title,
            description: req.body.description ? req.body.description : document.description,
            link: req.body.link ? req.body.link : document.link,
            article_id: req.body.article_id ? req.body.article_id : document.article_id,
            image_url: req.body.image_url ? req.body.image_url : document.image_url
          }
        }
      );

      if (result.acknowledged) {
        res.status(200).json({ message: 'PUT request successful, article successfully updated!' });
      } else {
        throw new Error('Article update not acknowledged.');
      }
    }
  } catch (e) {
    console.error('Error with updating article:', e);
    res.status(500).json({ error: 'Error with updating article.' });
  } finally {
    await client.close();
  }
});
//A PUT request on the /db endpoint should bulk update all documents in the collection.
app.put('/db', urlencodedParser, async (req, res) => {
  try {
    await client.connect();
    const documents = await collection.find({}).toArray();
    const bulkOps = await Promise.all(documents.map(async (document) => {
      const lilresult = await collection.updateOne(
        { id: document.id },
        {
          $set: {
            title: req.body.title ? req.body.title : document.title,
            description: req.body.description ? req.body.description : document.description,
            link: req.body.link ? req.body.link : document.link,
            article_id: req.body.article_id ? req.body.article_id : document.article_id,
            image_url: req.body.image_url ? req.body.image_url : document.image_url
          }
        }
      );
      if (!lilresult.acknowledged) {
        throw new Error('Lil article update not acknowledged.');
      }
    }));
    res.status(200).json({ message: "PUT all request successful, all articles updated" })
  } catch (e) {
    console.error('Error with updating article:', e);
    res.status(500).json({ error: 'Error with updating article.' });
  } finally {
    await client.close();
  }
});

app.delete('/db/:id', async (req, res) => {
  const articleId = parseInt(req.params.id);
  try {
    await client.connect();
    const document = await collection.findOne({ id: articleId }, { projection: { _id: 0 } });
    if (document) {
      const result = await collection.deleteOne({ id: articleId });
      res.json({ message: `DELETE request successful, document deleted!` });
    } else {
      res.json({ message: "OK" })
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});
app.delete('/db', async (req, res) => {
  try {
    await client.connect();
    const result = await collection.deleteMany({});
    res.json({ message: `DELETE request successful, are you nuts?! ${result.deletedCount} document(s) was/were deleted!` });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});