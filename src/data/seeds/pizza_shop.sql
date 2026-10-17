-- Pizza Palace Database
-- Used in World 1 Cases 1-2 and World 2 Cases 1, 9

CREATE TABLE pizzas (
  pizza_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,  -- 'veg', 'non-veg'
  price REAL NOT NULL,
  size TEXT NOT NULL       -- 'small', 'medium', 'large'
);

CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  joined_date TEXT NOT NULL
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  pizza_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  total_price REAL NOT NULL,
  order_date TEXT NOT NULL,
  discount_code TEXT,
  status TEXT NOT NULL,   -- 'delivered', 'cancelled', 'pending'
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (pizza_id) REFERENCES pizzas(pizza_id)
);

INSERT INTO pizzas VALUES
  (1, 'Margherita', 'veg', 199, 'small'),
  (2, 'Margherita', 'veg', 299, 'medium'),
  (3, 'Margherita', 'veg', 399, 'large'),
  (4, 'Paneer Tikka', 'veg', 249, 'small'),
  (5, 'Paneer Tikka', 'veg', 349, 'medium'),
  (6, 'Paneer Tikka', 'veg', 449, 'large'),
  (7, 'Chicken BBQ', 'non-veg', 299, 'small'),
  (8, 'Chicken BBQ', 'non-veg', 399, 'medium'),
  (9, 'Chicken BBQ', 'non-veg', 499, 'large'),
  (10, 'Farmhouse', 'veg', 279, 'medium'),
  (11, 'Pepperoni', 'non-veg', 349, 'medium'),
  (12, 'Cheese Burst', 'veg', 499, 'large');

INSERT INTO customers VALUES
  (1, 'Priya Sharma', 'Mumbai', '9876543210', '2023-01-15'),
  (2, 'Rohan Mehta', 'Delhi', '9876543211', '2023-02-20'),
  (3, 'Anjali Patel', 'Ahmedabad', '9876543212', '2023-01-05'),
  (4, 'Vikram Singh', 'Jaipur', '9876543213', '2023-03-10'),
  (5, 'Sneha Reddy', 'Hyderabad', '9876543214', '2023-04-18'),
  (6, 'Arjun Kumar', 'Bangalore', '9876543215', '2023-02-28'),
  (7, 'Meera Nair', 'Kochi', '9876543216', '2023-05-05'),
  (8, 'Ravi Gupta', 'Lucknow', '9876543217', '2023-01-22'),
  (9, 'Pooja Joshi', 'Pune', '9876543218', '2023-06-12'),
  (10, 'Amit Verma', 'Chennai', '9876543219', '2023-07-01');

INSERT INTO orders VALUES
  (1001, 1, 2, 2, 598, '2024-01-10', 'SHADOW42', 'delivered'),
  (1002, 1, 5, 1, 349, '2024-01-15', 'SHADOW42', 'delivered'),
  (1003, 1, 8, 1, 399, '2024-02-01', 'SHADOW42', 'delivered'),
  (1004, 2, 3, 1, 399, '2024-01-12', NULL, 'delivered'),
  (1005, 2, 7, 2, 598, '2024-01-20', NULL, 'delivered'),
  (1006, 3, 10, 1, 279, '2024-01-08', NULL, 'delivered'),
  (1007, 3, 12, 1, 499, '2024-02-14', NULL, 'delivered'),
  (1008, 4, 1, 3, 597, '2024-01-25', NULL, 'delivered'),
  (1009, 5, 11, 1, 349, '2024-02-05', NULL, 'pending'),
  (1010, 5, 9, 1, 499, '2024-02-10', NULL, 'delivered'),
  (1011, 6, 4, 2, 498, '2024-01-30', NULL, 'delivered'),
  (1012, 6, 6, 1, 449, '2024-02-20', 'WELCOME', 'delivered'),
  (1013, 7, 2, 1, 299, '2024-01-18', NULL, 'cancelled'),
  (1014, 7, 8, 2, 798, '2024-02-22', NULL, 'delivered'),
  (1015, 8, 5, 1, 349, '2024-01-05', NULL, 'delivered'),
  (1016, 9, 3, 1, 399, '2024-02-08', NULL, 'delivered'),
  (1017, 10, 11, 2, 698, '2024-01-28', 'SHADOW42', 'delivered'),
  (1018, 2, 12, 1, 499, '2024-03-01', NULL, 'pending'),
  (1019, 3, 8, 1, 399, '2024-03-05', NULL, 'delivered'),
  (1020, 1, 3, 2, 798, '2024-03-10', 'SHADOW42', 'pending');
