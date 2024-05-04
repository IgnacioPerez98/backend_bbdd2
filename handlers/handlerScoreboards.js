const PostgresService = require('../services/PostgresService')
const errors = require('../services/errorsmessages')

/*
PUNTAJES:
    4 coincidencia exacta,
    2 resultado correcto
    0 si erra

    10 por campeon
    05 por subcampeon



*/

let handlerScoreBoards = {
    getPointsByUser : () => {
        try{
            let sql = ``;

        }catch(e){
            console.error("Error getting the scoreboard by user.",e);
            return {status: 500, error: e.toString()}
        }


    },
    getAllUserPoints : () => {

    },
    assignPointsAfterMatch : async (id_partido) => {
        try{
            

        }catch(e){
            console.error("Error al asignar puntos.",e)
            return {status: 500, error: e.toString()}
        }

    }

}
module.exports = handlerScoreBoards;