const {pgPool:pg} = require('../connection')


async function createGym(params){
    const exists = await pg.query(
        `
        INSERT INTO gym (discordserverid, name, createdby)
        VALUES ($1, $2, $3)
        ON CONFLICT (discordserverid) DO NOTHING
        RETURNING name
        `,[params.server, params.name, params.user]
    )
    //check if server already has a gym
    if(exists.rowCount === 0){
        const existingGym = await pg.query(
            'SELECT name, createdby FROM gym WHERE discordserverid = $1',[params.server]
        )
        return{ success: false, reason: 'ALREADY_EXISTS', name:existingGym.rows[0].name,createdBy:existingGym.rows[0].createdby}
    }
    return{ success:true, name:params.name}   

}

module.exports={
    createGym
}