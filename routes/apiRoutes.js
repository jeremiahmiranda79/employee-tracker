const router = require('express').Router();
const { response } = require('express');
const db = require('../db/connection');
const inquirer = require('inquirer');
//require('console.table');

const colors = { 
    magenta: '\x1b[35m%s\x1b[0m', 
    yellow: '\x1b[33m%s\x1b[0m', 
    green: '\x1b[32m%s\x1b[0m',
    red: '\x1b[31m%s\x1b[0m', 
    blue: '\x1b[34m%s\x1b[0m' 
}

function displayHeader(text) {
    let border = [];

    for (let i = 0; i < text.length + 2; i++) {
        border.push('─'); 
    }

    let newBorder = border.join('');
    console.log(colors.blue, `┌${newBorder}┐`);
    console.log(colors.blue, `│ ${text} │`);
    console.log(colors.blue, `└${newBorder}┘`);
}

function viewAllDepartments() { 
    const selectAllFromDepartmentByNameDecending = 
        `select * from department order by name;`

    db.query(selectAllFromDepartmentByNameDecending, (error, results) => {
        if (error) {
            console.log(red, error);
            return response.status(500).json({ error: error.message });
        }

        displayHeader('Displaying all departments!');
        console.table(results);   
        init();
    });
}

function viewAllRoles() {
    const selectAllFromDepartment = 
        `select r1.id, r1.title, d1.name as department, r1.salary from role r1 join department d1 on r1.department_id = d1.id;`

    db.query(selectAllFromDepartment, (error, results) => {
        if (error) {
            console.log(red, error);
            return response.status(500).json({ error: error.message });
        }

        displayHeader('Displaying all roles!');
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
            console.log(red, error);
            return response.status(500).json({ error: error.message });
        }

        displayHeader('Displaying all employees!');
        console.table(results);
        init();
    });
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
    
            // console.log(displayHeader(colors.magenta, `New department '${answers.add_department}' added successfully!`))
            console.log(colors.magenta, `New department '${answers.add_department}' added successfully!`); 
            viewAllDepartments();
        })
    }) 
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
                title: role.title,
                salary: role.salary,
                department: role.department_id
            }

            roles.push(roleObject);
        })
    })

    return roles;
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

            displayHeader(`New role '${answers.role_title}' added successfully to ${answers.role_department}!`);
            viewAllRoles();
        })
    })
}
/////
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
            message: 'Enter an employee role id:',
            choices: createDepartmentList()
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter an employee manager id:'
        }
    ];

    inquirer.prompt(questions).then((answers) => {
        db.query(`insert into employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.first_name}", "${answers.last_name}", "${answers.role_id}", "${answers.manager_id}")` , (error, results) => {
            if (error) {
                console.log(colors.red, error);
                return response.status(500).json({ error: error.message});
            }

            console.log(colors.magenta, `New employee '${answers.first_name} ${answers.last_name}' added successfully`);
            viewAllEmployees();
        });
    })
}

function updateEmployee() {
    const question5 = [
        {
            type: 'input',
            name: 'employee_first_name',
            message: 'Select an employee:'
        },
        {
            type: 'input',
            name: 'employee_role',
            message: 'Select a new role:'
        }
    ];

    inquirer.prompt(question5).then((answers) => {
        db.query(`update employee set employee_role = ${answers.employee_role} where employee_name = ${answers.employee_first_name}`, (error, results) => {
            if (error) {
                console.log(red, error);
                return response.status(500).json({ error: error.message });
            }

            console.log(colors.magenta, `Employee '${answers.first_name} ${answers.last_name}' updated successfully`);
            viewAllEmployees();
        });
    })
}

function exit() {
    console.log(red, 'Quit!!!');
    process.exit(0);
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
                console.log(red, 'answers.choice is empty!!!!');
        }
    });
};

init();

module.exports = router;