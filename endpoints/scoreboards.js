const express = require('express')
const router = express.Router();


//Retorna los puntos que lleva sumado el usuario
router.get('/accountpoints' , (req, res, next)=> {

})

//recibe la etapa de la copa por body, o param
router.get('/scoreboards', (req,res,next)=>{
    //retorna los puntajes totales de cada usuario
})



module.exports = router;