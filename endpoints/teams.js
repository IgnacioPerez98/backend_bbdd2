const express = require('express')
const router = express.Router()
const errors = require('../services/errorsmessages')
const authmw = require('../middlewares/authmiddleware')
const {getAllTeams, getTeamById} = require("../handlers/handlerTeams");

router.get('/teams', async (req,res)=>{
    try{
        let result  = await getAllTeams();
        if(result.status === 200){
            return res.status(200).json(result.teams)
        }
        return res.status(result.status).json(result);
    }catch(e){
        return res.status(500).json(errors(500,e.toString()));
    }
})

router.get('/teams/:id',authmw, async (req,res) => {
    try{
        let { id } = req.params;
        if(id === undefined){
            return res.status(400).json(errors(400, "The request must have a valid id number"));
        }
        let result = await getTeamById(id);
        if(result.status === 200){
            return res.status(200).json(result.team);
        }
        return res.status(result.status).json(result);
    }catch(e){
        return res.status(500).json(errors(500,e.toString()));
    }

})
module.exports = router;