-- Metro System Database
-- Used in World 2 Case 6

CREATE TABLE stations (
  station_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  line TEXT NOT NULL,       -- 'Red', 'Blue', 'Green', 'Yellow'
  city TEXT NOT NULL,
  daily_passengers INTEGER DEFAULT 0
);

CREATE TABLE trips (
  trip_id INTEGER PRIMARY KEY,
  passenger_id INTEGER NOT NULL,
  from_station_id INTEGER NOT NULL,
  to_station_id INTEGER NOT NULL,
  trip_date TEXT NOT NULL,
  trip_time TEXT NOT NULL,
  fare REAL NOT NULL,
  card_type TEXT NOT NULL  -- 'metro_card', 'token', 'QR'
);

INSERT INTO stations VALUES
  (1, 'Airport Terminal', 'Yellow', 'Delhi', 45000),
  (2, 'Central Park', 'Blue', 'Delhi', 120000),
  (3, 'City Hall', 'Red', 'Delhi', 98000),
  (4, 'Tech Hub', 'Green', 'Delhi', 75000),
  (5, 'Old Market', 'Red', 'Delhi', 62000),
  (6, 'University Road', 'Blue', 'Delhi', 88000),
  (7, 'Shopping Mall', 'Green', 'Delhi', 110000),
  (8, 'Hospital Gate', 'Yellow', 'Delhi', 40000),
  (9, 'South Extension', 'Red', 'Delhi', 95000),
  (10, 'East End', 'Blue', 'Delhi', 55000);

INSERT INTO trips VALUES
  (1, 1001, 1, 2, '2024-02-01', '08:15', 45, 'metro_card'),
  (2, 1002, 2, 3, '2024-02-01', '08:30', 20, 'token'),
  (3, 1003, 4, 7, '2024-02-01', '09:00', 30, 'QR'),
  (4, 1001, 2, 1, '2024-02-01', '18:30', 45, 'metro_card'),
  (5, 1004, 3, 9, '2024-02-01', '09:15', 25, 'metro_card'),
  (6, 1002, 3, 6, '2024-02-02', '08:20', 30, 'QR'),
  (7, 1005, 6, 10, '2024-02-02', '09:30', 20, 'token'),
  (8, 1003, 7, 4, '2024-02-02', '18:00', 30, 'QR'),
  (9, 1006, 5, 9, '2024-02-02', '10:00', 15, 'metro_card'),
  (10, 1007, 8, 2, '2024-02-03', '08:45', 35, 'metro_card'),
  (11, 1001, 1, 7, '2024-02-03', '09:00', 50, 'metro_card'),
  (12, 1008, 2, 6, '2024-02-03', '09:30', 25, 'token'),
  (13, 1005, 10, 6, '2024-02-04', '08:15', 20, 'QR'),
  (14, 1009, 3, 7, '2024-02-04', '09:45', 35, 'metro_card'),
  (15, 1010, 4, 2, '2024-02-04', '08:00', 30, 'metro_card');
