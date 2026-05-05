const express = require('express');
const setupSwagger = require('./swagger')

const { logErrors, errorHandler } = require('./middlewares/errorHandler')

const app = express();
const port = 3000;

app.use(express.json());

routerApi(app);
setupSwagger(app);
app.use(logErrors)
app.use(errorHandler)


app.listen(port, () => {
  console.log('Server running on port ' + port);
})