require('dotenv').config();

module.exports={
    host: 'localhost',
    user: 'postgres',
    password:process.env.POSTGRES_PASS,
    port:5432,
    db:'DFC'
}