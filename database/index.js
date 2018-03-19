const mysql = require('mysql')
const config = require('../config')

const pool = mysql.createPool(config.database)

// 数据库操作
// @param sql
// @returns { Promise }
module.exports = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) throw '数据库连接异常!'

            connection.query(sql, (error) => {
                connection.release()
                if (error) {
                    reject(error)
                } else {
                    resolve()
                }
            })
        })
    })
}
