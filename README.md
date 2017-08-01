# Bamazon Appliction

Hello,

My name is Hai Nguyen. I created this application as part of the homework assignment for the Full Stack Web Development class I am taking at the University of Denver. It is an application that works like you purchase stuff from the Amazon. It is written in Node JavaScript and it uses Inquirer to prompt the user for inputs, MySql database to store the data, and Console.Table to format output. It consists of four pieces: Customer, Manager, Supervisor, and the database.

1. bamazon.sql (https://github.com/hnguy0221/bamazon/blob/master/bamazon.sql) - To run the application, please run the the SQL statements in this file to create the database and the tables.

2. bamazonCustomer.js (https://github.com/hnguy0221/bamazon/blob/master/assets/javascript/bamazonCustomer.js) - It is run as `node bamazonSupervisor.js` from the command line - This application will take in orders from customers and update the store's inventory. 

	* When it is first run, it will display a menu of two options:
		* Purchase Products
		* Exit

		![Image of Customer Main Menu](https://github.com/hnguy0221/bamazon/blob/master/assets/images/CustomerMainMeu.png)

	* When the user selects option, Purchase Products, a list of products will be displayed. The user then can select whatever product they would like to purchase and how many. 

	* The application then updates the store's inventory and prints out the total cost.

		![Image of Customer Purchase Order](https://github.com/hnguy0221/bamazon/blob/master/assets/images/CustomerPurchaseOrder.png)

	* If the user selects option, 'Exit', it will exit the program.

3. bamazonManager.js (https://github.com/hnguy0221/bamazon/blob/master/assets/javascript/bamazonManager.js) - It is run as `node bamazonSupervisor.js` from the command line - Running this application will display a list of menu options:

	* List a set of menu options:

   		* View Products for Sale
    
    	* View Low Inventory
    
    	* Add to Inventory
    
    	* Add New Product

    	![Image of Manager Main Menu](https://github.com/hnguy0221/bamazon/blob/master/assets/images/ManagerMainMenu.png)

  		* If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

  		* If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

  		* If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

	
  		* If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

4. bamazonSupervisor.js (https://github.com/hnguy0221/bamazon/blob/master/assets/javascript/bamazonSupervisor.js) - It is run as `node bamazonSupervisor.js` from the command line - Running this application will list a set of menu options:

	* View Product Sales by Department
   
	* Create New Department

	![Image of Products Sales by Department](https://github.com/hnguy0221/bamazon/blob/master/assets/images/SupervisorMainMenu.png)

	* When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window.

	![Image of Products Sales by Department](https://github.com/hnguy0221/bamazon/blob/master/assets/images/ProductsSalesByDepartment.png)

	| department_id | department_name | over_head_costs | product_sales | total_profit |
	| ------------- | --------------- | --------------- | ------------- | ------------ |
	| 01            | Electronics     | 10000           | 20000         | 10000        |	
	| 02            | Clothing        | 60000           | 100000        | 40000        |