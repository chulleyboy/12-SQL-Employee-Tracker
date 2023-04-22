const mysql = require('mysql2/promise');
const consoleTable = require('console.table');
const inquirer = require('inquirer');
require('dotenv').config();

const db = mysql.createPool(
	{
	  host: "localhost",
	  user: process.env.DB_USER,
	  password: process.env.DB_PW,
	  database: process.env.DB_NAME,
	},
	console.log(`Connected to the employee_db database.`)
  );

  async function Questions() {
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
				"Add Department",
				"Exit"
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
			case "Exit":
				break;
			default:
				break;
            
		}
	})
  }

  async function viewAllEmployees() {
	const result = await db.query('SELECT e.id, e.first_name, e.last_name, r.title, d.department, r.salary, CONCAT(m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id');
	console.table(result[0]);
	await Questions();
  }
  async function viewAllRoles() {
	const result = await db.query('SELECT role.id, role.title, department.department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id');
	console.table(result[0]);
	await Questions();
  }
  async function viewAllDepartments() {
	const result = await db.query('SELECT * FROM department');
	console.table(result[0]);
	await Questions();
  }
  async function updateEmployeeRole() {
	// Query the database to retrieve the list of employees and their roles
	const [rows, fields] = await db.query(`
	  SELECT employee.id, employee.first_name, employee.last_name, role.title
	  FROM employee
	  JOIN role ON employee.role_id = role.id
	`);
	// Create an array of employee choices for the user to select from
	const employeeChoices = rows.map((row) => {
	  return {
		name: `${row.first_name} ${row.last_name} (${row.title})`,
		value: row.id,
	  };
	});
	// Prompt the user to select an employee
	const employee = await inquirer.prompt([
	  {
		type: 'list',
		message: 'Which employee do you want to update?',
		name: 'id',
		choices: employeeChoices,
	  },
	]);
	// Query the database to retrieve the list of roles
	const [roleRows, roleFields] = await db.query('SELECT * FROM role');
	// Create an array of role choices for the user to select from
	const roleChoices = roleRows.map((row) => {
	  return {
		name: row.title,
		value: row.id,
	  };
	});
	// Prompt the user to select a new role
	const newRole = await inquirer.prompt([
	  {
		type: 'list',
		message: 'Which role do you want to assign to the employee?',
		name: 'role_id',
		choices: roleChoices,
	  },
	]);
	// Update the employee's role in the database
	await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [
	  newRole.role_id,
	  employee.id,
	]);
	console.log(`Updated employee's role.`);
	await Questions();
  }
  async function addEmployee() {
	const roles = await db.query('SELECT * FROM role');
	const managers = await db.query('SELECT * FROM employee WHERE manager_id IS NULL');
	// Prompt the user about the new employee
	inquirer.prompt([
	  {
		type: 'input',
		message: "What is the employee's first name?",
		name: 'first_name',
		validate: function (input) {
		  if (!input) {
			return "Please enter a first name.";
		  }
		  return true;
		},
	  },
	  {
		type: 'input',
		message: "What is the employee's last name?",
		name: 'last_name',
		validate: function (input) {
		  if (!input) {
			return "Please enter a last name.";
		  }
		  return true;
		},
	  },
	  {
		type: 'list',
		message: "What is the employee's role?",
		name: 'role_id',
		choices: roles[0].map(role => ({name: role.title, value: role.id})),
	  },
	  {
		type: 'list',
		message: "Who is the employee's manager?",
		name: 'manager_id',
		choices: managers[0].map(manager => ({name: `${manager.first_name} ${manager.last_name}`, value: manager.id})),
	  }
	])
	.then(async function(answer) {
	  const [rows, fields] = await db.execute('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answer.first_name, answer.last_name, answer.role_id, answer.manager_id]);
	  console.log(`Added ${answer.first_name} ${answer.last_name} to the database.`);
	  await Questions();
	});
  }
  async function addRole() {
	const departments = await db.query('SELECT * FROM department');
	const departmentChoices = departments[0].map((department) => {
	  return {
		name: department.department,
		value: department.id
	  };
	});
  	// Prompt the user about the new role
	inquirer.prompt([
	  {
		type: 'input',
		message: 'What is the name of the role?',
		name: 'title',
		validate: function (input) {
			if (!input) {
			  return "Please enter a name.";
			}
			return true;
		  },
	  },
	  {
		type: 'number',
		message: 'What is the salary for the role?',
		name: 'salary',
		validate: function (input) {
			if (!input) {
			  return "Please enter a salary.";
			}
			return true;
		  },
	  },
	  {
		type: 'list',
		message: 'Which department does the role belong to?',
		name: 'department_id',
		choices: departmentChoices
	  }
	])
	.then(async function(role) {
		const [rows, fields] = 	await db.query('INSERT INTO role SET ?', role);
		console.log(`Added ${role.title} role to the database.`);
		await Questions();
	});
  }
  async function addDepartment() {
	// Prompt the user for the name of the new department
	inquirer.prompt([
	  {
		type: 'input',
		message: 'What is the name of the department?',
		name: 'department',
		validate: function (input) {
			if (!input) {
			  return "Please enter a name.";
			}
			return true;
		  },
	  }
	])
	.then(async function(department) {
		const [rows, fields] = 	await db.query('INSERT INTO department SET ?', department);
		console.log(`Added ${department.department} department to the database.`);
		await Questions();
	});
  }



  Questions();
