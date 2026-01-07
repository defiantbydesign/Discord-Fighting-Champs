const {pgPool:pg} = require('./connection')
const {createGym} = require('./functions/createGym')
pg.connect();
async function pgCreate(type, params) {
  if (type === 'gym') {
    const results = await createGym(params);
    return results
  }
}


module.exports = { pgCreate }