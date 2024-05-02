let PostgresServide = require('../services/PostgresService')


let handlerPredictions = {
    byMatchNewPrediction: async (ci, idpartido, id_ganador, id_perdedor, goles_ganador, goles_perdedor) => {
        try{
            let query = "INSER INTO predicciones (ci_usuario, id_partido, id_ganador, id_perdedor, goles_ganador, goles_perdedor) VALUES ($1,$2,$3,$4,$5,$6);";
            let resultado = await PostgresServide.query(query, [ci,idpartido,id_ganador, id_perdedor, goles_ganador,goles_perdedor]);
            if(resultado.rowCount > 0){
                return {status:200, message: "Prediction added sucessfully."};
            }else{
                return {status: 500, error: "No rows where affected."}
            }
        }catch(e){
            return {status: 500, error: e.toString()}
        }
    },
    getpredictionsbyMatchNumber : async () => {

    },
    deletePredictionByMatchNumber : async () => {
        
    }

}
module.exports = handlerPredictions;