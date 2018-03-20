const Router = require('koa-router')
const router = new Router()

const db = require('../database')

router.get('/', async (ctx) => {
    await ctx.render('login')
})

router.post('/', async (ctx) => {
    const { phone, password } = ctx.request.body
    try {
        const result = await db(`SELECT * FROM USERS WHERE phone="${phone}" AND password="${password}";`)

        if (result.length) {
            ctx.body = {
                code: 0,
                msg: 'success'
            }
        } else {
            ctx.body = {
                code: 1,
                msg: '用户名或密码错误！'
            }
        }
    } catch (err) {
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
})

router.post('/register', async (ctx) => {
    const { phone, password } = ctx.request.body
    try {
        const sql = `
            INSERT INTO users (phone, password)
                            VALUES
                            ("${phone}", "${password}");
        `
        await db(sql)
        console.log(`user ${phone} inserted`)

        await db(`CREATE DATABASE IF NOT EXISTS user_${phone};`)
        console.log(`${phone} database created!`)

        ctx.body = {
            code: 0,
            msg: 'success'
        }
    } catch(err) {
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
})

// 手机号验证
router.get('/validatePhone', async (ctx) => {
    const { phone, isRegister} = ctx.query
    const result = await db(`SELECT * FROM USERS WHERE phone=${phone};`)
    if (isRegister === 'true') {
        ctx.body = !(result.length)
    } else {
        ctx.body = !!(result.length)
    }
})

// 手机验证码验证
router.get('/validatePin', async (ctx) => {
    ctx.body = true
})

module.exports = router