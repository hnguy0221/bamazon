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
    processSupervisor();
});

var processSupervisor = function()
{
    inquirer.prompt({
        type: "list",
        message: "Menu options:",
        choices: ["View Products Sales By Department", 
                    "Create New Department", 
                    "Exit"],
        name: "option"
    }).then(function(response) {
        switch(response.option)
        {
            case "View Products Sales By Department":
                viewProductsByDept();
                break;
            case "Create New Department":
                addNewDept();
                break;
            case "Exit":
                connection.end();
                break;
            default:
                console.log("Unknown option");
        }
    });
}

var viewProductsByDept = function()
{
    var selectQuery = "SELECT D.department_id, D.department_name, D.over_head_costs, P.product_sales, " +
                      "(P.product_sales - D.over_head_costs) AS total_profit " + 
                      "FROM products AS P inner join departments AS D " + 
                      "ON P.department_id = D.department_id " +
                      "GROUP BY D.department_name";
    connection.query(selectQuery, function(err, res)
    {
        if (err != null)
        {
            throw err;
        }
        if (res.length != 0)
        {
            console.table(["department_id", 
                "product_name", 
                "over_head_costs", 
                "product_sales", 
                "total_profit"], res);
        }
        else
        {
            console.log("No rows selected.");
        }
        processSupervisor();
    });
}

var addNewDept = function()
{
    inquirer.prompt([
    {
        name: "deptName",
        type: "input",
        message: "Please enter the department name: ",
    },
    {
        name: "overHeadCost",
        type: "input",
        message: "Please enter over head cost: ",
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
        var deptName = response.deptName;
        var overHeadCost = response.overHeadCost;
        var insertQuery = "INSERT INTO departments SET ?";
        connection.query(insertQuery,
                         {
                             department_name: deptName,
                             over_head_costs: overHeadCost
                         }, function(err, res) {
            if (err != null)
            {
                throw err;
            }
            console.log("\n" + res.affectedRows + " department inserted!\n");
            processSupervisor();
        });
    });
}
