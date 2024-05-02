const express = require('express');
const router = express.Router();
const handlerPredictions = require('../handlers/handlerPredictions');
const errors = require('../services/errorsmessages');

//crud preditions

router.post('/', async (req, res, next) => {
  try{
    let {id, ci, id_partido, id_ganador, id_perdedor, goles_ganador, goles_perdedor} = req.body;
    if (
      id == undefined ||
      ci ==undefined ||
      id_partido ==undefined ||
      id_ganador ==undefined ||
      id_perdedor ==undefined ||
      goles_ganador ==undefined ||
      goles_perdedor ==undefined
    ){
      return res.status(400).json(errors(400, "One of the params was not valid, check the body of the request."))
    }

    let resultado = await handlerPredictions.byMatchNewPrediction(ci,id,id_ganador,id_perdedor,goles_ganador,goles_perdedor);
    if(resultado.status == 200){
        return  res.status(resultado.status).json(errors(resultado.status,resultado.message));
    }else{
      return res.status(resultado.status).json(errors(resultado.status,resultado.error));
    }
  }catch(e){
    console.error("Predition PostError: ",e);
    return res.status(500).json(errors(500, e.toString()))
  }
});
router.patch('/', (req, res, next) => {
  //controlar que sea una hora antes del partido
});

router.get('/', async (req, res) => {
  console.log('eeaaa');
  return res.json({ tu: 'ki' });
});

router.delete('/', (req, res, next) => {});

module.exports = router;
