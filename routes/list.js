const Router = require('koa-router')

const db = require('../database')

const router = new Router()

// 页面
router.get('/', async (ctx) => {

    const tableName = ctx.query.tablename
    await ctx.render('list', {
        tableName
    })

    console.log('Enter the list Page!')

})

// 获取数据表
router.post('gettables', async (ctx) => {
    const phone = ctx.session.phone

    try {
        const tablesRes = await db(`SHOW TABLES;`)

        const tables = tablesRes.map((item) => {
            return item[`Tables_in_user_${phone}`]
        })

        ctx.body = {
            code: 0,
            data: tables
        }
    } catch(err) {
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
})


// 新增数据表
router.post('insertTable', async (ctx) => {
    const { tableName, attrs } = ctx.request.body

    let attrSql = '( id INT AUTO_INCREMENT PRIMARY KEY,'

    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i]

        if (attr.default && attr.type === 'string') attr.default = `"${attr.default}"`

        attrSql += `${ attr.name }
                    ${ attr.type === 'string' ? 'VARCHAR' : 'INT' }(${ attr.length })
                    ${ attr.notNull === 'true' ? 'NOT NULL' : '' }
                    ${ attr.unique === 'true' && attr.unique === 'true' ? 'UNIQUE' : '' }
                    ${ attr.default !== '' ? 'DEFAULT ' + attr.default : '' }
                    ${ i === attrs.length - 1 ? ')' : ',' }`
    }

    const sql = `CREATE TABLE ${tableName} ${attrSql} ENGINE=InnoDB DEFAULT CHARSET=utf8;`

    try {
        await db(sql)

        console.log(`created table ${tableName}`)

        ctx.body = {
            code: 0,
            msg: 'success'
        }
    } catch (err) {
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }

    
})


// 删除数据表
router.post('delTable', async (ctx) => {
    const table = ctx.request.body.table

    try {
        await db(`DROP TABLE ${table}`)

        console.log(`drop table ${table} successed`)

        ctx.body = {
            code: 0,
            msg: 'success'
        }
    } catch(err) {
        console.error(err.message)
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
})

// 判断数据表是否存在
router.get('validateTableName', async (ctx) => {
    const { name } = ctx.query
    try {

        const result = await db(`SHOW TABLES LIKE "${name}"`)

        ctx.body = !(result.length)

    } catch(err) {
        console.error(err.message)
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
})

// 获取数据表数据
router.post('getTableInfo', async (ctx) => {
    const { target } = ctx.request.body
    try {

        const tableInfo = await db(`DESC ${target};`)

        const tableResult = []

        for (let item of tableInfo) {
            const itemResult = []
            // 字段名称
            itemResult.push(item.Field)
            
            let [ all, type, length ] = item.Type.match(/^(\w+)\((\d+)\)$/)

            // 字段类型
            if (item.Extra) {
                type = '主键'
            } else if (type === 'varchar') {
                type = '字符串'
            } else {
                type = '数值'
            }

            itemResult.push(type)

            // 字段长度
            itemResult.push(length)

            // 默认值
            itemResult.push(item.Default)

            // 是否必填
            itemResult.push(item.Null === 'NO' ? true : false)

            // 是否唯一
            itemResult.push(item.Key === 'UNI' || item.Key === 'PRI' ? true : false)

            tableResult.push(itemResult)
            
        }

        ctx.body = {
            code: 0,
            data: tableResult
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