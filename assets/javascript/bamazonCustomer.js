var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    //Your username
    user: "root",

    //Your password
    password: "",
    database: "bamazon"
});

connection.connect(function(err)
{
    if (err != null)
    {
        throw err;
    }
    //console.log("connected as id " + connection.threadId);
    processOrder();
});

var processOrder = function() 
{
    inquirer.prompt({
        type: "list",
        message: "Menu options:",
        choices: ["Purchase Products", "Exit"],
        name: "option"
    }).then(function(response) {
        switch(response.option)
        {
            case "Purchase Products":
                saleProducts();
                break;
            case "Exit":
                connection.end();
                break;
            default:
                console.log("Unknown option");
        }
    });
}

var saleProducts = function()
{
    connection.query("SELECT item_id, product_name, " +
        "department_name, price, stock_quantity " +
        "FROM products ORDER BY item_id ASC", function(err, res) 
    {
        if (err != null)
        {
            throw err;
        }
        var len = res.length;
        if (len != 0)
        {
            var min = res[0].item_id;
            var max = res[len-1].item_id;
            console.log("\nItems available for sale:\n");
            console.table(["item_id", 
                "product_name", 
                "department_name", 
                "price", "stock_quantity"], res);
            inquirer.prompt([
            {
                name: "itemId",
                type: "input",
                message: "Please select the product id:",
                validate: function(value) {
                    if ((isNaN(value) === false) && (value >= min) && (value <= max)) 
                    {
                        return true;
                    }
                    else 
                    {
                        return false;
                    }	
                } 
            },
            {
                name: "quantity",
                type: "input",
                message: "Please select the quantity:",
                validate: function(value) {
                    if (isNaN(value) === false) 
                    {
                        return true;
                    }
                    else 
                    {
                        return false;
                    }	
                } 
            }]).then(function(response) {
                connection.query("SELECT * FROM products WHERE ?", 
                                  {item_id: response.itemId}, 
                                  function(err, res) {
                    if (err != null)
                    {
                        throw err;
                    }
                    if (res.length != 0)
                    {
                        if (response.quantity < res[0].stock_quantity)
                        {
                            var quantity = parseInt(response.quantity);
                            console.log("Quantity: " + quantity);
                            var itemId = parseInt(response.itemId);
                            console.log("ItemId: " + itemId);
                            var remainingQuantity = res[0].stock_quantity - quantity;
                            var totalCost = res[0].price * quantity;
                            var updateQuery = "UPDATE products SET ? WHERE ?";
                            connection.query(updateQuery, 
                                             [{stock_quantity: remainingQuantity, product_sales: totalCost}, 
                                              {item_id: itemId}], 
                                             function(err, res) {
                                if (err != null)
                                {
                                    throw err;
                                }
                                console.log("\n" + res.affectedRows + " products updated!\n");
                                console.log("Your total cost: $" + totalCost + "\n");
                                inquirer.prompt([
                                {
                                    name: "again",
                                    type: "input",
                                    message: "Would you like to place another order, y/n?",
                                    validate: function(value) {
                                        if (isNaN(value) === false) 
                                        {
                                            return false;
                                        }
                                        else 
                                        {
                                            return true;
                                        }      
                                    }
                                }]).then(function(response) {
                                    if (response.again === "y")
                                    {
                                        saleProducts();
                                    }
                                    else
                                    {
                                        connection.end();
                                    }
                                });
                            });
                        }  
                        else
                        {
                            console.log("\nInsufficient quantity!");
                            saleProducts();
                        }
                    }
                    else
                    {
                        console.log("\nItem '" + response.itemId + "' does not exist.")
                        saleProducts();
                    }
                });
            });
        }
        else 
        {
            console.log("No products to sale.");
            connection.end();
        }
    });
}