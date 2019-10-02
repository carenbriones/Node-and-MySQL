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
                addNewProduct();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
}

// Logs all products in the database
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

// Logs all products that have an inventory count less than 5
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

// Adds a
function addToInventory() {
    connection.query(
        "SELECT * FROM products",
        function(err, res) {
            if (err) throw err;
            console.log(res);
            var items = [];

            // Creates value + name objects for inquirer choices
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
                // Adds units to existing stock_quantity field
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

// Adds a new product to the database
function addNewProduct() {
    inquirer.prompt([{
            name: "productName",
            message: "What is the name of the product?",
            type: "input"
        },
        {
            name: "departmentName",
            message: "What department is this product in?",
            type: "input"
        },
        {
            name: "price",
            message: "How much does this product cost?",
            type: "number"
        },
        {
            name: "quantity",
            message: "How many are in stock?",
            type: "number"
        }
    ]).then(function(inquirerResponse) {
        // Inserts product into database
        var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) ";
        query += "VALUES (?, ?, ?, ?)"
        connection.query(query, [inquirerResponse.productName, inquirerResponse.departmentName, inquirerResponse.price, inquirerResponse.quantity],
            function(err, res) {
                if (err) throw err;
                console.log("Your item has successfully been added to the inventory.");
                mainMenu();
            })
    })
}