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



const prompts = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View all departments.']
        }])
        .then(userChoice => {
            
connection.query(`SELECT * FROM department ORDER BY id,department_name`, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    userPrompts();
});
        });
}
prompts();
const userPrompts = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'What would you like to do?',
            message: 'Add Employee',
            choices: ['View All Employees.', 'Add Employee', 'Upddate Employee Role', 'View All Roles', 
                      'Add Role', 'View All Departments', 'Add Department', 'Quit']
        }])
        .then()
    }


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
                console.log('Added ' + userChoice.addDepartment + ' to departments!');
            })
        })
    }