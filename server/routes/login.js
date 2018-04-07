const Router = require('koa-router')
const axios = require('axios')
const NodeCache = require( "node-cache" )
const md5 = require('crypto-js/md5')


const db = require('../mysql')

const router = new Router()

const myCache = new NodeCache( { stdTTL: 60 } )

const { msgApi } = require('../config.json')

// 用户登陆
router.post('/', async (ctx) => {
    const { phone, valicode } = ctx.request.body

    // if (myCache.get(`phonePin_${phone}`) != valicode) {
         
    //     ctx.body = {
    //         code: 1,
    //         messsage: '验证码错误！'
    //     }

    //     return
    // }

    try {

        await db(`CREATE DATABASE IF NOT EXISTS user_${phone}`)
        console.log(`create user_${phone} database successed`)

        await db(`USE user_${phone}`)
        console.log(`use user_${phone} database succesed`)

        const createUserTableSql = `
            CREATE TABLE IF NOT EXISTS user (
                phone CHAR(11) NOT NULL UNIQUE,
                secret CHAR(32) NOT NULL
            )ENGINE=InnoDB DEFAULT CHARSET=utf8;
        `
        await db(createUserTableSql)
        console.log(`create user table succesed`)

        const userData = await db(`SELECT * FROM user`)
        
        let secret = ''
        
        if (userData.length) {

            secret = userData[0].secret

        } else {

            const msg = `${phone}|${new Date().getTime()}`

            secret = md5(msg).toString()

            const inserUserSql = `
                INSERT INTO user (phone, secret)
                    VALUES
                        ("${phone}", "${secret}")
            `
            await db(inserUserSql)
            console.log(`inser userData successed`)
        }

        ctx.body = {
            code: 0,
            data: { phone, secret }
        }

    } catch(err) {
        throw Error(err.message)
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
            ctx.body = { code: 0, messsage: Message }
        } else {
            ctx.body = { code: 1, messsage: Message }
        }

    } catch(err) {
        throw Error(err.message)
    }
})


module.exports = router