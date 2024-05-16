const PostgresService = require("../services/PostgresService");

let hanlderMatches = {
  loadDataFinishedMatch: async (
    num_partido,
    id_ganador,
    id_perdedor,
    goles_ganador,
    goles_perdedor,
    penales_ganador = null,
    penales_perdedor = null
  ) => {
    try {
      let con = await PostgresService.getPool().connect();
      try {
        await con.query("BEGIN");
        //Insert the result of the match
        let paramsq1 = [
          id_ganador,
          id_perdedor,
          goles_ganador,
          goles_perdedor,
          num_partido,
        ];
        let counter = 5;
        let query =
          "UPDATE partidos SET id_ganador = $1, id_perdedor = $2, goles_ganador = $3, goles_perdedor = $4 ";
        if (penales_ganador !== null) {
          query += `, penales_ganador = $${counter}`;
          counter++;
          paramsq1.push(penales_ganador);
        }
        if (penales_perdedor !== null) {
          query += `, penales_perdedor = $${counter}`;
          paramsq1.push(penales_perdedor);
          counter++;
        }
        query += ` WHERE id = $5;`;
        let result = await con.query(query, paramsq1);
        if (result.rowCount <= 0) {
          throw new Error(
            "The system cant load the result of the match. No rows where affected."
          );
        }

        //insert the update on the table posiciones
        let is_draw = goles_ganador === goles_perdedor;
        let sql = "";
        let params = [];
        if (is_draw) {
          sql = `UPDATE posiciones SET puntos = puntos+ 1 WHERE (id_equipo = $1 OR id_equipo= $2);`;
          params.push(id_ganador);
          params.push(id_perdedor);
          let result = await con.query(sql, [id_ganador, id_perdedor]);
          if (result.rowCount <= 0) {
            throw new Error(
              "The system cant change the points. No rows where affected."
            );
          }
        } else {
          sql = `UPDATE posiciones SET puntos = puntos +3 WHERE id_equipo = $1;`;
          params.push(id_ganador);
          let result = await con.query(sql, params);
          if (result.rowCount <= 0) {
            throw new Error(
              "The system cant change the points. No rows where affected."
            );
          }
        }
        await con.query("COMMIT");
      } catch (transactError) {
        console.error("Error loading match results: ", transactError);
        await con.query("ROLLBACK");
      }
    } catch (e) {
      console.error("Error loading match data: ", e);
      return { status: 500, error: e.message };
    }
  },
  /**
   * Recives an id_partido, and returns the according datetime(timestamp)
   */
  getMatchDate: async (id_partido) => {
    try {
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
      let result = await PostgresService.query(query, [id_partido]);
      if (result.rowCount > 0) {
        return { status: 200, match: result.rows[0] };
      } else {
        return {
          status: 500,
          error: "The system cant load the result of the match.",
        };
      }
    } catch (e) {
      console.error("Error getting match data: ", e);
      return { status: 500, error: e.toString() };
    }
  },
  /**
   * Retrive al the matches of the tournament
   */
  getAllMatches: async () => {
    try {
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
                        equipos e2 ON p.id_equipo2 = e2.id;`;
      let result = await PostgresService.query(sql);
      if (result.rowCount > 0) {
        return { status: 200, matches: result.rows };
      } else {
        return {
          status: 500,
          error: "The system can not load get the matches.",
        };
      }
    } catch (e) {
      console.error("Error getting all matches:", e);
      return { status: 500, error: e.toString() };
    }
  },
  getMatchByRange: async (initRange, endRange) => {
    try {
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
                    ORDER BY p.id ASC;`;
      let result = await PostgresService.query(sql, [initRange, endRange]);
      if (result.rowCount > 0) {
        return { status: 200, matches: result.rows };
      } else {
        return {
          status: 500,
          error: "The system can not load get the matches.",
        };
      }
    } catch (e) {
      console.error(e);
      return { status: 500, error: e.toString() };
    }
  },
  registerTournamentAdvance: async (id_partido) => {
    try {
        let c = await PostgresService.getPool().connect();
        try{
          await c.query('BEGIN');
          //fase de grupos
          if(id_partido < 25){
            let winner = await getWinnerByStage(c,id_partido);
            //controlar error
            let {result} = winner;
            let team1 = result[0].id_equipo;
            let team2 = result[1].id_equipo;
    
            switch(id_partido){
              case 18://equipo A
                //insertar el 1 en match 25L y el 2 en match 26 v
                let p1 = await setTeamsFinalStage(c, team1,null,25);
                let p2 = await setTeamsFinalStage(c, null, team2,26);
                if (p1.status !== 200 || p2.status !== 200){
                  throw new Error("Fallo la actualizacion de partidos");
                }
                break;
              case 20://Equipo B
                //Insertar el 1 en m 26 l y el 2 en match 25v
                let p3 = await setTeamsFinalStage(c, team1,null,26);
                let p4 = await setTeamsFinalStage(c, null, team2,25);
                if (p3.status !== 200 || p4.status !== 200){
                  throw new Error("Fallo la actualizacion de partidos");
                }
                break;
              case 22: //Equipo C
                //insertar el 1 en m27 l, y el 2 en match 28 v
                let p5 = await setTeamsFinalStage(c, team1,null,27);
                let p6 = await setTeamsFinalStage(c, null, team2,28);
                if (p5.status !== 200 || p6.status !== 200){
                  throw new Error("Fallo la actualizacion de partidos");
                }
                break;
              case 24: //Equipo D
                //insertar el 1 en m28l uy el 2 en match 27 v
                let p7 = await setTeamsFinalStage(c, team1,null,28);
                let p8 = await setTeamsFinalStage(c, null, team2,27);
                if (p7.status !== 200 || p8.status !== 200){
                  throw new Error("Fallo la actualizacion de partidos");
                }
                break;
            }
          }else{
            let winner = await getWinnerByStage(c,id_partido);
            let id = winner.id_ganador;
            let perd = winner.id_perdedor;
            switch(id_partido){
              case 25:
                let pt1 = await setTeamsFinalStage(c, id,null,29)
                if(pt1.status !== 200){
                  throw new Error("Fallo la actualizacion de partidos");
                }
                break;
              case 26:
                let pt2 = await setTeamsFinalStage(c, null,id,29)
                if(pt2.status !== 200){
                  throw new Error("Fallo la actualizacion de partidos");
                }
                break;
              case 27:
                let pt3 = await setTeamsFinalStage(c, id,null,30)
                if(pt3.status !== 200){
                  throw new Error("Fallo la actualizacion de partidos");
                }
                break;
              case 28:
                let pt4 = await setTeamsFinalStage(c, null,id,30)
                if(pt4.status !== 200){
                  throw new Error("Fallo la actualizacion de partidos");
                }
                break;
              case 29:
                let gp1 = await setTeamsFinalStage(c,id,null,32);
                if(gp1.status !== 200){
                  throw new Error("Fallo la actualización de partidos")
                }
                let pp1 = await setTeamsFinalStage(c,perd,null,31);
                if(pp1.status !== 200){
                  throw new Error("Fallo la actualización de partidos")
                }
                break;
              case 30:
                let gp2 = await setTeamsFinalStage(c,null,id,32);
                if(gp2.status !== 200){
                  throw new Error("Fallo la actualización de partidos")
                }
                let pp2 = await setTeamsFinalStage(c,null,perd,31);
                if(pp2.status !== 200){
                  throw new Error("Fallo la actualización de partidos")
                }
                break;
                                                        
            }

          }
          await c.query('COMMIT');
        }catch(transactError){
          await c.query('ROLLBACK');
          console.error("Error updating tournament data", transactError);
          throw transactError;
        }
        return result;
    } catch (error) {
      console.error("Error updating tournament fase: ", error);
      return { status: 500, error: error.message };
    }
  },
};
module.exports = hanlderMatches;


