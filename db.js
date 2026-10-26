// npm i mysql2
const mysql = require("mysql2/promise")

const poll = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "escola",
    database: "Kemilydsb"
})

module.exports = Object.freeze({
    poll: poll
})