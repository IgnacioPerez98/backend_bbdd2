let pg = require('pg')
const {Pool} = pg;
let dotenv = require('dotenv');
dotenv.config();


const pool = new Pool({
    host: process.env.dbhost || 'localhost',
    password: process.env.dbpass || 'admin',
    user : process.env.dbuser || 'sa',
    port : process.env.dbport || 5432,
    database: process.env.dbname || 'backend',
    allowExitOnIdle: true
})

let PostgreService = {
    getPool : () => pool,
    query : async (sql, params) => {
        return pool.query(sql,params)
    }
}
module.exports = PostgreService;