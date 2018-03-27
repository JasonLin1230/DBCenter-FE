const db = require('../database')

module.exports = async (ctx, next) => {
    try {
        await db(`USE dbcenter`)
        console.log(`database dbcenter used!`)
    } catch(err) {
        console.log(err.message)
    }

    await next()
}