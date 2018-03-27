const Router = require('koa-router')

const db = require('../database')

const router = new Router()

// 插入数据
router.post('/:table', async (ctx) => {
    const table = ctx.params.table

    const attrData = ctx.request.body

    const keys = Object.keys(attrData)

    const values = Object.values(attrData).map((key) => {
        return `"${key}"`
    })

    const sql = `INSERT INTO ${table} (${keys.join(',')})
                    VALUES
                        (${values.join(',')});`

    try {
        console.log('data is inserting!')
        console.log('sql:', sql)
        const result = await db(sql)

        ctx.body = result
    } catch(err) {
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
    
})

router.delete('/:table', async (ctx) => {
    const table = ctx.params.table
    ctx.body = `${table}删除`
})

router.put('/:table', async (ctx) => {
    const table = ctx.params.table
    ctx.body = `${table}修改`
})

router.get('/:table', async (ctx) => {
    const table = ctx.params.table
    ctx.body = `${table}查询`
})

module.exports = router