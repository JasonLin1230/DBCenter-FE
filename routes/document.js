const Router = require('koa-router')
const fs = require('fs')
const path = require('path')

const db = require('../database')

const router = new Router()

// 页面
router.get('/', async (ctx) => {
    const withoutPriv = ctx.session.phone ? undefined : true

    const docMDPath = path.join(__dirname, '../README.md')
    const docMD = fs.readFileSync(docMDPath, 'utf8')

    await ctx.render('document', { withoutPriv, docMD })
    console.log('Enter the document Page!')
})

module.exports = router