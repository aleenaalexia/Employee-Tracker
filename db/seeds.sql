-- INSERT INTO department (department_name)
-- VALUES ("Sales"),
--        ("Engineering"),
--        ("Finance"),
--        ("Legal");

INSERT INTO employee_role (title, salary, department_id)
VALUES ('Chef', 100000, 1),
       ('Salesperson', 80000, 1),
       ('Baker', 150000, 2),
       ('Software Engineer', 120000, 2),
       ('Account Manager', 160000, 3),
       ('Accountant', 125000, 3),
       ('Legal Team Leader', 250000, 4),
       ('Manager', 200000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Aleena', 'Johns', 1, 3),
       ('Jonathan', 'Doe', 3, 3),
       ('Tammy', 'Shaw', 8, 3);

       SELECT * FROM department ORDER BY id,department_name;

       DELETE FROM `employee_role` WHERE `id` >=9 and id<=40;