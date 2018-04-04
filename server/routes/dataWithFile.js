const Router = require('koa-router')

const db = require('../mysql')

const router = new Router()

// 插入数据
router.post('/:table', async (ctx) => {
    try {
        const formData = await getFormData(ctx)

        ctx.body = formData
    } catch(err) {
        ctx.body = {
            code: 1,
            message: err.message
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

module.exports = router