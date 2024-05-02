const errors = require('../services/errorsmessages')
const hanlderMatches = require('../handlers/handlerMatches');
const matchhourmiddleware = async(req, res, next) => {

    let {id_partido} =req.body;
    if(id_partido == undefined ){
        console.error("Middleware error 400", "You must provide a field id_partido in the body");
        return res.status(400).json(errors(400, "You must provide a field id_partido in the body"))
    }

    let horaPartido = await hanlderMatches.getMatchDate(id_partido);
    let horaActual = Date.UTC(Date.now());
    

}
module.exports = matchhourmiddleware;