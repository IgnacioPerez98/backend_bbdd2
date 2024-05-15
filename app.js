const express = require('express');
const app = express();
const cors = require('cors');

//configure express
app.use(express.json())

//cors
app.use(cors({
  origin: function(origin, callback){
    return callback(null, true);
  }
}));

//endpoints 
const signupRouter = require('./endpoints/signup');
const signinRouter = require('./endpoints/signin')
const preditcionRouter = require('./endpoints/predictions');
const teamsRouter = require('./endpoints/teams');
const matchesRouter = require('./endpoints/matches');
const scoreboardRoute = require('./endpoints/scoreboards')
//add Routes
app.use('/prediction', preditcionRouter);
app.use('/signup',signupRouter );
app.use('/selections', teamsRouter);
app.use('/matches', matchesRouter);
app.use('/scoreboards', scoreboardRoute);
app.use('/signin', signinRouter);

const t = require('./handlers/handlerMatches');
app.use('/', async (req,res)=> {
    let r = await t.registerTournamentAdvance(18);
    return res.status(200).json(r);
})
//serve the app 

app.listen(3000, () => {
  console.info("Server running at port 3000:  http://localhost:3000")
})