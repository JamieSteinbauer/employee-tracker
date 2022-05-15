-- EMPLOYEE SEEDS --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Smith', 1, null)
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, null),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, null),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, null),
    ('Tom', 'Allen', 8, 7)

-- ROLE SEEDS --
INSERT INTO role (title, salary, department_id)
VALUES
    ('Lead Salesperson', 150000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4)


-- DEPARTMENT SEEDS --
INSERT INTO department (name)
VALUES 
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal")
