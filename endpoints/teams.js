const express = require('express')
const router = express.Router()
const errors = require('../services/errorsmessages')
const handlerTeams = require('../handlers/handlerTeams')

/**
 * Obtains all the selections that integrate the tournament.
 */
router.get('/teams', async (req,res)=>{
    try{
        let result  = await handlerTeams.getAll();
        if(result.status == 200){
            return res.status(200).json(result.teams)
        }
        return res.status(result.status).JSON(result);
    }catch(e){
        return res.status(500).json(errors(500,e.toString()));
    }
})

/**
 * Obtain one selection providing the valid id.
 */
router.get('teams/:id', async (req,res) => {
    try{
        let { id } = req.params;
        if(id === undefined){
            return res.status(400).json(errors(400, "The request must have a valid id number"));
        }
        let result = await handlerTeams.getById(id);
        if(result.status == 200){
            return res.status(200).json(result.team);
        }
        return res.status(result.status).json(result);
    }catch(e){
        return res.status(500).json(errors(500,e.toString()));
    }

})
module.exports = router;