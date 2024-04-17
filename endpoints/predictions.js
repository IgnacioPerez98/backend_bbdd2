const express = require('express');
const router = express.Router();
const handlerPredictions = require('../handlers/handlerPredictions');

//crud preditions

router.post('/', async (req, res, next) => {
  return res.sendStatus(200);
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
