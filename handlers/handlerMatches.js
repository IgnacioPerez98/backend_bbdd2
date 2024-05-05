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
            console.error("Error loading match data: ",e)
            return {status: 500, error : e.toString()};
        }
    },
    /**
     * Recives an id_partido, and returns the according datetime(timestamp)
     */
    getMatchDate : async (id_partido) => {
        try{
            let query = `SELECT
                        p.id,
                        p.fecha,
                        p.etapa,
                        e1.nombre_seleccion AS equipo1,
                        e2.nombre_seleccion AS equipo2,
                        p.id_ganador,
                        p.id_perdedor,
                        p.goles_ganador,
                        p.goles_perdedor
                    FROM
                        partidos p
                    LEFT JOIN
                        equipos e1 ON p.id_equipo1 = e1.id
                    LEFT JOIN
                        equipos e2 ON p.id_equipo2 = e2.id
                    WHERE p.id = $1;`;
            let result = await PostgresService.query(query, [id_partido])
            if(result.rowCount > 0){
                return {status: 200, match: result.rows[0]};
            }else{
                return {status: 500, error : "The system cant load the result of the match."}
            }

        }catch(e){
            console.error("Error getting match data: ",e);
            return {status: 500, error : e.toString()};

        }
    },
    /**
     * Retrive al the matches of the tournament
     */
    getAllMatches : async () => {
        try{
            let sql = `SELECT
                        p.id,
                        p.fecha,
                        p.etapa,
                        e1.nombre_seleccion AS equipo1,
                        e2.nombre_seleccion AS equipo2,
                        p.id_ganador,
                        p.id_perdedor,
                        p.goles_ganador,
                        p.goles_perdedor
                    FROM
                        partidos p
                    LEFT JOIN
                        equipos e1 ON p.id_equipo1 = e1.id
                    LEFT JOIN
                        equipos e2 ON p.id_equipo2 = e2.id;`
            let result = await PostgresService.query(sql);
            if(result.rowCount > 0){
                return {status: 200, matches: result.rows};
            }else{
                return {status: 500, error : "The system can not load get the matches."}
            }

        }catch(e){
            console.error("Error getting all matches:",e)
            return {status: 500, error : e.toString()};
        }
    },
    getMatchByRange : async (initRange, endRange) => {
        try{
            let sql = `SELECT
                        p.id,
                        p.fecha,
                        p.etapa,
                        e1.nombre_seleccion AS equipo1,
                        e2.nombre_seleccion AS equipo2,
                        p.id_ganador,
                        p.id_perdedor,
                        p.goles_ganador,
                        p.goles_perdedor
                    FROM
                        partidos p
                    LEFT JOIN
                        equipos e1 ON p.id_equipo1 = e1.id
                    LEFT JOIN
                        equipos e2 ON p.id_equipo2 = e2.id
                    WHERE p.id between $1 AND $2
                    ORDER BY p.id ASC;`
            let result = await PostgresService.query(sql, [initRange, endRange]);
            if(result.rowCount > 0){
                return {status: 200, matches: result.rows};
            }else{
                return {status: 500, error : "The system can not load get the matches."}
            }

        }catch(e){
            console.error(e);
            return {status: 500, error : e.toString()};
        }
    },
    advanceTournamentStage: async (id_partido) =>{
        
    }
}
module.exports = hanlderMatches;