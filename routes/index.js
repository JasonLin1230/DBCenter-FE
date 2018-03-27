const Router = require('koa-router')
const router = new Router()

const login = require('./login')
const list = require('./list')
const document = require('./document')

const osAuth = require('../middleware/osAuth')

router.use('/login', login.routes())
router.use('/document', document.routes())
router.use('/', osAuth, list.routes())

module.exports = router