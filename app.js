const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const notifyService = require('./services/notificationservice')
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


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
notifyService.setWS(wss);
notifyService.wsCreateCon();

notifyService.scheduleMatchNotification();


//debug endpoints
if (process.env.environment === 'DEBUG'){
  const ps = require('./services/PostgresService')
  app.post('/debug/clearpartidos', async (req,res)=>
  {
      await ps.getPool().query(`UPDATE partidos
      SET id_ganador = NULL,
          id_perdedor = NULL,
          goles_ganador = NULL,
          goles_perdedor = NULL,
          penales_ganador = NULL,
          penales_perdedor = NULL;
      `);
      return res.status(200).json({message: "OK"})
  })

  app.post('/debug/clearadvance', async (req, res)=>{
     await ps.getPool().query(`UPDATE partidos
      SET id_equipo1 = NULL,
          id_equipo2 = NULL,
          id_ganador = NULL,
          id_perdedor = NULL,
          goles_ganador = NULL,
          goles_perdedor = NULL,
          penales_ganador = NULL,
          penales_perdedor = NULL
          where id > 24;
      `);
      return res.status(200).json({message: "OK"})
  })

  app.post('/debug/restartpointsteams', async (req, res)=> {
    await ps.getPool().query(`UPDATE posiciones
      SET puntos = 0,
          diferenciagoles = 0
          where id_equipo < 32;
      `);
      return res.status(200).json({message: "OK"})
  } )
}

server.listen(3000, ()=>{
  console.log("Express y WebSocket en el puerto 3000")
})

