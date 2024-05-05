const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json())


//endpoints 
const preditcionRouter = require('./endpoints/predictions');
const signupRouter = require('./endpoints/signup');
const teamsRouter = require('./endpoints/teams');
const matchesRouter = require('./endpoints/matches');
const scoreboardRoute = require('./endpoints/scoreboards')



//cors
app.use(cors({
  origin: function(origin, callback){
    return callback(null, true);
  }
}));


//add Routes
app.use('/prediction', preditcionRouter);
app.use('/signup',signupRouter );
app.use('/selections', teamsRouter);
app.use('/matches', matchesRouter);
app.use('/scoreboards', scoreboardRoute);



app.listen(3000, () => {
  console.info("Server running at port 3000:  http://localhost:3000")
})