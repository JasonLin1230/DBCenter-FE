const db = require('../database')

module.exports = async (ctx, next) => {
    try {
        await db(`USE datacenter`)
        console.log(`database datacenter used!`)
    } catch(err) {
        console.log(err.message)
    }

    await next()
}