const express = require('express');
const app = express();
const cors = require('cors');

const http = require('http');
const WebSocket = require('ws');
const notifyService = require('./services/notificationservice')
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




//serve the app 
/*
app.listen(3000, () => {
  console.info("Server running at port 3000:  http://localhost:3000")
})*/
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
notifyService.setWS(wss);
notifyService.wsCreateCon();


server.listen(3000, ()=>{
  console.log("Express y WebSocket en el puerto 3000")
})

