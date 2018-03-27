const db = require('../database')

module.exports = async function(ctx, next) {
    const { phone, secret } = ctx.headers

    try {
        const result = await db(`SELECT * FROM USERS WHERE phone="${phone}" AND password="${secret}";`)

        if (result.length === 1) {
            

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