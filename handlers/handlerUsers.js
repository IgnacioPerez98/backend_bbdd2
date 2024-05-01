
const PostgreService = require('../services/PostgresService');


let hanlderUsers = {

    createUser  : async (ci, pass, champion, subchampion) => {

        const query = "INSERT INTO usuario (ci, contrasena, id_campeon, id_subcampeon, es_admin) VALUES ($1, $2 , $3 ,$4 , $5)";

        let res = await PostgreService.query(query, [ci, pass,champion, subchampion, 0 ]);
        if(res.rowCount > 0){
            return 200;
        }
        return 500;

    }
}

module.exports = hanlderUsers;