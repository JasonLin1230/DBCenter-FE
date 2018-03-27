const db = require('../database')

module.exports = async function(ctx, next) {
    const phone = ctx.session.phone

    if (phone) {
        await db(`USE user_${phone}`)
        console.log(`database user_${phone} used!`)

        await next()
    } else {
        ctx.response.redirect('/login')
    }
    
} 