const Koa = require('koa')
const logger = require('koa-logger')
const render = require('koa-ejs')
const path = require('path')
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')

const route = require('./routes')
const config = require('./config')

require('./database/init')()

const app = new Koa()

// ejs配置
render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    cache: false
})

app
    .use(static(__dirname)) // 静态资源文件加载
    .use(bodyParser()) //
    .use(logger()) // 日志
    .use(route.routes()) // 路由

// 默认端口80
const port = config.port || 80
app.listen(port, () => {
    console.log(`>>> Server is starting at port ${port}`)
})