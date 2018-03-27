const Router = require('koa-router')
const router = new Router()

const login = require('./login')
const list = require('./list')
const api = require('./api')

const apiAuth = require('../middleware/apiAuth')
const loginMD = require('../middleware/loginMD')
const osMD = require('../middleware/osMD')

router.use('/api', apiAuth, api.routes())
router.use('/login', loginMD, login.routes())
router.use('/', osMD, list.routes())

module.exports = router