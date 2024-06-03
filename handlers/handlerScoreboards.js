const PostgresService = require('../services/PostgresService')

let handlerScoreBoards = {
    getPointsByUser : async (ci_usuario) => {
        try{
            let sql = `SELECT * FROM puntos WHERE ci_usuario = $1;`;
            let resultado = await PostgresService.query(sql, [ci_usuario]);
            if(resultado.rowCount > 0){
                return {status: 200, scoreboards: resultado.rows[0]};
            }else{
                return {status: 200, scoreboards: []}
            }
        }catch(e){
            console.error("Error getting the scoreboard by user.",e);
            return {status: 500, error: e.toString()}
        }
    },
    getAllUserPoints : async () => {
        try{
            let sql = `SELECT * FROM puntos ORDER BY puntos ASC;`;
            let resultado = await PostgresService.query(sql);
            if(resultado.rowCount > 0){
                return {status: 200, scoreboards: resultado.rows};
            }else{
                return {status: 200, scoreboards: []}
            }
        }catch(e){
            console.error("Error getting the scoreboard by user.",e);
            return {status: 500, error: e.toString()}
        }
    },
    assignPointsAfterMatch : async (con, id_partido) => {
        try{
            try{
                let point2 = `WITH predicciones_ganadoras AS (
                    SELECT predicciones.ci_usuario
                    FROM partidos
                    JOIN predicciones ON partidos.id = predicciones.id_partido
                    WHERE partidos.id = $1
                    AND partidos.id_ganador = predicciones.id_ganador
                    AND partidos.id_perdedor = predicciones.id_perdedor
                    AND (
                        NOT partidos.goles_ganador = predicciones.goles_ganador OR
                        NOT partidos.goles_perdedor = predicciones.goles_perdedor
                    )
                )
                UPDATE puntos
                SET puntos = puntos + 2
                FROM predicciones_ganadoras
                WHERE puntos.ci_usuario = predicciones_ganadoras.ci_usuario;`;
                await con.query(point2,[id_partido])

                //put a value where whe have exact match, it apply 2 point more to asign 4 points in total
                let points4 = `WITH predicciones_ganadoras AS (
                    SELECT predicciones.ci_usuario
                    FROM partidos
                    JOIN predicciones ON partidos.id = predicciones.id_partido
                    WHERE partidos.id = $1
                    AND partidos.id_ganador = predicciones.id_ganador
                    AND partidos.id_perdedor = predicciones.id_perdedor
                    AND partidos.goles_ganador = predicciones.goles_ganador 
                    AND partidos.goles_perdedor = predicciones.goles_perdedor
                    
                )
                UPDATE puntos
                SET puntos = puntos + 2
                FROM predicciones_ganadoras
                WHERE puntos.ci_usuario = predicciones_ganadoras.ci_usuario;`;
                //execute the statement that set 2 extras point to users that have aserted the result
                await con.query(points4,[id_partido]);
                if(id_partido == 32){//final match
                   let result = await asignPointChampionAndSubChampion(con);
                   if (result.status !== 200){
                    throw new Error(result.error);
                   }
                }
                return {status: 200 , message : "Success"}
            }catch(transactionError){
                throw transactionError;
            }
        }catch(e){
            console.error("Error al asignar puntos.",e)
            return {status: 500, error: e.toString()}
        }
    }

}

const asignPointChampionAndSubChampion = async (c) => {
    try{
        try{       
             //Assign points tu userts that assert the champion 
            let sql = `WITH predicciones_ganadoras AS (
                SELECT ci
                FROM public.usuario 
                WHERE id_campeon = (SELECT id_ganador FROM partidos WHERE id = 32)            
            )
            UPDATE puntos
            SET puntos = puntos + 10
            FROM predicciones_ganadoras
            WHERE puntos.ci_usuario = predicciones_ganadoras.ci_usuario;`
            await c.query(sql);
            
             //Assign points tu userts that assert the first looser
            let query = `WITH predicciones_ganadoras AS (
                SELECT ci
                FROM public.usuario 
                WHERE id_subcampeon = (SELECT id_perdedor FROM partidos WHERE id = 32)            
            )
            UPDATE puntos
            SET puntos = puntos + 5
            FROM predicciones_ganadoras
            WHERE puntos.ci_usuario = predicciones_ganadoras.ci_usuario;`
            await c.query(query)
        }catch(transactError){
            console.error("Transact error: ", transactError);
            throw transactError;
        }
    }catch(e){
        console.error("Error trying to assign the extra point for champion and subchampion");
        return { status: 500, error: "Error trying to assign the extra point for champion and subchampion"}
    }
}
module.exports = handlerScoreBoards;