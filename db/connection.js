const mySQL = require('mysql2');

const connection = mySQL.createConnection(
    {
        host: 'localhost', 
        user: 'root', 
        password: 'smileing54321!', 
        database: 'employees_db'
    }
);

module.exports = connection;