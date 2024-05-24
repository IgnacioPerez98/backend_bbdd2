const express = require('express');
const router = express.Router();
const handlerJWT = require('../handlers/handlerjwt');
const handlerUser= require('../handlers/handlerUsers');
const errors = require('../services/errorsmessages')



const notify = require('../services/notificationservice');
router.post('/signin', async(req,res) => {
    try{
        let {ci, hashedpass} = req.body;
        if( ci === undefined ||
            hashedpass === undefined
        ){
            return res.status(400).json(errors(400, "The params ci, and hassed password "))
        }
        //validar user y pass;
        let shearchUser= await handlerUser.signin(ci);
        if(shearchUser.status ==200){
            //aca existe el usuario 
            let {ci, es_admin, contrasena} = shearchUser.data;

            if(contrasena !== hashedpass){
                return res.status(400).json(errors(400,"The provided password is not correct."))
            }
            let token = handlerJWT.sign(ci, es_admin);
            if(token.status == 200){
                /**
                 * DEBUG
                 */
                notify.Notify("EL usuario se unio al lio");

                return res.status(200).json({token: token.token});
            }else{
                return res.status(500).json(errors(500, "The user and password are corrects, but the server cant sign the token."))
            }
        }else{
            return res.status(404).json(errors(404, "The user can not be found, probably the data is wrong or the user is not registred"))
        }
    }catch(error){
        console.error("Error Signing token",error)
        return res.status(500).json({message: "Internal server error" + `${error.message}`})
    }

})

/**
 * Util to change the password only due the ci, username, champion ,subchambion and admin role are not allowed to be changed.
 */
router.patch('/changepass', async (req, res) => {
    try{
        let {ci, pass,} = req.body;
        if(ci === undefined || pass === undefined ){
            return res.status(404).json(errors(400, "The body is not in  correct format") );
        }
        let result = await handlerUser.modifyPassword(ci,pass);
        if(result.status == 200){
            //edit to add the token of the user
            return res.status(200).json(errors(200));
        }else{
            return res.status(500).json(errors(result.status, result.message));
        }
    }catch(e){
        console.error("Update Account Error: ",e)
        return res.status(500).json(errors(500, e.toString()))
    }
})
module.exports = router;