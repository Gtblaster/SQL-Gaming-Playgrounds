-- City Library Database
-- Used in World 1 Cases 3-4

CREATE TABLE books (
  book_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  genre TEXT NOT NULL,
  year_published INTEGER NOT NULL,
  total_copies INTEGER NOT NULL,
  available_copies INTEGER NOT NULL
);

CREATE TABLE members (
  member_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  membership_type TEXT NOT NULL,  -- 'basic', 'premium'
  joined_date TEXT NOT NULL,
  city TEXT NOT NULL
);

CREATE TABLE loans (
  loan_id INTEGER PRIMARY KEY,
  book_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  loan_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  return_date TEXT,          -- NULL if not returned yet
  fine_amount REAL DEFAULT 0,
  FOREIGN KEY (book_id) REFERENCES books(book_id),
  FOREIGN KEY (member_id) REFERENCES members(member_id)
);

INSERT INTO books VALUES
  (1, 'The Alchemist', 'Paulo Coelho', 'Fiction', 1988, 5, 2),
  (2, 'Wings of Fire', 'A.P.J. Abdul Kalam', 'Biography', 1999, 4, 1),
  (3, 'Malgudi Days', 'R.K. Narayan', 'Fiction', 1943, 3, 3),
  (4, 'Train to Pakistan', 'Khushwant Singh', 'Historical Fiction', 1956, 2, 0),
  (5, 'The God of Small Things', 'Arundhati Roy', 'Fiction', 1997, 3, 2),
  (6, 'Sapiens', 'Yuval Noah Harari', 'Non-fiction', 2011, 6, 4),
  (7, 'Atomic Habits', 'James Clear', 'Self-help', 2018, 5, 3),
  (8, 'Rich Dad Poor Dad', 'Robert Kiyosaki', 'Finance', 1997, 4, 2),
  (9, 'Harry Potter', 'J.K. Rowling', 'Fantasy', 1997, 7, 5),
  (10, 'To Kill a Mockingbird', 'Harper Lee', 'Fiction', 1960, 3, 1),
  (11, 'The Lean Startup', 'Eric Ries', 'Business', 2011, 3, 3),
  (12, 'Data Science for Beginners', 'John Smith', 'Technology', 2020, 4, 4),
  (13, 'Python Crash Course', 'Eric Matthes', 'Technology', 2019, 5, 2),
  (14, 'The Monk Who Sold His Ferrari', 'Robin Sharma', 'Self-help', 1997, 4, 4),
  (15, 'Ikigai', 'Hector Garcia', 'Self-help', 2016, 3, 2);

INSERT INTO members VALUES
  (101, 'Kavya Rao', 'kavya@email.com', 'premium', '2022-06-01', 'Bangalore'),
  (102, 'Deepak Sharma', 'deepak@email.com', 'basic', '2023-01-15', 'Delhi'),
  (103, 'Sunita Verma', 'sunita@email.com', 'premium', '2022-09-20', 'Mumbai'),
  (104, 'Harish Patel', 'harish@email.com', 'basic', '2023-03-10', 'Ahmedabad'),
  (105, 'Lalitha Nair', 'lalitha@email.com', 'premium', '2021-12-05', 'Kochi'),
  (106, 'Mohit Gupta', 'mohit@email.com', 'basic', '2023-05-18', 'Lucknow'),
  (107, 'Preeti Joshi', 'preeti@email.com', 'basic', '2023-07-22', 'Pune'),
  (108, 'Rajan Menon', 'rajan@email.com', 'premium', '2022-02-14', 'Chennai');

INSERT INTO loans VALUES
  (2001, 1, 101, '2024-01-05', '2024-01-19', '2024-01-18', 0),
  (2002, 2, 102, '2024-01-10', '2024-01-24', NULL, 0),
  (2003, 4, 103, '2024-01-12', '2024-01-26', '2024-01-30', 20),
  (2004, 6, 101, '2024-01-20', '2024-02-03', '2024-02-03', 0),
  (2005, 9, 104, '2024-01-22', '2024-02-05', NULL, 0),
  (2006, 7, 105, '2024-01-25', '2024-02-08', '2024-02-10', 10),
  (2007, 3, 106, '2024-02-01', '2024-02-15', '2024-02-14', 0),
  (2008, 10, 107, '2024-02-05', '2024-02-19', NULL, 0),
  (2009, 5, 108, '2024-02-08', '2024-02-22', '2024-02-22', 0),
  (2010, 12, 101, '2024-02-10', '2024-02-24', '2024-02-20', 0),
  (2011, 13, 102, '2024-02-12', '2024-02-26', NULL, 0),
  (2012, 8, 103, '2024-02-15', '2024-03-01', '2024-03-05', 15),
  (2013, 1, 104, '2024-02-18', '2024-03-03', NULL, 0),
  (2014, 15, 105, '2024-02-20', '2024-03-05', '2024-03-04', 0),
  (2015, 11, 106, '2024-03-01', '2024-03-15', NULL, 0);
