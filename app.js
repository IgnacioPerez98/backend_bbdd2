const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const dotenv = require('dotenv')

dotenv.config();

//configure express
app.use(express.json())

//cors
app.use(cors({
  origin: function(origin, callback){
    return callback(null, true);
  }
}));
//handler
const handlerNotification = require("./services/notificationservice");
//endpoints 
const signupRouter = require('./endpoints/signup');
const signinRouter = require('./endpoints/signin')
const preditcionRouter = require('./endpoints/predictions');
const teamsRouter = require('./endpoints/teams');
const matchesRouter = require('./endpoints/matches');
const scoreboardRoute = require('./endpoints/scoreboards');
const notifyRoute = require('./endpoints/notification');

//add Routes
app.use('/prediction', preditcionRouter);
app.use('/signup',signupRouter );
app.use('/selections', teamsRouter);
app.use('/matches', matchesRouter);
app.use('/scoreboards', scoreboardRoute);
app.use('/signin', signinRouter);
app.use('/notify', notifyRoute);


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
handlerNotification.setWS(wss);
handlerNotification.wsCreateCon().then(
    ok => console.log("Created WS")
).catch(e => {
    console.error(`Error wn ws : ${e}`)
});

handlerNotification.scheduleMatchNotification().then(
    ok => console.log("Notification service running"),
).catch( e => console.error(`Error wn ws : ${e}`) );


//debug endpoints
if (process.env.environment === 'DEBUG'){
    const debugRoute = require('./endpoints/debug')
    app.use('/debug',debugRoute)
}

server.listen(3000, ()=>{
  console.log("Express y WebSocket en el puerto 3000")
})

