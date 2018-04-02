const Router = require('koa-router')


const db = require('../mysql')

const router = new Router()

// 获取数据表
router.get('/', async (ctx) => {
    const tableName = ctx.query.tableName

    let condition = tableName ? ` LIKE "${tableName}"` : ''

    let sql = `SHOW TABLES ${condition};`

    const result = await db(sql)

    const tables = result.map((item) => {
        return Object.values(item)[0]
    })

    const tablesWithoutUser = tables.filter((item) => {
        return item !== 'user'
    })

    ctx.body = {
        code: 0,
        data: tablesWithoutUser
    }

})

// 添加数据表
router.post('/', async (ctx) => {
    const { tableName, attrs } = ctx.request.body

    let attrSql = '( id INT AUTO_INCREMENT PRIMARY KEY,'

    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i]

        let name = `\`${attr.name}\``

        let type = getAttrType(attr.type)

        let notNull = attr.notNull === 'true' ? 'NOT NULL' : ''

        let unique = attr.unique === 'true' && attr.unique === 'true' ? 'UNIQUE' : ''

        let attrDefault = (attr.default && attr.type === 'string') ? `"${attr.default}"` : attr.default

        let symbol = i === attrs.length - 1 ? ')' : ','

        attrSql += `${name} ${type} ${notNull} ${unique} ${attrDefault} ${symbol}`

    }

    const sql = `CREATE TABLE ${tableName} ${attrSql} ENGINE=InnoDB DEFAULT CHARSET=utf8;`

    await db(sql)

    ctx.body = {
        code: 0,
        message: 'success!'
    }
})

function getAttrType(type) {
    switch (type) {
        case 'string':
            return 'VARCHAR(255)'
        
        case 'number':
            return 'FLOAT(32, 5)'
        
        case 'file':
            return  'TINYTEXT(255)'
    }
}

// 删除数据表
router.delete('/:tableName', async (ctx) => {
    const tableName = ctx.params.tableName

    if (!tableName) {
        ctx.body = {
            code: 1,
            message: 'tableName is not defined'
        }
    }

    const result = await db(`DROP TABLE ${tableName};`)

    ctx.body = {
        code: 0,
        message: 'success!'
    }

})


module.exports = router