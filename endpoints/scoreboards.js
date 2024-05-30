const express = require('express')
const router = express.Router();
const handlerScoreboard = require('../handlers/handlerScoreboards');
const errorMessagges = require('../services/errorsmessages');
const authmw = require('../middlewares/authmiddleware')

//Retourns the point that each user have
router.get('/accountpoints' ,authmw, async (req, res, next)=> {
    try{
        let {ci} = req.claims;
        if(ci === undefined){
            return res.status(400).json(errorMessagges(400, "Missing value of ci_usuario"))
        }
        let resultado = await handlerScoreboard.getPointsByUser(ci);
        if(resultado.status == 200 ){
            return res.status(200).json(resultado.scoreboards);
        }else{
            return res.status(resultado.status).json(errorMessagges(resultado.status, resultado.message));
        }

    }catch(e){
        console.error("Error getting the account points. ",e)
        return res.status(500).json(errors(500, e.toString()))
    }
})

//recibe la etapa de la copa por body, o param
router.get('/allpoints',authmw, async (req,res)=>{
    //retorna los puntajes totales de cada usuario
    try{
        let resultado = await handlerScoreboard.getAllUserPoints();
        if(resultado.status == 200 ){
            return res.status(200).json(resultado.scoreboards);
        }else{
            return res.status(resultado.status).json(errorMessagges(resultado.status, resultado.message));
        }
    }catch(e){
        console.error("Error getting the account points. ",e)
        return res.status(500).json(errors(500, e.toString()))
    }
})
module.exports = router;