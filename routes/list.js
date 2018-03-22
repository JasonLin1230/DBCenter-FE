const Router = require('koa-router')

const db = require('../database')

const router = new Router()

// 页面
router.get('/', async (ctx) => {
    await ctx.render('list')
})

module.exports = router