const PostgresService = require('../services/PostgresService')

const getPointsByUser = async (ci_usuario) => {
    try{
        let sql = `SELECT P.ci_usuario,U.username,P.puntos FROM puntos P LEFT JOIN usuario U on P.ci_usuario = U.ci WHERE ci_usuario = $1 ORDER BY puntos ASC;`;
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
}


const getAllUserPoints = async () => {
    try{
        let sql = `SELECT P.ci_usuario,U.username,P.puntos FROM puntos P LEFT JOIN usuario U on P.ci_usuario = U.ci ORDER BY puntos ASC;`;
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
}

const assignPointsAfterMatch = async (con, id_partido) => {
    try {
        await con.query('BEGIN');

        const combinedQuery = `
            WITH predicciones_ganadoras AS (
                SELECT 
                    predicciones.ci_usuario,
                    (partidos.goles_ganador = predicciones.goles_ganador) AS exact_ganador,
                    (partidos.goles_perdedor = predicciones.goles_perdedor) AS exact_perdedor
                FROM partidos
                JOIN predicciones ON partidos.id = predicciones.id_partido
                WHERE partidos.id = $1
                AND partidos.id_ganador = predicciones.id_ganador
                AND partidos.id_perdedor = predicciones.id_perdedor
            )
            UPDATE puntos
            SET puntos = puntos + 
                CASE 
                    WHEN exact_ganador AND exact_perdedor THEN 4
                    ELSE 2
                END
            FROM predicciones_ganadoras
            WHERE puntos.ci_usuario = predicciones_ganadoras.ci_usuario;
        `;

        await con.query(combinedQuery, [id_partido]);
        await con.query('COMMIT');
        return { status: 200, message: "Success" };

    } catch (error) {
        await con.query('ROLLBACK');
        console.error("Error assigning points:", error);
        return { status: 500, error: error.toString() };
    }
};


module.exports = {getPointsByUser,getAllUserPoints,assignPointsAfterMatch};