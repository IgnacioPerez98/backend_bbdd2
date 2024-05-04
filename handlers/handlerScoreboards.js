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
            return {status:400, message: "No rows where affected"};
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
                let point2 = `UPDATE puntos
                SET puntos = puntos + 2
                FROM partidos
                INNER JOIN predicciones ON partidos.id = predicciones.id_partido
                WHERE partidos.id = $1
                AND partidos.id_ganador = predicciones.id_ganador
                AND partidos.id_perdedor = predicciones.id_perdedor
                AND NOT partidos.goles_ganador = predicciones.goles_ganador
                AND NOT partidos.goles_perdedor = predicciones.goles_perdedor;
                `;
                await c.query(point2,[id_partido])

                //put a value where whe have exact match
                let points4 = `UPDATE puntos
                SET puntos = puntos + 2
                INNER JOIN predicciones ON partidos.id = predicciones.id_partido
                WHERE partidos.id = $1
                AND partidos.id_ganador = predicciones.id_ganador
                AND partidos.id_perdedor = predicciones.id_perdedor
                AND partidos.goles_ganador = predicciones.goles_ganador
                AND partidos.goles_perdedor = predicciones.goles_perdedor;
                `;
                //execute the statement that set 2 extras point to users that have aserted the result
                await c.query(points4,[id_partido]);
                await c.query('COMMIT');
            }catch(transactionError){
                await c.query('ROLLBACK')
                throw transactionError;
            }
            
        }catch(e){
            console.error("Error al asignar puntos.",e)
            return {status: 500, error: e.toString()}
        }

    }

}
module.exports = handlerScoreBoards;