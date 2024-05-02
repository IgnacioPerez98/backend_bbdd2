const PostgresService = require('../services/PostgresService')


let hanlderMatches = {
    loadDataFinishedMatch : async (num_partido,id_ganador, id_perdedor, goles_ganador, goles_perdedor) => {
        try{        
            let query = "UPDATE partidos SET id_ganador = $1, id_perdedor = $2, goles_ganador = $3, goles_perdedor = $4 WHERE id = $5;"
            let result = await PostgresService.query(query, [id_ganador,id_perdedor,goles_ganador,goles_perdedor,num_partido]);
            if(result.rowCount > 0){
                return {status: 200, message: `The result of the match ${num_partido},was load correctly.`  };
            }else{
                return {status: 500, error : "The system cant load the result of the match."}
            }

        }catch(e){
            return {status: 500, error : e.toString()}
        }
    }
}
module.exports = hanlderMatches;