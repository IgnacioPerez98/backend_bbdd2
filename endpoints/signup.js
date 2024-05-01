const express = require('express')
const router = express.Router();


const handlerUsers = require('../handlers/handlerUsers')

//El usuario admin se carga al levantar el script sql.

router.post('/user', async (req, res) => {

    let {ci, pass, id_champion, id_subchampion} = req.body;

    let status = await handlerUsers.createUser(ci,pass,id_champion,id_subchampion);
    if(status == 200){
        return res.status(200).json({ message: "ok"});
    }else{
        return res.status(500).json({message: "Error"});
    }
})

router.patch('/user', (req, res, next) => {

})

router.get('/user', (req, res, next)=> {

})


module.exports = router;