const express = require('express')
const router = express.Router();
const handlerPredictions = require('../handlers/handlerPredictions')


//crud preditions

router.post('/prediction', (req, res, next) =>{

})
router.patch('/prediction', (req, res, next) =>{
    //controlar que sea una hora antes del partido

})

router.get('/prediction', (req, res,next)=> {

})


router.delete('/predition', (req,res,next) => {

})




module.exports = router;