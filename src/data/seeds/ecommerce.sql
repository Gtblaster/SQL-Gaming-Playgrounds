-- E-commerce Store Database (ShopIndia)
-- Used in World 2 Cases 2-3, 9

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL,
  rating REAL DEFAULT 0
);

CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  total_orders INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'bronze'  -- 'bronze', 'silver', 'gold'
);

CREATE TABLE transactions (
  txn_id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total_amount REAL NOT NULL,
  txn_date TEXT NOT NULL,
  payment_method TEXT NOT NULL,  -- 'UPI', 'card', 'cash', 'EMI'
  discount_pct REAL DEFAULT 0,
  status TEXT NOT NULL,           -- 'completed', 'refunded', 'pending'
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

INSERT INTO products VALUES
  (1, 'Samsung Galaxy A54', 'Electronics', 'Samsung', 28999, 45, 4.2),
  (2, 'boAt Bassheads 100', 'Electronics', 'boAt', 399, 200, 4.0),
  (3, 'Prestige Pressure Cooker', 'Kitchen', 'Prestige', 1299, 80, 4.5),
  (4, 'Nike Air Max', 'Footwear', 'Nike', 6999, 30, 4.3),
  (5, 'Himalaya Face Wash', 'Beauty', 'Himalaya', 130, 500, 4.1),
  (6, 'Kindle Paperwhite', 'Electronics', 'Amazon', 12999, 25, 4.6),
  (7, 'Levi''s 511 Jeans', 'Clothing', 'Levi''s', 2499, 60, 4.2),
  (8, 'Parle-G Biscuits (bulk)', 'Food', 'Parle', 120, 1000, 4.7),
  (9, 'Yoga Mat', 'Sports', 'Decathlon', 799, 150, 4.4),
  (10, 'Milton Water Bottle', 'Kitchen', 'Milton', 499, 300, 4.3),
  (11, 'OnePlus Buds Z2', 'Electronics', 'OnePlus', 3499, 75, 4.1),
  (12, 'Philips Air Fryer', 'Kitchen', 'Philips', 5999, 40, 4.5),
  (13, 'Raymond Suit', 'Clothing', 'Raymond', 8999, 20, 4.6),
  (14, 'Vedix Hair Oil', 'Beauty', 'Vedix', 399, 200, 3.9),
  (15, 'MI Smart TV 43"', 'Electronics', 'Xiaomi', 22999, 15, 4.0);

INSERT INTO customers VALUES
  (201, 'Aditya Shah', 'aditya@mail.com', 'Mumbai', 'Maharashtra', 12, 'gold'),
  (202, 'Bhavna Joshi', 'bhavna@mail.com', 'Surat', 'Gujarat', 5, 'silver'),
  (203, 'Chirag Malhotra', 'chirag@mail.com', 'Delhi', 'Delhi', 8, 'silver'),
  (204, 'Divya Krishnan', 'divya@mail.com', 'Chennai', 'Tamil Nadu', 3, 'bronze'),
  (205, 'Eshan Yadav', 'eshan@mail.com', 'Agra', 'UP', 1, 'bronze'),
  (206, 'Farida Shaikh', 'farida@mail.com', 'Hyderabad', 'Telangana', 15, 'gold'),
  (207, 'Ganesh Patil', 'ganesh@mail.com', 'Pune', 'Maharashtra', 7, 'silver'),
  (208, 'Hema Sundaram', 'hema@mail.com', 'Coimbatore', 'Tamil Nadu', 4, 'bronze'),
  (209, 'Ishan Chaudhary', 'ishan@mail.com', 'Jaipur', 'Rajasthan', 9, 'silver'),
  (210, 'Jyoti Mishra', 'jyoti@mail.com', 'Bhopal', 'MP', 2, 'bronze');

INSERT INTO transactions VALUES
  (3001, 201, 1, 1, 28999, 28999, '2024-01-05', 'UPI', 0, 'completed'),
  (3002, 201, 2, 2, 399, 798, '2024-01-08', 'UPI', 5, 'completed'),
  (3003, 202, 3, 1, 1299, 1299, '2024-01-10', 'card', 0, 'completed'),
  (3004, 202, 5, 3, 130, 390, '2024-01-12', 'UPI', 0, 'completed'),
  (3005, 203, 6, 1, 12999, 12999, '2024-01-15', 'card', 10, 'completed'),
  (3006, 203, 7, 2, 2499, 4998, '2024-01-18', 'UPI', 0, 'completed'),
  (3007, 204, 4, 1, 6999, 6999, '2024-01-20', 'cash', 0, 'completed'),
  (3008, 205, 8, 5, 120, 600, '2024-01-22', 'UPI', 0, 'completed'),
  (3009, 206, 15, 1, 22999, 22999, '2024-01-25', 'EMI', 0, 'completed'),
  (3010, 206, 12, 1, 5999, 5999, '2024-01-28', 'card', 5, 'completed'),
  (3011, 207, 9, 2, 799, 1598, '2024-02-01', 'UPI', 0, 'completed'),
  (3012, 207, 10, 3, 499, 1497, '2024-02-03', 'UPI', 0, 'completed'),
  (3013, 208, 5, 2, 130, 260, '2024-02-05', 'UPI', 0, 'completed'),
  (3014, 208, 14, 1, 399, 399, '2024-02-08', 'cash', 0, 'refunded'),
  (3015, 209, 11, 1, 3499, 3499, '2024-02-10', 'UPI', 0, 'completed'),
  (3016, 209, 6, 1, 12999, 11699, '2024-02-12', 'card', 10, 'completed'),
  (3017, 210, 8, 10, 120, 1200, '2024-02-14', 'UPI', 0, 'completed'),
  (3018, 201, 13, 1, 8999, 8999, '2024-02-18', 'EMI', 0, 'completed'),
  (3019, 206, 1, 1, 28999, 28999, '2024-02-20', 'EMI', 0, 'completed'),
  (3020, 203, 15, 1, 22999, 22999, '2024-02-25', 'card', 0, 'pending'),
  (3021, 201, 2, 1, 399, 399, '2024-03-01', 'UPI', 0, 'completed'),
  (3022, 206, 12, 1, 5999, 5999, '2024-03-05', 'card', 0, 'completed'),
  (3023, 209, 9, 1, 799, 799, '2024-03-08', 'UPI', 0, 'completed'),
  (3024, 202, 10, 2, 499, 998, '2024-03-10', 'UPI', 0, 'completed');
