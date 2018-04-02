const Router = require('koa-router')
const router = new Router()

const login = require('./login')
const table = require('./table')

const auth = require('../middleware/authorization')

router.use('/login', login.routes())
router.use('/table', auth, table.routes())

module.exports = router