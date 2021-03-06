var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    mainMenu();
});

function mainMenu() {
    inquirer.prompt({
        name: "command",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department", "Exit"],
        type: "list"
    }).then(function(inquirerResponse) {
        switch (inquirerResponse.command) {
            case "View Product Sales by Department":
                viewSalesByDept();
                break;
            case "Create New Department":
                createNewDept();
                break;
            case "Exit":
                connection.end();
                break;
        }
    });
}

// Shows all sales, sorted by department
function viewSalesByDept() {
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, ";
    query += "sum(products.product_sales) AS product_sales, (sum(products.product_sales) - departments.over_head_costs) AS total_profit "
    query += "FROM departments INNER JOIN products ON departments.department_name = products.department_name ";
    query += "GROUP BY (departments.department_id);"

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

// Creates a new department in the table
function createNewDept() {
    inquirer.prompt([{
        name: "deptName",
        message: "Enter the name of the department: ",
        type: "input"
    }, {
        name: "overheadCosts",
        message: "Enter the over head costs: ",
        type: "number"
    }]).then(function(inquirerResponse) {
        connection.query(
            "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)", [inquirerResponse.deptName, inquirerResponse.overheadCosts],
            function(err, res) {
                if (err) throw err;
                console.log("The department has successfully been added.");
                mainMenu();
            }
        )
    })
}