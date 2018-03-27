const db = require('./index')


module.exports = async function() {
    try {
        // 创建dbcenter数据库
        await db('CREATE DATABASE IF NOT EXISTS dbcenter;')
        console.log('created dbcenter database!')

        // 使用dbcenter数据库
        await db('USE dbcenter')
        console.log('used database dbcenter!')

        // 创建用户表
        const createMainSQL = `
            CREATE TABLE IF NOT EXISTS users (
                phone CHAR(11) NOT NULL UNIQUE,
                password VARCHAR(128) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        `
        await db(createMainSQL)
        console.log('created users table!')
    } catch(err) {
        console.error(err)
    }
}