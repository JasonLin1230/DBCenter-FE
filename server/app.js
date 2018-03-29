const Koa = require('koa')
const logger = require('koa-logger')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session-minimal')
const cors = require('koa2-cors')

const route = require('./routes')
const config = require('./config')

const app = new Koa()

app
    .use(cors())
    .use(bodyParser()) // 解析请求体参数
    .use(session())
    .use(logger()) // 日志
    .use(route.routes()) // 路由

// 默认端口80
const port = config.port || 80
app.listen(port, () => {
    console.log(`>>> Server is starting at port ${port}`)
})