-- Cricket League Database (IPL-inspired)
-- Used in World 1 Cases 5-6, World 2 Cases 4-5

CREATE TABLE teams (
  team_id INTEGER PRIMARY KEY,
  team_name TEXT NOT NULL,
  city TEXT NOT NULL,
  captain TEXT NOT NULL,
  founded_year INTEGER NOT NULL
);

CREATE TABLE players (
  player_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  team_id INTEGER NOT NULL,
  role TEXT NOT NULL,   -- 'batsman', 'bowler', 'all-rounder', 'wicket-keeper'
  country TEXT NOT NULL,
  age INTEGER NOT NULL,
  FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE TABLE match_stats (
  stat_id INTEGER PRIMARY KEY,
  player_id INTEGER NOT NULL,
  match_id INTEGER NOT NULL,
  season INTEGER NOT NULL,
  runs_scored INTEGER DEFAULT 0,
  balls_faced INTEGER DEFAULT 0,
  wickets_taken INTEGER DEFAULT 0,
  overs_bowled REAL DEFAULT 0,
  catches INTEGER DEFAULT 0,
  FOREIGN KEY (player_id) REFERENCES players(player_id)
);

CREATE TABLE matches (
  match_id INTEGER PRIMARY KEY,
  season INTEGER NOT NULL,
  team1_id INTEGER NOT NULL,
  team2_id INTEGER NOT NULL,
  match_date TEXT NOT NULL,
  venue TEXT NOT NULL,
  winner_id INTEGER,
  total_runs_team1 INTEGER,
  total_runs_team2 INTEGER,
  FOREIGN KEY (team1_id) REFERENCES teams(team_id),
  FOREIGN KEY (team2_id) REFERENCES teams(team_id)
);

INSERT INTO teams VALUES
  (1, 'Mumbai Warriors', 'Mumbai', 'Rohit Sharma', 2008),
  (2, 'Chennai Kings', 'Chennai', 'MS Dhoni', 2008),
  (3, 'Bangalore Rockets', 'Bangalore', 'Virat Kohli', 2008),
  (4, 'Delhi Dynamos', 'Delhi', 'Rishabh Pant', 2008),
  (5, 'Kolkata Knights', 'Kolkata', 'Shreyas Iyer', 2008),
  (6, 'Rajasthan Royals', 'Jaipur', 'Sanju Samson', 2008);

INSERT INTO players VALUES
  (1, 'Arjun Patel', 1, 'batsman', 'India', 28),
  (2, 'Rohit Verma', 1, 'all-rounder', 'India', 32),
  (3, 'Siddharth Rao', 1, 'bowler', 'India', 25),
  (4, 'Ajay Menon', 2, 'batsman', 'India', 30),
  (5, 'Pradeep Kumar', 2, 'bowler', 'India', 27),
  (6, 'Karan Singh', 3, 'all-rounder', 'India', 26),
  (7, 'Dev Nair', 3, 'batsman', 'India', 24),
  (8, 'Vijay Reddy', 4, 'bowler', 'India', 29),
  (9, 'Nikhil Gupta', 4, 'wicket-keeper', 'India', 23),
  (10, 'Suresh Jha', 5, 'batsman', 'India', 31),
  (11, 'Manish Tiwari', 5, 'all-rounder', 'India', 28),
  (12, 'Ravi Sharma', 6, 'batsman', 'India', 27),
  (13, 'Ben Smith', 3, 'all-rounder', 'Australia', 30),
  (14, 'Jake Williams', 1, 'bowler', 'Australia', 26),
  (15, 'Chris Brown', 2, 'batsman', 'West Indies', 29);

INSERT INTO matches VALUES
  (101, 2024, 1, 2, '2024-03-22', 'Wankhede Stadium', 1, 186, 172),
  (102, 2024, 3, 4, '2024-03-23', 'M. Chinnaswamy Stadium', 3, 201, 195),
  (103, 2024, 5, 6, '2024-03-24', 'Eden Gardens', 5, 178, 163),
  (104, 2024, 1, 3, '2024-03-26', 'Wankhede Stadium', 3, 165, 167),
  (105, 2024, 2, 5, '2024-03-27', 'MA Chidambaram Stadium', 2, 189, 181),
  (106, 2024, 4, 6, '2024-03-28', 'Arun Jaitley Stadium', 6, 155, 160),
  (107, 2024, 1, 5, '2024-03-30', 'Wankhede Stadium', 1, 210, 188),
  (108, 2024, 2, 3, '2024-03-31', 'MA Chidambaram Stadium', 2, 172, 168),
  (109, 2024, 4, 5, '2024-04-01', 'Arun Jaitley Stadium', 5, 143, 147),
  (110, 2024, 6, 1, '2024-04-02', 'SMS Stadium', 1, 160, 165);

INSERT INTO match_stats VALUES
  (1, 1, 101, 2024, 67, 48, 0, 0, 1),
  (2, 2, 101, 2024, 34, 22, 2, 4, 0),
  (3, 3, 101, 2024, 12, 10, 3, 4, 1),
  (4, 4, 101, 2024, 45, 38, 0, 0, 0),
  (5, 5, 101, 2024, 8, 6, 1, 2, 0),
  (6, 1, 104, 2024, 23, 19, 0, 0, 0),
  (7, 2, 104, 2024, 41, 30, 1, 3, 1),
  (8, 6, 102, 2024, 88, 55, 1, 2, 2),
  (9, 7, 102, 2024, 54, 41, 0, 0, 1),
  (10, 13, 102, 2024, 32, 25, 2, 3, 0),
  (11, 10, 103, 2024, 76, 52, 0, 0, 0),
  (12, 11, 103, 2024, 43, 35, 2, 4, 1),
  (13, 12, 106, 2024, 91, 60, 0, 0, 2),
  (14, 1, 107, 2024, 112, 70, 0, 0, 1),
  (15, 14, 107, 2024, 4, 5, 4, 4, 0);
