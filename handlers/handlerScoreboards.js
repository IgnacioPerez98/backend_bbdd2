const PostgresService = require('../services/PostgresService')

let handlerScoreBoards = {
    getPointsByUser : async (ci_usuario) => {
        try{
            let sql = `SELECT * FROM puntos WHERE ci_usuario = $1;`;
            let resultado = await PostgresService.query(sql, [ci_usuario]);
            if(resultado.rowCount > 0){
                return {status: 200, scoreboards: resultado.rows[0]};
            }
            return {status:400, message: "No rows where affected"};
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
            }
            return {status:400, message: "The query dont have data asosiated"};
        }catch(e){
            console.error("Error getting the scoreboard by user.",e);
            return {status: 500, error: e.toString()}
        }
    },
    assignPointsAfterMatch : async (id_partido) => {
        try{
            let c = await PostgresService.getPool().connect()
            try{
                await c.query('BEGIN');
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
                await c.query(point2,[id_partido])

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
                await c.query(points4,[id_partido]);
                await c.query('COMMIT');
                if(id_partido == 32){//final match
                    asignPointChampionAndSubChampion();
                }

            }catch(transactionError){
                await c.query('ROLLBACK')
                throw transactionError;
            }finally{
                c.release();
            }
        }catch(e){
            console.error("Error al asignar puntos.",e)
            return {status: 500, error: e.toString()}
        }
    }

}

const asignPointChampionAndSubChampion = async () => {
    try{
        let c = await PostgresService.getPool().connect()
        try{       
            await c.query('BEGIN')
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

            await c.query('COMMIT')
        }catch(transactError){
            console.error("Transact error: ", transactError);
            c.query("ROLLBACK")
            throw transactError;
        }finally{
            c.release();
        }
    }catch(e){
        console.error("Error trying to assign the extra point for champion and subchampion");
        throw new Error("Error trying to assign the extra point for champion and subchampion");
    }
}
module.exports = handlerScoreBoards;