const setTeamsFinalStage = async (con, id_equipo1, id_equipo2, id_partido) => {
  try {
    let sql = `UPDATE partidos SET `;
    let params = [];
    let counter = 1;
    if (id_equipo1 !== null){
      sql += `id_equipo1 = $${counter} `;
      params.push(id_equipo1);
      counter ++;
    }
    if (id_equipo2 !== null){
      sql += counter==2? ``:`, `;
      sql += `id_equipo2 = $${counter}`;
      params.push(id_equipo2);
      counter++;
    }
    sql += ` WHERE id_partido = $${counter};`; 
    params.push(id_partido);
    let resultado = await con.query(sql, params);
    if (resultado.rowCount > 0) {
      return { status: 200, message: "Correct" };
    } else {
      return { status: 400, error: "No rows where affected." };
    }
  } catch (error) {
    console.error(
      `Error setting the teams of the final stage at match with id ${id_partido}: `,
      error
    );
    return {
      status: 500,
      error: `Error setting the teams of the final stage at match with id ${id_partido}: `,
    };
  }
};

const getWinnerByStage = async (con, id_partido) => {
  try {
    let sql =
      id_partido < 25
        ? `SELECT *
            FROM posiciones
            where id_equipo BETWEEN $1 AND $2
            order by puntos DESC, diferenciagoles DESC
            LIMIT 2`
        : `SELECT id_ganador, id_perdedor FROM partidos WHERE id = $1`;
    let params = [];
    switch (id_partido) {
      case 18:
        //Grupo A
        params = [1, 4];
        break;
      case 20:
        //Grupo B
        params = [5, 8];
        break;
      case 22:
        //Grupo C
        params = [9, 12];
        break;
      case 24:
        params = [13, 16];
        break;
      case 25:
        params = [id_partido];
        break;
      case 26:
        params = [id_partido];
        break;
      case 27:
        params = [id_partido];
        break;
      case 28:
        params = [id_partido];
        break;
      case 29:
        params = [id_partido];
        break;
      case 30:
        params = [id_partido];
        break;
      case 31:
        params = [id_partido];
        break;
      default:
        return {
          status: 300,
          message:
            "Correct, dont apply update a change, redirect to next stage ",
        };
    }
    let resultado = await con.query(sql, params);
    if (resultado.rowCount > 0) {
      return { status: 200, result: resultado.rows }; 
    } else {
      return { status: 400, error: "No rows where affected." };
    }
  } catch (error) {
    console.error("Error geting winner : ", error);
    return {
      status: 500,
      error: `Error getting the winner triggered by the match with id ${id_partido}`,
    };
  }
};
