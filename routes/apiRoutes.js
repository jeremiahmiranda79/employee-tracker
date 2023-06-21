const router = require('express').Router();
const response = require('express');
const db = require('../db/connection');
const inquirer = require('inquirer');
const logo = require('asciiart-logo');

// https://drive.google.com/file/d/1Pro_eYJVLklb0bG9r8mCJkCtatfSXxBh/view

const colors = { 
    magenta: '\x1b[35m%s\x1b[0m', 
    yellow: '\x1b[33m%s\x1b[0m', 
    green: '\x1b[32m%s\x1b[0m',
    red: '\x1b[31m%s\x1b[0m', 
    blue: '\x1b[34m%s\x1b[0m' 
}

function displayHeader(text, color) {
    let border = [];

    for (let i = 0; i < text.length + 2; i++) {
        border.push('─'); 
    }

    let newBorder = border.join('');
    console.log(color, `┌${newBorder}┐`);
    console.log(color, `│ ${text} │`);
    console.log(color, `└${newBorder}┘`);
}

function viewAllDepartments() { 
    const selectAllFromDepartmentByNameDecending = 
        `select * from department order by name;`

    db.query(selectAllFromDepartmentByNameDecending, (error, results) => {
        if (error) {
            console.log(colors.red, error);
            return response.status(500).json({ error: error.message });
        }

        displayHeader('Displaying all departments!', colors.magenta);
        console.table(results);   
        init();
    });
}

function viewAllRoles() {
    const selectAllFromDepartment = 
        `select r1.id, r1.title, d1.name as department, r1.salary from role r1 join department d1 on r1.department_id = d1.id;`

    db.query(selectAllFromDepartment, (error, results) => {
        if (error) {
            console.log(colors.red, error);
            return response.status(500).json({ error: error.message });
        }

        displayHeader('Displaying all roles!', colors.yellow);
        console.table(results);
        init();
    }); 
}

function viewAllEmployees() {
    const selectAllFromEmployee = 
        `select e1.id, e1.first_name, e1.last_name, role.title, department.name as department, role.salary, concat(e2.first_name, ' ', e2.last_name) as manager
        from employee e1
        join employee e2 on e1.manager_id = e2.id
        join role on e1.role_id = role.id
        join department on role.department_id = department.id
        where e2.manager_id is null
        union all
        select e1.id, e1.first_name, e1.last_name, role.title, department.name as department, role.salary, null as manager
        from employee e1
        join role on e1.role_id = role.id
        join department on role.department_id = department.id
        where e1.manager_id is null
        order by 1;`

    db.query(selectAllFromEmployee, (error, results) => {
        if (error) {
            console.log(colors.red, error);
            return response.status(500).json({ error: error.message });
        }

        displayHeader('Displaying all employees!', colors.blue);
        console.table(results);
        init();
    });
}

function createDepartmentList() {
    let departments = [];

    db.query('select * from department', (error, result) => {
        result.forEach(department => {
            let departmentObject = {
                name: department.name,
                value: department.id
            }

            departments.push(departmentObject);
        })
    })

    return departments;
}

function createRoleList() {
    let roles = [];

    db.query('select * from role', (error, result) => {
        result.forEach(role => {
            let roleObject = {
                name: role.title,
                value: role.id
            };

            roles.push(roleObject);
        })
    })

    return roles;
}

function createManagerList() {
    let managers = [];

    let managersObjectEmpty = {
        name: 'None',
        value: null
    }

    managers.push(managersObjectEmpty);

    db.query('select * from employee where manager_id is null', (error, result) => {
        result.forEach(manager => {
            let managersObject = {
                name: manager.first_name + ' ' + manager.last_name,
                value: manager.id
            }

            managers.push(managersObject);
        })
    })

    return managers;
}

function createEmployeeList(callBack) {
    let employees = [];

    db.query('select first_name, last_name, id from employee', (error, result) => {
        result.forEach(employee => {
            let employeeObject = {
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id
            };

            employees.push(employeeObject);
        });

        callBack(employees);
    });

    return employees;
}

