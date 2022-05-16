# Employee Tracker

## Description
*A command-line application to manage a company's employee database, using Node.js, Inquirer, and MySQL*


## Usage

GIVEN a command-line application that accepts user input
- WHEN I start the application
  - THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
- WHEN I choose to view all departments
  - THEN I am presented with a formatted table showing department names and department ids
- WHEN I choose to view all roles
  - THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
- WHEN I choose to view all employees
  - THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
- WHEN I choose to add a department
  - THEN I am prompted to enter the name of the department and that department is added to the database
- WHEN I choose to add a role
  - THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
- WHEN I choose to add an employee
  - THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
- WHEN I choose to update an employee role
  - THEN I am prompted to select an employee to update and their new role and this information is updated in the database


## Video
https://drive.google.com/file/d/1w2e95VLW5TbV6Npsa3070SXp4x9e7iRp/view



## Instructions
1. Clone repo locally
2. Install npm
3. Install express, inquirer, Dotenv, mysql
4. Open terminal and type: mysql -u root -p
5. Enter your password
6. Once the mysql shell is activated, run some queries:
    USE employees;
    SOURCE db/schema.sql
    SOURCE db/seeds.sql
7. Exit out of the shell
8. Run the command: npm start


## Built With
* MySql2
* Node.js
* Express.js
* Console Table
* Dotenv
* JavaScript
* Inquirer

 