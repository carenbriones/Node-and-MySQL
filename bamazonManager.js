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
    inquirer.prompt([{
        name: "command",
        message: "What would you like to do?",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }]).then(function(inquirerResponse) {
        switch (inquirerResponse.command) {
            case "View Products for Sale":
                viewAllProducts();
                break;
            case "View Low Inventory":
                break;
            case "Add to Inventory":
                break;
            case "Add New Product":
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
}

function viewAllProducts() {
    connection.query(
        "SELECT * FROM products",
        function(err, res) {
            if (err) throw err;
            console.table(res);
            mainMenu();
        }
    )
}