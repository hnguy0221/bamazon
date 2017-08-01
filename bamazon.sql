DROP DATABASE IF EXISTS bamazon;
create database bamazon;
use bamazon;

create table products
(
    item_id int auto_increment not null,
    product_name varchar(50) not null,
    department_name varchar(50) not null,
    price decimal(10,2) null,
    stock_quantity int null,
    primary key (item_id)
);

create table departments
(
    department_id int auto_increment not null,
    department_name varchar(50) not null,
    over_head_costs decimal(10,2) null,
    primary key (department_id)
);

alter table products add column department_id int null;

ALTER TABLE products
  ADD FOREIGN KEY (department_id) REFERENCES departments (department_id);

CREATE INDEX product_name_index_1 ON products (product_name);

CREATE INDEX department_name_index_1 ON products (department_name);

CREATE INDEX department_name_index_1 ON departments (department_name);

insert into products (product_name, department_name, price, stock_quantity)
values ('Dog Pillow', 'Pets', 24.99, 100),  
           ('Pedigree Dog Food', 'Pets', 24.99, 120), 
           ('Pedigree Dog Beef Jerky', 'Pets', 9.99, 140),
           ('Dog Leesh', 'Pets' , 5.99, 160),
           ('Dog Comb', 'Pets', 4.99, 180),
           ('Dog Shampoo', 'Pets', 2.99, 200),
           ('Dog Bones', 'Pets', 14.99, 220),
           ('Dog Toy', 'Pets', 1.99, 240),
           ('Dog Bed', 'Pets', 44.99, 260),
           ('Dog Collar', 'Pets', 1.99, 280);
           
select p.* from products as p;

select d.* from departments as d;
