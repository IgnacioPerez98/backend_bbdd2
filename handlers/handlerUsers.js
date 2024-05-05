
const PostgreService = require('../services/PostgresService');


let hanlderUsers = {

    createUser  : async (ci,username, pass, champion, subchampion) => {
        try{
            const query = "INSERT INTO usuario ( ci, username, contrasena, id_campeon, id_subcampeon) VALUES ($1, $2 , $3 ,$4 , $5);";
    
            let res = await PostgreService.query(query, [ci,username, pass,champion, subchampion]);
            if(res.rowCount > 0){
                return {status: 200};
            }
            return {status:400, message: "No rows where affected"};
        }catch(error){
            console.error("Error creating user: ",error)
            return {status:500, message: error};

        }
    },
    modifyPassword : async () => {

    },
    signin: async () => {
        
    }

}

module.exports = hanlderUsers;