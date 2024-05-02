let PostgresServide = require('../services/PostgresService')


let handlerPredictions = {
    /**
     * Creates a new prediction of a match
     * @param {*} ci 
     * @param {*} idpartido 
     * @param {*} id_ganador 
     * @param {*} id_perdedor 
     * @param {*} goles_ganador 
     * @param {*} goles_perdedor 
     * @returns 
     */
    byMatchNewPrediction: async (ci, idpartido, id_ganador, id_perdedor, goles_ganador, goles_perdedor) => {
        try{
            let query = "INSERT INTO predicciones (ci_usuario, id_partido, id_ganador, id_perdedor, goles_ganador, goles_perdedor) VALUES ($1,$2,$3,$4,$5,$6);";
            let resultado = await PostgresServide.query(query, [ci,idpartido,id_ganador, id_perdedor, goles_ganador,goles_perdedor]);
            if(resultado.rowCount > 0){
                return {status:200, message: "Prediction added sucessfully."};
            }else{
                return {status: 500, error: "No rows where affected."}
            }
        }catch(e){
            console.error("Error adding a new predition:",e)
            return {status: 500, error: e.toString()}
        }
    },
    /**
     * Updates the prediction of a determinated match
     */
    updateMatchPrediction : async (ci, idpartido, id_ganador, id_perdedor, goles_ganador, goles_perdedor) => {
        try {
            let sql = "UPDATE predicciones SET id_ganador = $1, id_perdedores = $2, goles_ganador = $3, goles_perdedor = $4 WHERE ci_usuario = $5 AND id_partido = $6";
            let resultado = await PostgresServide.query(sql, [id_ganador,id_perdedor,goles_ganador,goles_perdedor, ci, idpartido]);
            if(resultado.rowCount > 0){
                return {status:200, message: "Prediction updated sucessfully."};
            }else{
                return {status: 500, error: "No rows where affected."}
            }

        }catch(e){
            console.error("Error getting a predition:",e)
            return {status: 500, error: e.toString()}
        }

    },
    /**
     * The field id_partido is nullable, if dont have value, it return all predictions by CI, otherwise it return the specif match prediction.
     */
    getPredictionsbyMatchNumber : async (ci, id_partido = null) => {
        try{
            let query = id_partido? "SELECT * FROM predicciones WHERE ci = $1  "
            :"SELECT * FROM predicciones WHERE ci = $1 AND id_partido = $2";
            let params = id_partido? [ci]:[ci, id_partido];
            let resultado = await PostgresServide.query(query, params);
            if(resultado.rowCount > 0){
                let pred = []
                resultado.rows.forEach(
                    item => {
                        pred.push(item);
                    }
                )
                return {status:200, predicts: pred};
            }else{
                return {status: 500, error: "No rows where affected."}
            }
        }catch(e){
            console.error("Error getting a predition:",e)
            return {status: 500, error: e.toString()}
        }
    },
    /**
     * Deletes a Predition of a user with id, and number of match.
     * @param {*} ci The number of document of the user. 
     * @param {*} id_partido The ordinal number of match of the tournament.
     * @returns 
     */
    deletePredictionByMatchNumber : async (ci, id_partido) => {
        try{
            let query = "DELETE FROM predicciones WHERE ci = $1 AND id_partido = $2";
            let resultado = await PostgresServide.query(query, [ci,id_partido]);
            if(resultado.rowCount > 0){
                return {status:200, message: "The prediction was successfully deleted."};
            }else{
                return {status: 500, error: "No rows where affected."}
            }
        }catch(e){
            console.error("Error deleting a predition:",e)
            return {status: 500, error: e.toString()}
        }
        
    }

}
module.exports = handlerPredictions;