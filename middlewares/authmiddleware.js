let handlerjwt = require('../handlers/handlerjwt');
const errorMessagges = require('../services/errorsmessages');

const authmiddleware = (req, res, next) => {
    try{
        //extract the tokenconst 
        head = req.headers['authorization'];
        if(!head){
            return  res.status(401).json({message : "Auth header is not present"});
        }
        let token = head.split(" ").at(1);
        //extract the claims
        let tokendata = handlerjwt.decodeandverify(token);
        if(tokendata.status ==200){
            let {claims} = tokendata;
            req.claims = claims
            // res.send(req.claims)//envio los claims del token an next middleware
            next()
        }else{
            return res.status(tokendata.status).json({error: tokendata.error})
        }
        //check the claims

    }catch(e){
        console.error("Error in auth middleware, check the console",e);
        return res.status(404).json(errorMessagges(400, "The body is not in  correct format") );
    }


}


module.exports = authmiddleware;