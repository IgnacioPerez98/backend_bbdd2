const express = require('express');
const router = express.Router();
const handlerPredictions = require('../handlers/handlerPredictions');
const errors = require('../services/errorsmessages');

//crud preditions

router.post('/predict', async (req, res, next) => {
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


/**
 * Patch an already created prediction.
 */
router.patch('/predict', async (req, res) => {
  //controlar que sea una hora antes del partido(middleware)
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
    let resultado = await handlerPredictions.updateMatchPrediction(ci,id_partido,id_ganador,id_perdedor, goles_ganador,goles_perdedor);
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


router.get('/predict', async (req, res) => {
  try{
    let {ci, id_partido} = req.body;
    if(
      ci == undefined ||
      id_partido == undefined
    ){
      return res.status(400).json(errors(400, "One of the params was not valid, check the body of the request."))
    }
    let resultado = await handlerPredictions.getPredictionsbyMatchNumber(ci,id_partido);
    if(resultado.status ==200){
      return  res.status(resultado.status).json(resultado.predicts);
    }else{
      return res.status(resultado.status).json(errors(resultado.status,resultado.error));
    }
  }catch(e){
    console.error("Error getting the predictions: ",e)
    return res.status(500).json(errors(500, e.toString()))
  }

});

router.delete('/predict', async (req, res, next) => {
  try{
    let {ci, id_partido} = req.body;
    if(
      ci == undefined ||
      id_partido == undefined
    ){
      return res.status(400).json(errors(400, "One of the params was not valid, check the body of the request."))
    }
    let resultado = await handlerPredictions.deletePredictionByMatchNumber(ci, id_partido);
    if(resultado.status ==200){
      return  res.status(resultado.status).json(resultado.predicts);
    }else{
      return res.status(resultado.status).json(errors(resultado.status,resultado.error));
    }

  }catch(e){
    console.error("Error deleting prediction: ",e)
    return res.status(500).json(errors(500, e.toString()))
  }

});

module.exports = router;
