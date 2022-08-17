const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


// connecting database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Meathead31',
    database: 'cms'
});


// initial prompt on server load
const prompts = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View all departments.']
        }])
        .then(userChoice => {
 // displays department table           
viewDepartments();
        });
}
prompts();

// lists all user options
const userPrompts = () => {
     inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 
                      'Add Role', 'View All Departments', 'Add Department', 'Quit']
        }])
        .then(answers => {
            // const { choices } = answers;

            // switch (answers) {
            //     case 'View All Employees':
            //         viewEmployees();
            //         break;
            //     case 'View All Departments':
            //         viewDepartments();
            //         break;
            // }
            console.log(answers);
            if (answers.choices === "View All Employees") {
                viewEmployees();
            }

            if (answers.choices === "Add Employee") {
                addEmployee();
            }

            if (answers.choices === "Update Employee Role") {
                updateEmployee();
            }

            if (answers.choices === 'View All Roles') {
                viewRoles();
            }

            if (answers.choices === 'Add Role') {
                addRole();
            }

            if (answers.choices === "View All Departments") {
                viewDepartments();
            }

            if (answers.choices === 'Add Department') {
                addDepartment();
            }

            if (answers.choices === 'Quit') {
                connection.end();
            };
        });
    };

    // view all departments function
    viewDepartments = () => {
        connection.query(`SELECT * FROM department ORDER BY id,department_name`, (err, rows) => {
            if (err) throw err;
            console.table(rows);
            userPrompts();
        });
    };

    // view all employees function
    viewEmployees = () => {
        connection.query(`SELECT * FROM employee ORDER BY id,first_name,last_name,role_id,manager_id`, (err, rows) => {
            if (err) throw err;
            console.table(rows);
            userPrompts();
        });
    };

    // add new employee function
    addEmployee = () => {
        inquirer.prompt([
            {
                type: 'input', 
                name: 'firstName',
                message: "Employee's first name?",
            },
            {
                type: 'input', 
                name: 'lastName',
                message: "Employee's last name?",
            }
        ])
        .then(answer => {
            const name = [answer.firstName, answer.lastName]

            connection.query(`SELECT employee_role.id, employee_role.title FROM employee_role`, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "Employee's role?",
                        choices: roles
                    }
                ])
                .then(userChoice => {
                    const role = userChoice.role;
                    name.push(role);

                    connection.query(`SELECT * FROM employee`, (err, data) => {
                        if (err) throw err;

                        const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

                        inquirer.prompt([
                            {
                                type: 'list', 
                                name: 'manager', 
                                message: "Employee's manager?",
                                choices: managers
                            }
                        ])
                        .then(userChoice => {
                            const manager = userChoice.manager;
                            name.push(manager);

                            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ?, ?)`, name, (err, result) => {
                                if (err) throw err;
                                console.log('Employee successfully added!')

                                viewEmployees();
                                userPrompts();
                            });
                        });
                    });
                });
            });
        });
    };

    // update employee role function
    updateEmployee = () => {
        connection.query(`SELECT * FROM employee`, (err, data) => {
            if (err) throw err;

            const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

            inquirer.prompt([
                {
                    type: 'list', 
                    name: 'name',
                    message: "Please choose an employee to update.",
                    choices: employees
                }
            ])
            .then(userChoice => {
                const employee = userChoice.name;
                const params = [];
                params.push(employee);

                connection.query(`SELECT * FROM employee_role`, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "Employee's new role?",
                            choices: roles
                        }
                    ])
                    .then(userChoice => {
                        const role = userChoice.role;
                        params.push(role);

                        let employee = params[0]
                        params[0] = role
                        params[1] = employee

                        connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, params, (err, result) => {
                            if (err) throw err;
                            console.log('Employee has been successfully updated!');

                            viewEmployees();
                        });
                    });
                });
            });
        });
    };

    // view all roles function
    viewRoles = () => {
        connection.query(`SELECT employee_role.id, employee_role.title, department.department_name AS department
        FROM employee_role
        INNER JOIN department ON employee_role.department_id = department.id`, (err, rows) => {
            if (err) throw err;
            console.table(rows);
            userPrompts();
        })
    };

    // add new role function
    addRole = () => {
        inquirer.prompt([
            {
                type: 'input', 
                name: 'role',
                message: 'What role would you like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for this role?'
            }
        ])
        .then(answer => {
            const params = [answer.role, answer.salary];

            connection.query(`SELECT department_name, id FROM department`, (err, data) => {
                if (err) throw err;

                const department = data.map(({ department_name, id }) => ({ name: department_name, value: id}));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department is this role in?',
                        choices: department
                    }
                ])
                .then(userChoice => {
                    const department = userChoice.department;
                    params.push(department);

                    connection.query(`INSERT INTO employee_role (title, salary, department_id)
                    VALUES (?, ?, ?)`, params, (err, result) => {
                        if (err) throw err;
                        console.log('Successfully added new role!');

                        viewRoles();
                    });
                });
            });
        });
    };

    // add new department function
    addDepartment = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'addDepartment',
                message: 'New Department name?'
            }
        ])
        .then(userChoice => {
            connection.query(`INSERT INTO department (department_name) VALUES (?)`, answer.addDepartment, (err, result) => {
                if(err) throw err;
                console.log('Successfully added ' + userChoice.addDepartment + ' to departments!');

            });
        });
    };
