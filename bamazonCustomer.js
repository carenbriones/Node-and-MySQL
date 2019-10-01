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
    // Display current inventory
    connection.query(
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
                    message: "Which item would you like to buy?",
                    choices: items
                },
                {
                    name: "quantity",
                    type: "number",
                    message: "How many units would you like to buy?"
                }
            ]).then(function(inquirerResponse) {
                connection.query(
                    "SELECT stock_quantity, price FROM products WHERE item_id = ?",
                    inquirerResponse.item,
                    function(err, res) {
                        if (err) throw err;
                        if (res[0].stock_quantity >= inquirerResponse.quantity) { // Enough in stock
                            // Calculates remaining quantity and cost for the order
                            var remainingQuantity = res[0].stock_quantity - inquirerResponse.quantity;
                            var cost = res[0].price * inquirerResponse.quantity;

                            // Update quantity of item in table
                            connection.query(
                                "UPDATE products SET stock_quantity = ? WHERE item_id = ?", [remainingQuantity, inquirerResponse.item],
                                function(err, res) {
                                    if (err) throw err;
                                    console.log("Your order has been fulfilled.")
                                    console.log("Your total will be " + cost.toFixed(2));
                                    connection.end();
                                }
                            )
                        } else {
                            console.log("Insufficient quantity! Your order has not been placed.");
                            connection.end();
                        }
                    }
                )
            })
        });
}