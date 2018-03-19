const Router = require('koa-router')
const router = new Router()

const db = require('../database')

router.get('/', async (ctx) => {
    await ctx.render('login')
})

router.post('/register', async (ctx) => {
    ctx.body = ctx.request.body
})

// 手机号验证
router.get('/validatePhone', async (ctx) => {
    const phone = ctx.query.phone
    const result = await db(`SELECT * FROM USERS WHERE phone=${phone}`)
    ctx.body = !result
})

// 手机验证码验证
router.get('/validatePin', async (ctx) => {
    ctx.body = true
})

module.exports = router