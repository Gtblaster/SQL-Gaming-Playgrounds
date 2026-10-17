-- Hospital Database
-- Used in World 2 Case 7

CREATE TABLE doctors (
  doctor_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  rating REAL DEFAULT 0,
  consultation_fee INTEGER NOT NULL
);

CREATE TABLE patients (
  patient_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  city TEXT NOT NULL
);

CREATE TABLE appointments (
  appt_id INTEGER PRIMARY KEY,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  appt_date TEXT NOT NULL,
  appt_time TEXT NOT NULL,
  status TEXT NOT NULL,         -- 'completed', 'scheduled', 'cancelled'
  diagnosis TEXT,
  fee_paid REAL DEFAULT 0,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

INSERT INTO doctors VALUES
  (1, 'Dr. Priya Kapoor', 'Cardiology', 15, 4.8, 800),
  (2, 'Dr. Ramesh Iyer', 'Orthopedics', 10, 4.5, 600),
  (3, 'Dr. Sunita Bose', 'Pediatrics', 12, 4.9, 500),
  (4, 'Dr. Arun Malhotra', 'Dermatology', 8, 4.3, 400),
  (5, 'Dr. Kavita Sharma', 'Neurology', 20, 4.7, 1000),
  (6, 'Dr. Ranjit Nair', 'General Medicine', 5, 4.2, 300);

INSERT INTO patients VALUES
  (301, 'Alok Tiwari', 45, 'M', 'A+', 'Bhopal'),
  (302, 'Babita Roy', 32, 'F', 'O-', 'Kolkata'),
  (303, 'Chandran Pillai', 58, 'M', 'B+', 'Kochi'),
  (304, 'Daksha Mehta', 27, 'F', 'AB+', 'Vadodara'),
  (305, 'Eknath Jadhav', 61, 'M', 'O+', 'Nashik'),
  (306, 'Falguni Desai', 40, 'F', 'A-', 'Rajkot'),
  (307, 'Govind Negi', 35, 'M', 'B-', 'Dehradun'),
  (308, 'Harsha Reddy', 22, 'F', 'A+', 'Visakhapatnam'),
  (309, 'Irfan Khan', 50, 'M', 'O+', 'Lucknow'),
  (310, 'Janhavi Patil', 8, 'F', 'AB-', 'Aurangabad');

INSERT INTO appointments VALUES
  (4001, 301, 1, '2024-01-10', '10:00', 'completed', 'Hypertension', 800),
  (4002, 302, 3, '2024-01-11', '11:00', 'completed', 'Flu', 500),
  (4003, 303, 1, '2024-01-12', '09:00', 'completed', 'Angina', 800),
  (4004, 304, 4, '2024-01-13', '14:00', 'completed', 'Eczema', 400),
  (4005, 305, 2, '2024-01-14', '15:00', 'completed', 'Knee Pain', 600),
  (4006, 306, 5, '2024-01-15', '10:30', 'completed', 'Migraine', 1000),
  (4007, 307, 6, '2024-01-16', '11:30', 'scheduled', NULL, 0),
  (4008, 308, 3, '2024-01-17', '09:30', 'completed', 'Tonsillitis', 500),
  (4009, 309, 1, '2024-01-18', '10:00', 'cancelled', NULL, 0),
  (4010, 310, 3, '2024-01-19', '11:00', 'completed', 'Viral Fever', 500),
  (4011, 301, 5, '2024-02-01', '10:00', 'completed', 'Follow-up', 1000),
  (4012, 303, 2, '2024-02-05', '14:00', 'completed', 'Arthritis', 600),
  (4013, 305, 1, '2024-02-08', '09:00', 'completed', 'Chest Pain', 800),
  (4014, 306, 6, '2024-02-10', '12:00', 'scheduled', NULL, 0),
  (4015, 309, 5, '2024-02-12', '10:30', 'completed', 'Headache', 1000);
