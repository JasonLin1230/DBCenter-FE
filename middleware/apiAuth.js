const db = require('../database')

module.exports = async function(ctx, next) {
    const { phone, secret } = ctx.headers

    try {
        await db(`USE dbcenter`)
        console.log(`database dbcenter used!`)

        const result = await db(`SELECT * FROM USERS WHERE phone="${phone}" AND password="${secret}";`)

        if (result.length === 1) {
            console.log(`User ${phone} Authentication Passed!`)

            await db(`USE user_${phone}`)
            console.log(`database user_${phone} used!`)

            await next()
        } else {
            ctx.body = {
                code: 1,
                msg: '身份验证错误，请核实头域中的手机号与密码!!'
            }
        }
    } catch(err) {
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
}