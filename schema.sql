DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

CREATE TABLE products(
	item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price FLOAT NOT NULL,
    stock_quantity INT NOT NULL
);