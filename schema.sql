DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

CREATE TABLE products(
	item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price FLOAT NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments(
	department_id INTEGER NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(100) NOT NULL,
    over_head_costs FLOAT NOT NULL,
    PRIMARY KEY (department_id)
);