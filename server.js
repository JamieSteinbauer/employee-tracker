const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');


const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', apiRoutes);

// default response for 404 not found
app.use((req, res) => {
    res.status(404).end();
})

db.connect(err => {
    if (err) throw err;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    })
})

const viewEmployees = () => {
    var query = `SELECT * FROM employee`;
    db.query(query, function(err, res) {
        if (err) throw err;
        console.table('Employees', res);
        userQuestions();
    })
}

const viewRoles = () => {
    var query = 'SELECT * FROM role';
    db.query(query, function(err, res) {
        if (Err) throw err;
        console.table('Roles', res);
        userQuestions();
    })
}





// get all employees
app.get('/api/employee', (req, res) => {
    const sql = `SELECT * from employee`;

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'sucess',
            data: rows
        });
    });
});

// get single employee with id
app.get('/api/employee/:id', (req, res) => {
    const sql = `SELECT * FROM employee WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// create an employee
app.post('/api/employee', ({ body }, res) => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    const params = [
        body.first_name, 
        body.last_name, 
        body.role_id, 
        body.manager_id
    ];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
            changes: result.affectedRows
        });
    });
});

//delete an employee
app.delete('/api/employee/:id', (req, res) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(404).json({ error: res.message });  
        } else if (!result.affectedRows) {
            res.json({
                messgae: 'Candidate not found'
            })
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});



