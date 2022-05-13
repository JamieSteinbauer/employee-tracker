const express = require('express');
const mysql = require('mysql2');


const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

app.get('/', (req, res) => {
    res.json({
        message: 'Hello world'
    });
});

// Default response for any other request (nnot found)
app.use((req, res) => {
    res.status(404).end();
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})