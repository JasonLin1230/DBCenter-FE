const db = require('../mysql')

module.exports = async (ctx, next) => {
    
    try {
        const { phone, secret } = ctx.headers

        console.log(phone, secret)

        console.log('Auth start')

        await db(`USE user_${phone};`)
        console.log(`use user_${phone} database succesed`)

        const user = await db(`SELECT * FROM user WHERE phone="${phone}" AND secret="${secret}"`)

        console.log('Auth end')

        if (user.length) {
            await next()
        } else {
            ctx.body = {
                code: 3012,
                messsage: 'Authentication failed!'
            }
        }
    } catch(err) {
        console.error(err)

        ctx.body = {
            code: 3012,
            messsage: 'Authentication failed!'
        }
    }

}