const Router = require('koa-router')

const db = require('../database')

const router = new Router()

// 页面
router.get('/', async (ctx) => {
    const withoutPriv = ctx.session.phone ? undefined : true

    await ctx.render('document', { withoutPriv })
    console.log('Enter the document Page!')
})

module.exports = router