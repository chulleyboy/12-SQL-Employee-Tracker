const express = require('express');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
	{
	  host: 'localhost',
	  // MySQL username,
	  user: 'root',
	  // MySQL password
	  password: 'process.env.DB_PASSWORD',
	  database: 'employee_db',
	  socketPath: '/tmp/mysql.sock'
	},
	console.log(`Connected to the employee_db database.`)
  );

  function init() {
	inquirer.prompt([
		{
			type:"list",
			message:"What would you like to do?",
			name:"choice",
			choices: [
				"View All Employees",
				"Add Employee",
				"Update Employee Role",
				"View Employee Role",
				"Add Role",
				"View All Departments",
				"Add Department"
			]
		}
	])

	.then(function(answer) {
		switch (answer.choice) {
			case "View All Employees":
				viewAllEmployees();
				break;
			case "Add Employee":
				addEmployee();
				break;
			case "Update Employee Role":
				updateEmployeeRole();
				break;
			case "View Employee Role":
				viewEmployeeRole();
				break;
			case "addRole":
				addRole();
				break;
			case "View All Departments":
				viewAllDepartments();
				break;
			case "Add Department":
				addDepartment();
				break;
			default:
				break;
            
		}
	})
  }

  init();
