const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');
const cTable = require('console.table');


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

                          const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
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

// add department function
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

// add role function
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

// function to update employee role
updateEmployeeRole = () => {
    var sql = `SELECT * FROM employee`;
  
    db.query(sql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ 
        id, first_name, last_name 
        }) => ({ 
        name: first_name + " "+ last_name, value: id 
        }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
          const roleSql = `SELECT * FROM role`;
  
          db.query(roleSql, (err, data) => {
            if (err) throw err; 
  
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
                  .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role); 
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee 
                  
  
                  var updateRole = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                  db.query(updateRole, params, (err, result) => {
                    if (err) throw err;
                  console.log("Employee's role has been updated");
                
                  userQuestions();
            });
          });
        });
      });
    });
};


// function for prompting the user
const userQuestions = () => {
    inquirer.prompt([
        {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
            'View all employees',
            'View all roles',
            'View all departments',
            'View all employees by department',
            'Update employee role',
            'Add department',
            'Add role',
            'Add employee'
        ]
        }
    ])
    .then((answer) => {
        switch (answer.choice) {
            case 'View all employees':
                viewEmployees();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'View employees by department':
                employeeDepartment();
                break;
            case 'Update employee role':
                updateEmployeeRole();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Add department':
                addDepartment();
                break;
        }
    })
}


userQuestions();
