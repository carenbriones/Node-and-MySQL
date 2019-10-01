var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
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