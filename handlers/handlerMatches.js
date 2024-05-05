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
    registerTournamentAdvance: async (id_partido) => {
        switch(id_partido){
            case 18://Fin Group A
                break;
            case 20://Fin Group B
                break;
            case 22://Fin Group C
                break;
            case 24://Fin Group D
                break;
            case 25: //Quarter 1 
                break;
            case 26: //Quarter 2 
                break;
            case 27: //Quarter 3 
                break;
            case 28: //Quarter 4 
                break;
            case 29 ://Semis 1
                break;
            case 30 ://Semis 2
                break;

        }
        try{
            

        }catch(error){
            console.error("Error updating tournament fase: ",error);
            return { status : 500 , error:error.message };
        }

    }
}
module.exports = hanlderMatches;

//private method to asign the winner of each group
/**
 * Si seteo el id_equipo1 en null , inserta solo el equipo 2 , si idequipo1 tiene valor, solo inserta este.
 * @param {*} id_partido 
 * @param {*} id_equipo1 
 * @param {*} id_equipo2 
 * @returns 
 */
const setFinalMatchTeams = async (con ,id_partido,id_equipo1, id_equipo2) =>{
    try{
        let sql = id_equipo1 === null?
        `INSERT INTO partidos (id_equipo2) VALUES ($2) WHERE id = $3;`:
        `INSERT INTO partidos (id_equipo1) VALUES ($1) WHERE id = $3;`;
        let param = [];
        if(id_equipo1 === null){
            param. push(id_equipo2)
        }else{
            param. push(id_equipo1)
        }
        param.push(id_partido);
        let resultado = await con.query(sql, param)
        if(resultado.rowCount > 0 ){
            return {status: 200, message: "Correct"}
        }else{
            return {status:400, error: "No rows where affected."}
        }

    }catch(errors){
        console.error("Error updating match data ", errors)
        return {status: 500, error: errors.message}
    }
    
}


const getWinnersofTeams = (con , etapa) => {
    try{

        let sql = `WITH TeamPoints AS (
            SELECT 
                id_equipo,
                SUM(CASE 
                        WHEN id_ganador = id_equipo THEN 3 -- If the team won, assign 3 points
                        WHEN id_ganador IS NULL THEN 1 -- If it's a draw, assign 1 point
                        ELSE 0 -- If the team lost, assign 0 points
                    END) AS puntos,
                SUM(CASE 
                        WHEN id_ganador = id_equipo THEN goles_ganador - goles_perdedor -- If the team won, calculate goal difference
                        WHEN id_ganador IS NULL THEN 0 -- If it's a draw, goal difference is 0
                        ELSE goles_perdedor - goles_ganador -- If the team lost, calculate goal difference (negative)
                    END) AS diferencia_goles
            FROM 
                partidos
            WHERE 
                id <= 16 -- Considering only the qualifying matches
            GROUP BY 
                id_equipo
        )
        SELECT 
            id_equipo,
            puntos,
            diferencia_goles
        FROM 
            TeamPoints
        ORDER BY 
            puntos DESC, 
            diferencia_goles DESC
        LIMIT 2;
        `;
        

    }catch(e){
        console.error("Error getting the winner",e)
    }
}


let Etapa = {
    GrupoA : "Grupo A",
    GrupoB : "Grupo B",
    GrupoC : "Grupo C",
    GrupoD : "Grupo D",
    

}