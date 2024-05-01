//https://node-postgres.com/  || doc del npm pg
let pg = require('pg')
const { Pool } = pg;
let dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    host: process.env.dbhost || 'localhost',
    password: process.env.dbpass || 'admin',
    user : process.env.dbuser || 'sa',
    port : process.env.dbport || 5432,
    database: process.env.dbname || 'backend'
});

let PostgreService = {
        getPool : () => pool,
        /**
         * Recive el comando sql y los parametros. y devuelve una promise.
         */
        query : async (sql, params) => {
            return pool.query(sql,params);
        }
}
module.exports = PostgreService;
