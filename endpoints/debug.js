const express = require('express')
const {getPool} = require("../services/PostgresService");
const router = express.Router();

router.post('/clearpartidos', async (req,res)=>
{
    await getPool().query(`UPDATE partidos
      SET id_ganador = NULL,
          id_perdedor = NULL,
          goles_ganador = NULL,
          goles_perdedor = NULL,
          penales_ganador = NULL,
          penales_perdedor = NULL;
      `);
    return res.status(200).json({message: "OK"})
})

router.post('/clearadvance', async (req, res)=>{
    await getPool().query(`UPDATE partidos
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

router.post('/restartpointsteams', async (req, res)=> {
    await getPool().query(`UPDATE posiciones
                           SET puntos = 0,
          diferenciagoles = 0
                           where id_equipo < 32;
      `);
    return res.status(200).json({message: "OK"})
} )
router.post('/restartpuntosuser', async (req, res)=> {
    await getPool().query(
        `UPDATE puntos
      SET puntos = 0;
      `);
    return res.status(200).json({message: "OK"})
} )





module.exports = router;