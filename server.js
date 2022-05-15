const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');
const consoleTable = require('console.table');


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
        if (err) throw err;
        console.table('Roles', res);
        userQuestions();
    })
}

const viewDepartments = () => {
    var query = 'SELECT * FROM department';
    db.query(query, function(err, res) {
        if (err) throw err;
        console.table('Departments', res);
        userQuestions();
    })
}

const employeeDepartment = () => {
    var query = `SELECT employee.first_name,
                 employee.last_name,
                 department.name AS department
                 FROM employee
                 LEFT JOIN role ON employee.role_id = rold.id
                 LEFT JOIN department ON role.department_id = department.id;`
    db.query(query, function(err, res) {
        if (err) throw err;
        console.table('Employee/Department', res);
        userQuestions();
    })
}

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employee\'s first name?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employee\'s last name?'
        }
    ])
    .then(answer => {
        const params = [answer.firstName, answer.lastName]
        const roleSql = `SELECT role.id, role.title FROM role`;

        db.query(roleSql, (err, data) => {
            if (err) throw err;
            const roles = data.map(({ id, title }) => ({ name: title, valie: id }));

            inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's role?",
                  choices: roles
                }
              ])
              .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role);

                  const managerSql = `SELECT * FROM employee`;
                  db.query(managerSql, (err, data) => {
                      if (err) throw err;

                      const managers = data.map((
                          {id, first_name, last_name}
                      ) => ({name: first_name + ' ' + last_name, value: id}
                      ));

                      inquirer.prompt([
                          {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the employee\'s manager?',
                            choices: managers
                          }
                      ])
                      .then(managerChoice => {
                          const manager = managerChoice.manager;
                          params.push(manager);

                          const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id
                            VALUES (?, ?, ?, ?)`;

                            db.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log('Employee has been added to the database')

                                userQuestions();
                            })
                      })
                  })
                })
        })
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

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the new department\'s name?'
        }
    ])
    .then(function (answer) {
        db.query(`INSERT INTO department SET?`, {
            name: answer.department
        })
        var query = `SELECT * FROM department`;
        db.query(query, function(err, res) {
            if (err) throw err;
            console.table('Departments', res);
            userQuestions();
        })
    })
}

const addRole = () => {
    db.query(`SELECT * FROM department`, function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'new_role',
                message: 'What is the name of the new role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the new role?'
            },
            {
                type: 'list',
                name: 'Department',
                choices: function() {
                    var department = [];
                    for (let i = 0; i < res.length; i++) {
                        department.push(res[i].name);
                    }
                    return department;
                }
            }
        ])
        .then(function(answer) {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name === answer.Department) {
                    department_id = res[a].id;
                }
            }
            db.query(`INSERT INTO role SET?`, {
                title: answer.new_role,
                salary: answer.salary,
                department_id: department_id
            })
            var query = `SELECT * FROM role`;
            db.query(query, function (err, res) {
                if (err) throw err;
                console.table('Roles', res);
                userQuestions();
            })
        })
    })
}

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



