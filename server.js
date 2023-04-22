//const express = require('express');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const inquirer = require('inquirer');

const db = mysql.createConnection(
	{
	  host: "localhost",
	  user: "root",
	  password: "process.env.DB_PW",
	  database: "employee_db",
	  socketPath: "/tmp/mysql.sock"
	},
	console.log(`Connected to the employee_db database.`)
  );

  db.connect();

  function Questions() {
	inquirer.prompt([
		{
			type:"list",
			message:"What would you like to do?",
			name:"choice",
			choices: [
				"View All Employees",
				"View All Roles",
				"View All Departments",
				"Update Employee Role",
				"Add Employee",
				"Add Role",
				"Add Department"
			]
		}
	])

	.then(function(answer) {
		switch (answer.choice) {
			case "View All Employees":
				viewAllEmployees();
				break;
			case "View All Roles":
				viewAllRoles();
				break;
			case "View All Departments":
				viewAllDepartments();
				break;
			case "Update Employee Role":
				updateEmployeeRole();
				break;
			case "Add Employee":
				addEmployee();
				break;
			case "Add Role":
				addRole();
				break;
			case "Add Department":
				addDepartment();
				break;
			default:
				break;
            
		}
	})
  }

  viewAllEmployees = () => {
	db.query('SELECT * FROM department', function (err, result) {
		console.table(result);
		Questions();
	})
  }
  viewAllRoles = () => {
	db.query('SELECT role.id, role.title, role.salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id', function (err, result) {
		console.table(result);
		Questions();
	})
  }
  viewAllDepartments  = () => {
	db.query('SELECT * FROM department', function (err, result) {
		console.table(result);
		Questions();
	})
  }
  updateEmployeeRole = () => {
	
  }
  addEmployee = () => {
	
  }
  addRole = () => {
	
  }
  addDepartment = () => {
	
  }



  Questions();
