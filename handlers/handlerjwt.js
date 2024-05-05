const jwt = require('jsonwebtoken')
const environ = require('dotenv')
environ.config()

let handlerJWT = {
    sign : async (ci,esadmin) => {
        try{
            
            jwt.sign({ci:ci, esadmin :esadmin},process.env.jwtsecret,{algorithm: 'RS512'})

        }catch(e){
            console.error("Error signing user token",e);
            return {status: 500, error: e.toString()}
        }
    },
    decodeandverify : async (token) => {
        try{
            let result = jwt.verify(token,process.env.jwtsecret )
            let decoded = jwt.decode(token, {complete: true});
        }catch(e){
            console.error("Error signing user token",e);
            return {status: 500, error: e.toString()}
        }
        
    }

}


module.exports = handlerJWT;