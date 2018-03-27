const Router = require('koa-router')
const fs = require('fs')
const path = require('path')

const db = require('../database')

const router = new Router()

// 页面
router.get('/', async (ctx) => {
    await ctx.render('document', { withoutPriv })
    console.log('Enter the document Page!')
})

module.exports = router