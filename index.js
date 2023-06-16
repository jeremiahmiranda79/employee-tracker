// const inquirer = require('inquirer');

// const questions = [
//     {
//         type: 'list',
//         name: 'choice',
//         message: 'Please select one:',
//         choices: [
//             'View all departments???', 
//             'View all roles???',
//             'View all employees???', 
//             'Add a department???', 
//             'Add a role???',
//             'Add an employee???',
//             'Update employee role???'
//         ]
//     },
// ];

// function init() {
//     inquirer.prompt(questions).then((answers) => {
//         if (answers.choice === 'View all departments???') {
//             console.log('View all departments!!!');
//             apiRoutes.get('/departments', answers.choice);
//         }
//         else if (answers.choice === 'View all roles???') {
//             api
//         }
//         else if (answers.choice === 'View all employees???') {
//             console.log('View all employees!!!')
//         }
//         else if (answers.choice === 'Add a department???') {
//             console.log('Add a department!!!');
//         }
//         else if (answers.choice === 'Add a role???') {    
//             console.log('Add a role!!!');
//         }
//         else if (answers.choice === 'Add an employee???') {
//             console.log('Add an employee!!!');
//         }
//         else if (answers.choice === 'Update employee role???') {
//             console.log('Update employee role!!!');
//         }
//         else {
//             console.log('answers.choice is empty!!!!');
//         }
//     });
// };

// init();