const Router = require('koa-router')

const db = require('../database')

const router = new Router()

router.post('/:table', async (ctx) => {
    const table = ctx.params.table
    ctx.body = table
})

module.exports = router