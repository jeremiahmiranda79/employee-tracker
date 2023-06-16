const mySQL = require('mysql2');

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

const connection = mySQL.createConnection(
    {
        host: 'localhost', 
        user: 'root', 
        password: 'smileing54321!', 
        database: 'employees_db'
    },

    console.log(displayHeader('Connected to the employees_db database!'))
);

module.exports = connection;