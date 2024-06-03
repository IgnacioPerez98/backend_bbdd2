
const PostgreService = require('../services/PostgresService');


let hanlderUsers = {
    createUser  : async (ci,username, pass, champion, subchampion) => {
        let con = null;
        try{
            con = await PostgreService.getPool().connect()
            await con.query('BEGIN')
            const query = "INSERT INTO usuario ( ci, username, contrasena, id_campeon, id_subcampeon,es_admin) VALUES ($1, $2 , $3 ,$4 , $5, 0);";
    
            let res = await con.query(query, [ci,username, pass,champion, subchampion]);
            if(res.rowCount <= 0){
                return {status:400, message: "No rows where affected adding the user"};
                
            }
            //inserto el user en la tabla de puntos
            query = `INSERT INTO puntos (ci_usuario, puntos) VALUES ( $1, 0)`;
            let trans_res = await con.query(query, [ci]);
            if(res.rowCount <= 0){
                return {status:400, message: "No rows where affected, inserting ci in puntos table"};
            }
            return {status: 200};
        }catch(error){
            if(error.code = '23505'){
                return { status: 400, message: "The user is already registered."}
            }
            console.error("Error creating user: ",error)
            await con.query('ROLLBACK')
            return {status:500, message: error.message};

        }
    },
    modifyPassword : async (ci, password) => {
        try{
            let sql = `UPDATE usuario SET contrasena = $1 WHERE ci = $2;`;
            let res = await PostgreService.query(sql, [password,ci])
            if(res.rowCount > 0){
                return {status: 200, message: "Password updated correctly"};
            }
            return {status:400, message: "No rows where affected,probably user does not exists"};
        }catch(error){
            console.error("Error signing in :",error)
            return {status:500, message: error.message};
        }
    },
    signin: async (ci) => {
        try{

            let sql = `SELECT * FROM usuario WHERE ci = $1`;
            let res = await PostgreService.query(sql, [ci]);
            if(res.rowCount > 0){
                return {status: 200, data: res.rows[0]};
            }
            return {status:400, message: "No rows where affected,probably user does not exists"};
        }catch(error){
            console.error("Error signing in :",error)
            return {status:500, message: error.message};
        }

    }

}

module.exports = hanlderUsers;