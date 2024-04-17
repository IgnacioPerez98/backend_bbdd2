const express = require('express');
const preditcionRouter = require('./endpoints/predictions')

const app = express();

app.use('/prediction', preditcionRouter)

app.listen(3000, () => {
  console.log(`Server started on port: 3000`);
});
