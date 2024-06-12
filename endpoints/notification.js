const express = require('express');
const { Notify } = require('../services/notificationservice');
const router = express.Router()




router.post('/notificar', async (req, res)=>{
    try{
        let {ci, message} = req.body;
        if( message === undefined){
            return res.status(400).json({error: "The request must have a  message.Ci parameter is optional."})
        }
        Notify(message,ci);
    }catch(error){
        console.error("",error)
        return res.status(500).json({message:"Error trying to send notification throught web socket"})
    }

})











module.exports = router;