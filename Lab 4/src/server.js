const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const fs = require('fs');

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(bodyParser.json());

// Route to serve the index.html file
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route to serve the script.js file
app.get('/script.js', (req, res) => {
   res.sendFile(path.join(__dirname, 'public/script.js'));
});

// Route to serve the styles.css file
app.get('/styles.css', (req, res) => {
   res.sendFile(path.join(__dirname, 'public/styles.css'));
});


app.get('/stocks', async (req, res) => {
   const symbols = req.query.symbols.split(',').map(symbol => symbol.trim());
   const currency = req.query.c;

   try {
      const stockDataArray = await Promise.all(
         symbols.map(async symbol => {
            const stockURL = `https://api.marketdata.app/v1/stocks/quotes/${symbol}/`;
            const stockResp = await fetch(stockURL);

            if (!stockResp.ok) {
               throw new Error(`Failed to fetch data for ${symbol}`);
            }

            const stockData = await stockResp.json();
            return {
               symbol,
               ...stockData
            }; // Include the symbol in the response
         })
      );

      // Send the processed stockDataArray back to the client
      res.json(stockDataArray);
   } catch (error) {
      console.error('Error fetching stock data:', error);
      res.status(500).json({
         message: 'Failed to fetch stock data'
      });
   }
});


app.get('/stock/:id', (req, res) => {
   var stockJSON;
   let c = req.query.c;

   var stockURL = 'https://api.marketdata.app/v1/stocks/quotes/' + req.params.id + '/';
   var moneyURL = 'https://api.frankfurter.app/latest?from=USD';

   fetch(stockURL)
      .then((stockResp) => {
         if (!stockResp.ok) {
            res.status(500);
            res.json({
               'message': 'I was not able to fetch that stock :('
            });
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
                  res.json({
                     'message': 'I was not able to fetch the conversions :('
                  });
               } else {
                  return moneyResp.json();
               }
            })
            .then((moneyJSON) => {
               // Check if the selected currency exists in the exchange rates
               if (c && moneyJSON.rates && moneyJSON.rates[c]) {
                  // Convert the stock value to the selected currency
                  const convertedValue = stockJSON.last * moneyJSON.rates[c];
                  // Send the converted value along with other data in the response
                  res.json({
                     last: convertedValue,
                     amount: stockJSON.amount,
                     base: stockJSON.base,
                     date: stockJSON.date,
                     rates: moneyJSON.rates
                  });
               } else {
                  // If the selected currency is not found, send the original stock data
                  res.json({
                     last: stockJSON.last,
                     amount: stockJSON.amount,
                     base: stockJSON.base,
                     date: stockJSON.date,
                     rates: moneyJSON.rates
                  });
               }
            });
      });
});


app.get('/mid/:id', (req, res) => {
   var stockJSON;

   var stockURL = 'https://api.marketdata.app/v1/stocks/quotes/' + req.params.id + '/';
   var moneyURL = 'https://api.frankfurter.app/latest?from=USD';
   let currency = req.query.c
   console.log(req.query)

   fetch(stockURL)
      .then((stockResp) => {
         if (!stockResp.ok) {
            res.status(500);
            res.json({
               'message': 'I was not able to fetch that stock :('
            });
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
                  res.json({
                     'message': 'I was not able to fetch the conversions :('
                  });
               } else {
                  return moneyResp.json();
               }
            })
            .then((moneyJSON) => {
               if (req.query.c) {
                  res.json(Object.assign({
                     "mid": stockJSON["mid"]
                  }, {
                     [currency]: moneyJSON["rates"][(currency).toUpperCase()]
                  }));
               } else {
                  res.json(Object.assign({
                     "mid": stockJSON["mid"]
                  }, moneyJSON));
               }

            });
      });
});

app.get('/ask/:id', (req, res) => {
   var stockJSON;

   var stockURL = 'https://api.marketdata.app/v1/stocks/quotes/' + req.params.id + '/';
   var moneyURL = 'https://api.frankfurter.app/latest?from=USD';
   let currency = req.query.c
   console.log(req.query)

   fetch(stockURL)
      .then((stockResp) => {
         if (!stockResp.ok) {
            res.status(500);
            res.json({
               'message': 'I was not able to fetch that stock :('
            });
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
                  res.json({
                     'message': 'I was not able to fetch the conversions :('
                  });
               } else {
                  return moneyResp.json();
               }
            })
            .then((moneyJSON) => {
               if (req.query.c) {
                  res.json(Object.assign({
                     "ask": stockJSON["ask"]
                  }, {
                     [currency]: moneyJSON["rates"][(currency).toUpperCase()]
                  }));
               } else {
                  res.json(Object.assign({
                     "ask": stockJSON["ask"]
                  }, moneyJSON));
               }

            });
      });
});


app.get('/getData', (req, res) => {
   try {
      // Read the data from the savedData.json file
      const filePath = 'savedData.json';
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Logic to allow editing the ID
      // For example, you might find and update the ID based on some criteria
      // Here, let's say you want to edit the ID of the first item in the data array
      if (data && data.data && data.data.length > 0) {
         // Assuming you want to edit the ID of the first item
         const newData = {
            ...data
         };
         newData.data[0].stock = 'NewStockID'; // Change 'NewStockID' to the desired new ID
         // You can add more logic here to update the ID based on your requirements
      }

      // Send the updated data back to the client
      res.status(200).json(data);
   } catch (error) {
      // Handle errors
      console.error('Error fetching data for editing:', error);
      res.status(500).json({
         message: 'Failed to fetch data for editing'
      });
   }
});


