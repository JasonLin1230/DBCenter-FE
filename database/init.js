const db = require('./index')


module.exports = async function() {
    try {
        // 创建dataCenter数据库
        await db('CREATE DATABASE IF NOT EXISTS dataCenter;')
        console.log('dataCenter database created!')

        // 使用dataCenter数据库
        await db('USE dataCenter')
        console.log('database dataCenter used!')

        // 创建用户表
        const createMainSQL = `
            CREATE TABLE IF NOT EXISTS users (
                phone CHAR(11) NOT NULL UNIQUE,
                password VARCHAR(128) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        `
        await db(createMainSQL)
        console.log('users table created!')
    } catch(err) {
        console.error(err)
    }
}