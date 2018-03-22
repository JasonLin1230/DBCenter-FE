const Router = require('koa-router')
const router = new Router()

const login = require('./login')
const list = require('./list')
const document = require('./document')

router.use('/login', login.routes())
router.use('/', list.routes())
router.use('/document', document.routes())

module.exports = router