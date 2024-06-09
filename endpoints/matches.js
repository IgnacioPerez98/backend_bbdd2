const express = require('express')
const router = express.Router();
const errors = require('../services/errorsmessages')
const auth = require('../middlewares/authmiddleware')
const {loadDataFinishedMatch, getMatchDate, getMatchByRange, getAllMatches} = require("../handlers/handlerMatches");


//el contro, de acceso es mixto, obtener resultados es publico, pero cargarlo solo puede el admin

router.post('/results',auth, async (req, res, next)=>{
    //el admin carga los resultados
    try{
        /*
        let { is_admin} = req.claims;
        if ( is_admin === false){

            return res.status(403).json(errors(403, "Only admins can upload results"))
        }*/
 
        let { id_partido, id_ganador, id_perdedor, goles_ganador, goles_perdedor,penales_ganador, penales_perdedor} = req.body;
        if (
        id_partido ==undefined ||
        id_ganador ==undefined ||
        id_perdedor ==undefined ||
        goles_ganador ==undefined ||
        goles_perdedor ==undefined
        ){
        return res.status(400).json(errors(400, "One of the params was not valid, check the body of the request."))
        }

        let resultado =await loadDataFinishedMatch(id_partido,id_ganador,id_perdedor,goles_ganador, goles_perdedor,penales_ganador,penales_perdedor);
        if(resultado.status === 200){
            return  res.status(resultado.status).json(errors(resultado.status,resultado.message));
        }else{
          return res.status(resultado.status).json(errors(resultado.status,resultado.error));
        }
    }catch(e){
        console.error(e);
        return res.status(500).json(errors(500, e.toString()))
    }
})

router.get ('/results/:id_partido', async (req, res, next)=> {
    try{
        let {id_partido} = req.params
        if(id_partido === undefined){
            return res.status(400).json(errors(400, "Missing id_partido param, check the params of the request."))
        }
        let resultado = await getMatchDate(id_partido);
        if(resultado.status === 200){
            return  res.status(resultado.status).json(resultado.match);
        }else{
          return res.status(resultado.status).json(errors(resultado.status,resultado.error));
        }

    }catch(e){
        console.error(e);
        return res.status(500).json(errors(500, e.toString()))
    }
})



router.get('/results', auth, async (req, res, next) => {
    try{
        let {from, to} = req.body;
        if (
            from === undefined ||
            to === undefined
        )
        {
            let resultado = await getAllMatches();
            if(resultado.status === 200){
                return  res.status(resultado.status).json(resultado.matches);
            }else{
                return res.status(resultado.status).json(errors(resultado.status,resultado.error));
            }
        }
        let resultado =await getMatchByRange(from, to);
        if(resultado.status === 200){
            return  res.status(resultado.status).json(resultado.matches);
        }else{
            return res.status(resultado.status).json(errors(resultado.status,resultado.error));
        }
    }catch(e){
        console.error("Error getting matches by range: ",e)
        return res.status(500).json(errors(500, e.toString()))
    }
})


module.exports = router;