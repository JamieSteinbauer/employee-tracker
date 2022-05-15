require('dotenv').config();
const mysql = require('mysql2');

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'bbh123',
        database: 'employees_db'
    },
    console.log('Connected to the department database.')
)

module.exports = db;