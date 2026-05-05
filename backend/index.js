const express = require('express');
const setupSwagger = require('./swagger')

const app = express();
const port = 3000;

setupSwagger(app);

app.listen(port, () => {
  console.log('Server running on port ' + port);
})