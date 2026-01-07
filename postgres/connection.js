const pgConfig = require('./config');
const {Pool} = require('pg');

const pool = new Pool({
    host:pgConfig.host,
    user:pgConfig.user,
    port:pgConfig.port,
    password:pgConfig.password,
    database:pgConfig.db
})

const pgPool = pool;

function pgConnect(){
    pool.connect().then(()=> console.log('connected to Postgres'));
}

module.exports={
    pgPool,
    pgConnect
}