function addDepartment() {
    const questions = [
        {
            type: 'input',
            name: 'add_department',
            message: 'Enter the department name:'
        },
    ];
    
    inquirer.prompt(questions).then((answers) => {
        db.query(`insert into department (name) values ('${answers.add_department}');`, (error, results) => {
            if (error) {
                console.log(colors.red, error);
                return response.status(500).json({ error: error.message});
            } 

            console.log(displayHeader(`New department '${answers.add_department}' added successfully!`, colors.magenta))
            viewAllDepartments();
        });
    });
}

function addRole() {
    const questions = [
        {
            type: 'input',
            name: 'role_title',
            message: 'Enter a role title:'
        },
        {
            type: 'input',
            name: 'role_salary',
            message: 'Enter a role salary:'
        },
        {
            type: 'list',
            name: 'role_department',
            message: 'Select the department the role belongs to:',
            choices: createDepartmentList()
        }
    ];
    
    inquirer.prompt(questions).then((answers) => {
        db.query(`insert into role (title, salary, department_id) values ("${answers.role_title}", "${answers.role_salary}", "${answers.role_department}")` , (error, results) => {
            if (error) {
                console.log(colors.red, error);
                return response.status(500).json({ error: error.message});
            }

            displayHeader(`New role '${answers.role_title}' added successfully!`, colors.yellow);
            viewAllRoles();
        });
    });
}

function addEmployee() {
    const questions = [
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter an employee first name:'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter an employee last name:'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select a role:',
            choices: createRoleList()
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Enter a manager for role:',
            choices: createManagerList()
        }
    ];

    inquirer.prompt(questions).then((answers) => {
        db.query(`insert into employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.first_name}", "${answers.last_name}", "${answers.role_id}", "${answers.manager_id}")` , (error, results) => {
            if (error) {
                console.log(colors.red, error);
                return response.status(500).json({ error: error.message});
            }

            displayHeader(`New employee '${answers.first_name} ${answers.last_name}' added successfully!`, colors.blue)
            viewAllEmployees();
        });
    });
}

function updateEmployee() {
    function callBackPrompt(list) {
        const questions = [
            {
                type: 'list',
                name: 'employee_name',
                message: 'Choose an Employee:',
                choices: list
            },
            {
                type: 'list',
                name: 'employee_role',
                message: 'Choose a new role:',
                choices: createRoleList()
            }
        ];  
 
        inquirer.prompt(questions).then((answers) => {
            db.query(`update employee set role_id = ${answers.employee_role} where id = ${answers.employee_name}`, (error, results) => {
                if (error) {
                    console.log(colors.red, error);
                    return response.status(500).json({ error: error.message});
                }
    
                displayHeader(`Employee role updated successfully!`, colors.yellow)
                viewAllEmployees();
            });
        });
    };

    createEmployeeList(callBackPrompt);
}

function exit() {
    displayHeader('Quit!!!', colors.red)
    process.exit(0);
}

function start() {
    const text = 'Employee Manager'

    console.log(
        logo(
            {
                name: 'Employee Manager',
                font: 'Speed',
                lineChars: 10,
                padding: 3,
                margin: 0,
                borderColor: 'yellow',
                logoColor: 'bold-purple',
                textColor: 'green',
            }
        )

        .emptyLine()
        .right('version 3.7.123')
        .emptyLine()
        .center(text)
        .render()
    );

    displayHeader('Connected to the employees_ databsae!', colors.green);

    init();
}

function init() {
    const questions = [
        {
            type: 'list',
            name: 'choice',
            message: 'Please select one:',
            choices: [
                'View all departments?', 
                'View all roles?',
                'View all employees?', 
                'Add a department?', 
                'Add a role?',
                'Add an employee?',
                'Update employee role?',
                'Exit?'
            ]
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        switch (answers.choice) {
            case 'View all departments?':
                return viewAllDepartments();
            case 'View all roles?':
                return viewAllRoles();
            case 'View all employees?':
                return viewAllEmployees();
            case 'Add a department?':
                return addDepartment();
            case 'Add a role?':    
                return addRole();
            case 'Add an employee?':
                return addEmployee();
            case 'Update employee role?':
                return updateEmployee();
            case 'Exit?':
                return exit();
            default:
                console.log(colors.red, 'Answers choice is empty!!!!');
                break;
        };
    });
};

start();

module.exports = router;