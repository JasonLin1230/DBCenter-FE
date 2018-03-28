const Router = require('koa-router')

const db = require('../database')

const router = new Router()

// 插入数据
router.post('/:table', async (ctx) => {
    const table = ctx.params.table

    const attrData = JSON.parse(ctx.request.body.attrData)

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

        console.log('inserting success')

        ctx.body = {
            code: 0,
            data: result.insertId
        }
    } catch(err) {
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
    
})

// 删除数据
router.delete('/:table', async (ctx) => {
    const table = ctx.params.table

    const id = ctx.request.body.id
    
    const sql = `DELETE FROM ${table}
                    WHERE id=${id}`

    try {
        console.log('data is deleting!')
        console.log('sql:', sql)

        const result = await db(sql)

        console.log('deleting success')

        ctx.body = {
            code: 0,
            data: 'success'
        }
    } catch(err) {
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
})

// 更新数据
router.put('/:table', async (ctx) => {
    const table = ctx.params.table

    const { id, newAttrData } = ctx.request.body

    const resAttrData = Object.entries(JSON.parse(newAttrData)).map((attr) => {
        return `${attr[0]}="${attr[1]}"`
    }).join(',')

    const sql = `
        UPDATE ${table}
            SET ${resAttrData}
            WHERE id=${id};
    `

    try {
        console.log('data is updating!')
        console.log('sql:', sql)

        const result = await db(sql)

        console.log('updating success')

        ctx.body = {
            code: 0,
            data: 'success'
        }
    } catch(err) {
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
})

// 查询数据
router.get('/:table', async (ctx) => {
    const table = ctx.params.table

    const condition = ctx.request.query.condition

    let resCondition = ''

    if (condition) {
        resCondition = 'WHERE ' + Object.entries(JSON.parse(condition)).map((item) => {
            return `${item[0]}="${item[1]}"`
        }).join(' AND ')
    }

    const sql = `SELECT * from ${table} 
                    ${resCondition};`

    try {
        console.log('data is selecting!')
        console.log('sql:', sql)

        const result = await db(sql)

        console.log('selecting success')

        ctx.body = {
            code: 0,
            data: result
        }
    } catch(err) {
        ctx.body = {
            code: 2,
            msg: err.message
        }
    }
})

module.exports = router