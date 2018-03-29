const Router = require('koa-router')
const axios = require('axios')
const NodeCache = require( "node-cache" )

const db = require('../mysql')

const router = new Router()

const myCache = new NodeCache( { stdTTL: 60 } )

const { msgApi } = require('../config.json')

// 用户登陆
router.post('/', async (ctx) => {
    const { phone, valicode } = ctx.request.body

    console.log(myCache.get(`phonePin_${phone}`))

    if (myCache.get(`phonePin_${phone}`) != valicode) {
        ctx.body = {
            code: 1,
            msg: '验证码错误！'
        }

        return
    }

    ctx.body = {
        code: 0,
        msg: 'success'
    }
})

// 发送手机验证码
router.post('/sendValiCode', async (ctx) => {
    const phone = ctx.request.body.phone
    // 验证码
    const param = Math.floor(Math.random() * 9000 + 1000)

    // 缓存
    myCache.set(`phonePin_${phone}`, param)

    // 短信模版
    const skin = 9015

    const Authorization = msgApi.auth

    try {
        const res = await axios.get(msgApi.url, {
            params: { param, phone, skin },
            headers: { Authorization }
        })

        const { Code, Message } = res.data

        if (Code === 'OK') {
            ctx.body = { code: 0, msg: Message }
        } else {
            ctx.body = { code: 1, msg: Message }
        }

    } catch(err) {
        ctx.body = { code: 2, msg: err.message }
        console.error(`注册短信验证码,Message: ${err.message}`)
    }
})

// 退出登录
// router.get('/layout', async (ctx) => {
//     ctx.session = {}
//     ctx.response.redirect('/login')
// })


module.exports = router