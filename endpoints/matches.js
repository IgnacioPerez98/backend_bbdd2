const express = require('express')
const router = express.Router();

//el contro, de acceso es mixto, obtener resultados es publico, pero cargarlo solo puede el admin

router.post('/results', (req, res, next)=>{
    //el admin carga los resultados
    try{

    }catch(e){
        console.error(e);
        return res.status(500).json(errors(500, e.toString()))
    }
})

router.get ('/results', (req, res, next)=> {
    //refiere a los resultados de los partidos, jugados y un pendiente en los que se estan por jugar, respoinde al fixture
    try{

    }catch(e){
        console.error(e);
        return res.status(500).json(errors(500, e.toString()))
    }
})


module.exports = router;