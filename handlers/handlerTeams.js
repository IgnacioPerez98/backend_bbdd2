const PostgresServide = require('../services/PostgresService')

const getAllTeams = async () => {
    try{
        let teams = [];
        let query = "SELECT * FROM equipos;";
        let res = await PostgresServide.query(query);
        res.rows.forEach(element => {
            teams.push(element);
        });
        return { status: 200, teams : teams}

    }catch(e){
        return {status : 500, error : e.toString()}
    }
}

const getTeamById = async (id) => {
    try{
        let query = "SELECT * FROM equipos WHERE id = $1"
        let team = await PostgresServide.query(query, [id])
        if(team.rowCount > 0){
            return {status: 200, team : team.rows[0]}
        }
        return {status: 404, error: `Selection with id ${id} was not found`};
    }catch(e){
        return {status : 500, error : e.toString()}
    }
}

module.exports = {getAllTeams, getTeamById }