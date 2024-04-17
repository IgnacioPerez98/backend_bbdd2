const express = require('express')
const router = express.Router();

//el contro, de acceso es mixto, obtener resultados es publico, pero cargarlo solo puede el admin

router.post('/results', (req, res, next)=>{
    //el admin carga los resultados
})

router.get ('/results', (req, res, next)=> {
    //refiere a los resultados de los partidos, jugados y un pendiente en los que se estan por jugar, respoinde al fixture
})


//Retorna los puntos que lleva sumado el usuario
router.get('/accountpoints' , (req, res, next)=> {

})

//recibe la etapa de la copa por body, o param
router.get('/scoreboards', (req,res,next)=>{
    //retorna los puntajes totales de cada usuario
})



module.exports = router;