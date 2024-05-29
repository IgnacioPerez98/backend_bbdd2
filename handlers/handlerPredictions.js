const PostgresService = require('../services/PostgresService')

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
            let resultado = await PostgresService.query(query, [ci,idpartido,id_ganador, id_perdedor, goles_ganador,goles_perdedor]);
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
    updateMatchPrediction: async (ci, idpartido, id_ganador, id_perdedor, goles_ganador, goles_perdedor) => {
        try {
            let sql = "UPDATE predicciones SET ";
            let params = [];
            let paramIndex = 1;
    
            if (id_ganador !== undefined) {
                sql += "id_ganador = $" + paramIndex++ + ", ";
                params.push(id_ganador);
            }
            if (id_perdedor !== undefined) {
                sql += "id_perdedores = $" + paramIndex++ + ", ";
                params.push(id_perdedor);
            }
            if (goles_ganador !== undefined) {
                sql += "goles_ganador = $" + paramIndex++ + ", ";
                params.push(goles_ganador);
            }
            if (goles_perdedor !== undefined) {
                sql += "goles_perdedor = $" + paramIndex++ + ", ";
                params.push(goles_perdedor);
            }
            sql = sql.replace(/,\s*$/, '');
    
            sql += " WHERE ci_usuario = $" + paramIndex++ + " AND id_partido = $" + paramIndex++;
            params.push(ci, idpartido);
    
            let resultado = await PostgresService.query(sql, params);
            if (resultado.rowCount > 0) {
                return { status: 200, message: "Prediction updated successfully." };
            } else {
                return {status: 200, predicts: []}
            }
    
        } catch (e) {
            console.error("Error updating a prediction:", e);
            return { status: 500, error: e.toString() };
        }
    },
    /**
     * The field id_partido is nullable, if dont have value, it return all predictions by CI, otherwise it return the specif match prediction.
     */
    getPredictionsbyMatchNumber : async (ci, id_partido = null) => {
        try{
            let query = id_partido==null? "SELECT * FROM predicciones WHERE ci_usuario = $1; "
            :"SELECT * FROM predicciones WHERE ci_usuario = $1 AND id_partido = $2;";
            let params = id_partido == null? [ci]:[ci, id_partido];
            let resultado = await PostgresService.query(query, params);
            if(resultado.rowCount > 0){
                let pred = []
                resultado.rows.forEach(
                    item => {
                        pred.push(item);
                    }
                )
                return {status:200, predicts: pred};
            }else{
                return {status: 200, predicts: []}
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
            let query = "DELETE FROM predicciones WHERE ci_usuario = $1 AND id_partido = $2";
            let resultado = await PostgresService.query(query, [ci,id_partido]);
            if(resultado.rowCount > 0){
                return {status:200, message: "The prediction was successfully deleted."};
            }else{
                return {status: 200, predicts: []}
            }
        }catch(e){
            console.error("Error deleting a predition:",e)
            return {status: 500, error: e.toString()}
        }
        
    },
    getIdsWithoutResult : async (id_partido) => {
        let sql = `SELECT distinct P.id FROM predicciones P JOIN usuario U
        ON P.id = U.ci
        where id_ganador is null AND id_partido = $1
        ORDER BY id ASC 
        `;
        try{
            let resultado = await PostgresService.query(sql, [id_partido]);
            if(resultado.rowCount > 0){
                return {status:200, data: resultado.rows};
            }else{
                return {status: 200, predicts: []}
            }


        }catch(error){
            console.error("Error getting ids of persons that dont entered a result: ",error)
            return {
                status:500,
                error: error
            }
        }
    }

}
module.exports = handlerPredictions;