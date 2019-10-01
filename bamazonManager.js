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
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
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

function viewLowInventory() {
    connection.query(
        "SELECT * FROM products WHERE stock_quantity < 5",
        function(err, res) {
            if (err) throw err;
            console.table(res);
            mainMenu();
        }
    )
}

function addToInventory() {
    connection.query(
        // Gets all products
        "SELECT * FROM products",
        function(err, res) {
            if (err) throw err;
            console.log(res);
            var items = [];

            for (var i = 0; i < res.length; i++) {
                items.push({ value: res[i].item_id, name: res[i].product_name });
            }

            inquirer.prompt([{
                name: "item",
                type: "list",
                message: "Which item would you like to add more of??",
                choices: items
            }, {
                name: "quantity",
                type: "number",
                message: "How many units would you like to add?"
            }]).then(function(inquirerResponse) {
                connection.query(
                    "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [inquirerResponse.quantity, inquirerResponse.item],
                    function(err, res) {
                        if (err) throw err;
                        console.log("The quantity has been updated for the item specified.");
                        mainMenu();
                    }
                )
            })
        }
    )
}