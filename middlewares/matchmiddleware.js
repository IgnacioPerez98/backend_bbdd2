const errors = require('../services/errorsmessages')
const {getMatchDate} = require('../handlers/handlerMatches');


//https://esqsoft.com/javascript_examples/date-to-epoch
const matchhourmiddleware = async(req, res, next) => {

    let {id_partido} =req.body;
    if(id_partido === undefined ){
        console.error("Middleware error 400", "You must provide a field id_partido in the body");
        return res.status(400).json(errors(400, "You must provide a field id_partido in the body"))
    }
    let partido = await getMatchDate(id_partido);
    if(partido.status !== 200){
        console.error("Middleware error 400", partido.error);
        return res.status(400).json(errors(400, `We cant find match with id ${id_partido}`))
    }
    let {match} = partido
    if(match === undefined){
        return res.status(400).json(errors(400, `We cant find match with id ${id_partido}`))
    }
    let horaActual = new Date(Date.now()).getTime();
    let horaPartido = new Date(Date.parse(match.fecha)).getTime();
    //let timeN = new Date(2024,5,22,18,10,0,0).getTime() //para test
    let difHora = dif_hours(horaPartido,horaActual);
    if(difHora > 1){
        next();
    }else{
        console .info("The request reception is closed due the match starts in less than an hour.")
        return res.status(408).json(errors(408, "The request reception is closed due the match starts in less than an hour."))
    }
}
const dif_hours= (date1, date2) => {
    const diffMilliseconds = Math.abs(date1 - date2);
    const diffHours = diffMilliseconds / (1000 * 60 * 60);
    return diffHours;
}

module.exports = matchhourmiddleware;