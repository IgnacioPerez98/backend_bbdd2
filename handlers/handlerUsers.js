
const PostgreService = require('../services/PostgresService');
const errorMessagges = require('../services/errorsmessages');


let hanlderUsers = {

    createUser  : async (ci, pass, champion, subchampion) => {
        try{
            const query = "INSERT INTO usuario (ci, contrasena, id_campeon, id_subcampeon, es_admin) VALUES ($1, $2 , $3 ,$4 , $5)";
    
            let res = await PostgreService.query(query, [ci, pass,champion, subchampion, 0 ]);
            if(res.rowCount > 0){
                return {status: 200};
            }
            return {status:500, message: "No rows where affected"};
        }catch(error){
            return {status:500, message: error};

        }
    },
    
}

module.exports = hanlderUsers;