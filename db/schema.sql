DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

use employees_db;

CREATE TABLE department (
    id int AUTO_INCREMENT PRIMARY KEY,
    name varchar(30) NOT NULL
);

CREATE TABLE role (
    id int AUTO_INCREMENT PRIMARY KEY,
    title varchar(30) NOT NULL, 
    salary decimal NOT NULL,
    department_id int,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id int AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    role_id int,
    manager_id int,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL
);