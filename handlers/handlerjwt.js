const jwt = require('jsonwebtoken')
const environ = require('dotenv')
environ.config()

const sign = (ci,esadmin, username) => {
    try{
        let token = jwt.sign({ci:ci, esadmin :esadmin, username: username},process.env.jwtsecret,{expiresIn: '2y' , algorithm: 'HS512'})
        if(token !== undefined){
             return {status :200, token: token};
        }else{
         return {status : 500, message: "Server could not sign the token" }
        }

     }catch(e){
         console.error("Error signing user token",e);
         return {status: 500, error: e.toString()}
     }
}
const decodeandverify = (token) => {
    try{
        let claims = jwt.verify(token,process.env.jwtsecret )
        return { status: 200, claims: claims};
    }catch(e){
        console.error("Error signing user token",e);
        return {status: 403, error: e.message}
    }   
}
module.exports = {sign, decodeandverify};