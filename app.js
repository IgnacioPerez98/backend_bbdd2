const express = require('express');
const app = express();

//endpoints
const preditcionRouter = require('./endpoints/predictions')


//cors



//add Routes
app.use('/prediction', preditcionRouter)

app.listen(3000, () => {
  console.log(`Server started on port: 3000`);
});
