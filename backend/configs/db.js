const mysql2 = require("mysql2")

require("dotenv").config()

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

module.exports = pool
