const Router = require('koa-router')
const axios = require('axios')
const NodeCache = require( "node-cache" )

const db = require('../database')

const router = new Router()

const myCache = new NodeCache( { stdTTL: 60 } )

const { msgApi } = require('../config.json')

// 页面
router.get('/', async (ctx) => {
    await ctx.render('login')
    console.log('Enter the login Page!')
})

// 用户登陆
router.post('/', async (ctx) => {
    const { phone, password } = ctx.request.body
    try {
        const result = await db(`SELECT * FROM USERS WHERE phone="${phone}" AND password="${password}";`)

        if (result.length) {
            ctx.session = { phone }
            
            ctx.body = {
                code: 0,
                msg: 'success'
            }
        } else {
            ctx.body = {
                code: 1,
                msg: '用户名或密码错误！'
            }
        }
    } catch (err) {
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
})

// 退出登录
router.get('/layout', async (ctx) => {
    ctx.session = {}
    ctx.response.redirect('/login')
})

// 注册
router.post('/register', async (ctx) => {
    const { phone, password } = ctx.request.body
    try {
        const sql = `
            INSERT INTO users (phone, password)
                            VALUES
                            ("${phone}", "${password}");
        `
        await db(sql)
        console.log(`user ${phone} inserted`)

        await db(`CREATE DATABASE IF NOT EXISTS user_${phone};`)
        console.log(`user_${phone} database created!`)

        ctx.body = {
            code: 0,
            msg: 'success'
        }
    } catch(err) {
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
})

// 手机号验证
router.get('/validatePhone', async (ctx) => {
    const { phone, isRegister} = ctx.query
    const result = await db(`SELECT * FROM USERS WHERE phone=${phone};`)
    if (isRegister === 'true') {
        ctx.body = !(result.length)
    } else {
        ctx.body = !!(result.length)
    }
})

// 发送手机验证码
router.post('/sendphonePin', async (ctx) => {
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

// 手机验证码验证
router.post('/validatePin', async (ctx) => {
    const { phone, pin } = ctx.request.body

    const pinValue = myCache.get(`phonePin_${phone}`)

    ctx.body = pinValue == pin
})

// 发送用户密码
router.post('/sendPwd', async (ctx) => {
    const { phone } = ctx.request.body

    try {
        const data = await db(`SELECT password FROM users WHERE phone="${phone}"`)

        const param = data[0].password
        
        // 短信模版
        const skin = 9016

        const Authorization = msgApi.auth

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
        console.error(err.message)
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
})

module.exports = router