const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

/* This is where the Angular files live after they are built.  */
app.use(express.static(path.join(__dirname, './d3/dist/d3')));

app.listen(port, () => {
  console.log('Listening on *:3000');
});
