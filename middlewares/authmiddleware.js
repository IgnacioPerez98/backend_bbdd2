let handlerjwt = require('../handlers/handlerjwt');
const errorMessagges = require('../services/errorsmessages');

const authmiddleware = (req, res, next) => {
    try{

    }catch(e){
        console.error("Error in auth middleware, check the console",e);
        return res.status(404).json(errorMessagges(400, "The body is not in  correct format") );
    }


}


module.exports = authmiddleware;