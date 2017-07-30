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
    processManager();
});

var processManager = function()
{
    inquirer.prompt({
        type: "list",
        message: "Menu options:",
        choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product", "Exit"],
        name: "option"
    }).then(function(response) {
        switch(response.option)
        {
            case "View Products For Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add To Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "Exit":
                connection.end();
                break;
            default:
                console.log("Unknown option");
        }
    });
}

var viewProducts = function()
{
    connection.query("SELECT * FROM products", function(err, res)
    {
        if (err != null)
        {
            throw err;
        }
        if (res.length != 0)
        {
            console.log("\nItems available for sale:\n");
            console.table(["item_id", 
                            "product_name", 
                            "department_name", 
                            "price", 
                            "stock_quantity"], res);
        }
        else
        {
            console.log("No rows selected.");
        }
        processManager();
    });
}

var viewLowInventory = function()
{
    connection.query("SELECT * FROM products GROUP BY product_name, " +
        "department_name HAVING stock_quantity < 5", function(err, res)
    {
        if (err != null)
        {
            throw err;
        }
        if (res.length != 0)
        {
            console.log("\nItems available for sale:\n");
            console.table(["item_id", 
                            "product_name", 
                            "department_name", 
                            "price", 
                            "stock_quantity"], res);
        }
        else
        {
            console.log("No rows selected.");
        }
        processManager();
    });
}

var addToInventory = function()
{
    connection.query("SELECT * FROM products ORDER BY item_id", function(err, res)
    {
        if (err != null)
        {
            throw err;
        }
        if (res.length != 0)
        {
            var len = res.length;
            var min = res[0].item_id;
            var max = res[len-1].item_id;
            console.log("\nItems available for sale:\n");
            console.table(["item_id", 
                            "product_name", 
                            "department_name", 
                            "price", 
                            "stock_quantity"], res);
            inquirer.prompt([
            {
                name: "itemId",
                type: "input",
                message: "Please select the item id you would like to add to inventory:",
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
                message: "How many units of the product would you add?",
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
                        var quantity = parseInt(response.quantity);
                        //console.log("Quantity: " + quantity);
                        var itemId = parseInt(response.itemId);
                        //console.log("ItemId: " + itemId);
                        var remainingQuantity = res[0].stock_quantity + quantity;
                        var updateQuery = "UPDATE products SET ? WHERE ?";
                        connection.query(updateQuery, 
                                         [{stock_quantity: remainingQuantity}, 
                                          {item_id: itemId}], function(err, res) {
                            if (err != null)
                            {
                                throw err;
                            }
                            console.log("\n" + res.affectedRows + " products updated!\n");
                        });
                    }
                    else 
                    {
                        console.log("No row to update");
                    }
                    processManager();
                });
            });
        }
    });
}

var addNewProduct = function()
{
    inquirer.prompt([
    {
        name: "productName",
        type: "input",
        message: "Please enter product name:"
    },
    {   
        name: "deptName",
        type: "input",
        message: "Please enter the department name: ",
    },
    {   
        name: "price",
        type: "input",
        message: "Please enter the price",
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
    },
    {   
        name: "quantity",
        type: "input",
        message: "Please enter the stock quantity:",
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
        var productName = response.productName;
        var deptName = response.deptName;
        var price = response.price;
        var stockQuantity = response.quantity;
        var insertQuery = "INSERT INTO products SET ?";
        connection.query(insertQuery, 
                         {
                             product_name: productName,
                             department_name: deptName,
                             price: price,
                             stock_quantity: stockQuantity
                         }, function(err, res) {
            if (err != null)
            {
                throw err;
            }
            console.log("\n" + res.affectedRows + " product inserted!\n");
            processManager();
        });
    });
}