app.post('/save', async (req, res) => {
   try {
      // Extract stock ID and currency from the request body
      const {
         id,
         currency
      } = req.body;

      // Fetch stock data with the specified currency
      const response = await fetch(`http://localhost:3000/stock/${id}?c=${currency}`);
      const stockData = await response.json();

      // Create a new data object to be saved
      const newData = {
         stock: id,
         currency: currency,
         time: new Date().toLocaleString(),
         last: stockData.last,
         mid: stockData.mid,
         ask: stockData.ask
      };

      // Read existing data from savedData.json
      let existingData = [];
      if (fs.existsSync('savedData.json')) {
         existingData = JSON.parse(fs.readFileSync('savedData.json', 'utf8')).data;
      }

      // Add the new data to the existing data array
      existingData.push(newData);

      // Write the updated data back to savedData.json
      fs.writeFileSync('savedData.json', JSON.stringify({
         data: existingData
      }, null, 2));

      // Send success response to the client
      res.status(200).json({
         message: 'Data saved successfully'
      });
   } catch (error) {
      // Handle errors
      console.error('Error saving data:', error);
      res.status(500).json({
         message: 'Failed to save data'
      });
   }
});


app.put('/updateData/:stock/:currency', async (req, res) => {
   const {
      stock,
      currency
   } = req.params;
   const newData = req.body; // New data received from the frontend

   try {
      // Fetch the new exchange rate based on the updated currency
      const moneyURL = 'https://api.frankfurter.app/latest?from=USD';
      const moneyResp = await fetch(moneyURL);
      const moneyJSON = await moneyResp.json();

      let existingData = [];
      const filePath = 'savedData.json';
      if (fs.existsSync(filePath)) {
         existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8')).data;
      }

      // Find the index of the data entry to be updated
      const dataIndex = existingData.findIndex(item => item.stock === stock && item.currency === currency);

      if (dataIndex !== -1) {
         // Update the existing data point with the new data
         const updatedData = {
            ...existingData[dataIndex],
            ...newData
         };

         // Calculate the new "last" value based on the updated exchange rate
         updatedData.last = updatedData.last * moneyJSON.rates[currency];

         // Update the existing data with the new data
         existingData[dataIndex] = updatedData;

         // Write the updated data back to the JSON file
         fs.writeFileSync(filePath, JSON.stringify({
            data: existingData
         }, null, 2));

         // Send success response to the client
         res.status(200).json({
            message: 'Data updated successfully'
         });
      } else {
         res.status(404).json({
            message: 'Data not found'
         });
      }
   } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({
         message: 'Failed to update data'
      });
   }
});


app.get('/deleteData/:stock/:currency', (req, res) => {
   const {
      stock,
      currency
   } = req.params;

   try {
      const filePath = 'savedData.json';
      let existingData = [];
      if (fs.existsSync(filePath)) {
         existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8')).data;
      }

      // Filter data based on stock and currency
      const filteredData = existingData.filter(item => item.stock === stock && item.currency === currency);

      if (filteredData.length > 0) {
         // Extract times from the filtered data
         const times = filteredData.map(item => item.time);
         res.status(200).json({
            times
         });
      } else {
         res.status(404).json({
            message: 'No data found for the specified stock and currency'
         });
      }
   } catch (error) {
      console.error('Error fetching times for deletion:', error);
      res.status(500).json({
         message: 'Failed to fetch times for deletion'
      });
   }
});

app.delete('/deleteData/:stock/:currency/:time', (req, res) => {
   const {
      stock,
      currency,
      time
   } = req.params;

   try {
      const filePath = 'savedData.json';
      let existingData = [];
      if (fs.existsSync(filePath)) {
         existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8')).data;
      }

      // Parse the time string into a Date object
      const parsedTime = new Date(time);

      // Find the index of the data entry to be deleted
      const dataIndex = existingData.findIndex(item => {
         // Parse the time stored in the data into a Date object
         const storedTime = new Date(item.time);
         // Compare the parsed times for equality
         return item.stock === stock && item.currency === currency && storedTime.getTime() === parsedTime.getTime();
      });

      if (dataIndex !== -1) {
         existingData.splice(dataIndex, 1);

         fs.writeFileSync(filePath, JSON.stringify({
            data: existingData
         }, null, 2));

         res.status(200).json({
            message: 'Data deleted successfully'
         });
      } else {
         res.status(404).json({
            message: 'Data not found'
         });
      }
   } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({
         message: 'Failed to delete data'
      });
   }
});


app.get('/history', (req, res) => {
   try {
      // Read the historical data from the savedData.json file
      const filePath = 'savedData.json';
      const {
         data
      } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Send only the 'data' array back to the client
      res.status(200).json(data);
   } catch (error) {
      console.error('Error fetching historical data:', error);
      res.status(500).json({
         message: 'Failed to fetch historical data'
      });
   }
});

app.listen(3000, () => {
   console.log(`Server is running on port 3000`);
});