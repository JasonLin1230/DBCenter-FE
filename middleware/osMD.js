const db = require('../database')

module.exports = async function(ctx, next) {
    const phone = ctx.session.phone

    if (phone) {

        try {
            await db(`USE user_${phone}`)
            console.log(`database user_${phone} used!`)

            await next()
        } catch(err) {
            ctx.body = {
                code: 2,
                msg: err.message
            }
        }
        
    } else {
        ctx.body = {
            code: 3,
            msg: 'session失效!'
        }
    }
}