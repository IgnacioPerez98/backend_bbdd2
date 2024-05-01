const express = require('express')
const router = express.Router();
const handlerUsers = require('../handlers/handlerUsers')
const errors = require('../services/errorsmessages');

//El usuario admin se carga al levantar el script sql.



/**
 * Creates a new user, for the application. (Common user)
 */
router.post('/user', async (req, res) => {

    try{
        let {ci, pass, id_champion, id_subchampion} = req.body;
        if(ci === undefined || pass === undefined || id_champion === undefined || id_subchampion === undefined){
            return res.status(404).json(status(400, "The body is not in  correct format") );
        }

        let result = await handlerUsers.createUser(ci,pass,id_champion,id_subchampion);
        if(result.status == 200){
            //edit to add the token of the user
            return res.status(200).json(errors(200));
        }else{
            return res.status(500).json(errors(result.status, result.message));
        }
    }catch(e){
        return res.status(500).json(errors(500, e.toString()))
    }
})

router.patch('/user', (req, res, next) => {


})

router.get('/user', (req, res, next)=> {

})


module.exports = router;