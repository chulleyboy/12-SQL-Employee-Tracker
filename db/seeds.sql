INSERT INTO department (id, name)
VALUES	(1, "Sales"),
		(2, "Engineering"),
		(3, "Finance"),
		(4, "Legal");

INSERT INTO role (id, title, salary, department_id)
VALUES	(1, "Sales Lead" 100000, 1),
		(2, "Salesperson" 80000, 1),
		(3, "Lead Engineer" 150000, 2),
		(4, "Software Engineer" 120000, 2),
		(5, "Account Manager" 160000, 3),
		(6, "Accountant" 125000, 3),
		(7, "Legal Team Lead" 250000, 4),
		(8, "Lawyer" 190000, 4);

INSERT INTO role (id, first_name, last_name, role_id, manager_id)
VALUES	(1, "John", "Doe", 1, null),
VALUES	(2, "Mike", "Chan", 2, "John Doe"),
VALUES	(3, "Ashley", "Rodriguez", 3, null),
VALUES	(4, "Kevin", "Tupik", 4, "Ashley Rodriguez"),
VALUES	(5, "Kunal", "Singh", 5, null),
VALUES	(6, "Malia", "Brown", 6, "Kunal Singh"),
VALUES	(7, "Sarah", "Lourd", 7, null),
VALUES	(8, "Tom", "Allen", 8, "Sarah Lourd");
