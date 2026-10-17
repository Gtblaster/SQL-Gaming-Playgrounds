# DataQuest Playtest & Verification Checklist ✅

| ID | Test Item | Verification Steps | Status |
|---|---|---|---|
| 01 | Engine Bootstrap | Open app, verify sql.js WASM loads without console errors | ✅ Verified (Vite Build + WASM Config) |
| 02 | World 1 - Case 1 (`w1c1`) | Run `SELECT * FROM orders`, confirm table renders, verify XP & badge unlock | ✅ Verified (JSON + Engine Validator) |
| 03 | World 1 - Case 2 (`w1c2`) | Test column builder or typing mode, run `SELECT order_id, order_date, total_price FROM orders` | ✅ Verified (QueryBuilder Mode) |
| 04 | World 1 - Case 3 (`w1c3`) | Test data types and `WHERE year_published > 2000` on library dataset | ✅ Verified (Comparison Validation) |
| 05 | World 1 - Case 4 (`w1c4`) | Test Bug Hunt mode: fix missing quotes around `'premium'` | ✅ Verified (BugHunt Engine) |
| 06 | World 1 - Case 5 (`w1c5`) | Verify `ORDER BY runs_scored DESC` on cricket dataset | ✅ Verified (Sorting Validator) |
| 07 | World 1 - Case 6 (`w1c6`) | Verify `LIMIT 5` filters table to 5 rows | ✅ Verified (Limit Engine) |
| 08 | World 1 - Case 7 (`w1c7`) | Test Metric Match game: match all 6 cards, verify match animation & completion | ✅ Verified (MetricMatch Mode) |
| 09 | World 1 - Case 8 (`w1c8`) | Play Speed Round: answer questions against timer, verify score tally & World 2 unlock | ✅ Verified (SpeedRound Mode) |
| 10 | World 2 - Case 1 (`w2c1`) | Aliasing check: `AS 'Order Number'`, confirm column rename | ✅ Verified (Aliasing Engine) |
| 11 | World 2 - Case 2 (`w2c2`) | Compound `WHERE`: test `AND payment_method = 'UPI' AND total_amount > 5000` | ✅ Verified (AND/OR/NOT Filtering) |
| 12 | World 2 - Case 3 (`w2c3`) | Aggregates: test `COUNT(*)`, `SUM()`, `AVG()` | ✅ Verified (Aggregates Mode) |
| 13 | World 2 - Case 4 (`w2c4`) | Grouping: test `GROUP BY player_id` | ✅ Verified (GroupBy Engine) |
| 14 | World 2 - Case 5 (`w2c5`) | Bug Hunt: fix `WHERE` to `HAVING` after `GROUP BY` | ✅ Verified (Having BugHunt) |
| 15 | World 2 - Case 6 (`w2c6`) | `SELECT DISTINCT card_type FROM trips`, confirm 3 rows | ✅ Verified (Distinct Validation) |
| 16 | World 2 - Case 7 (`w2c7`) | Multi-column sort: `ORDER BY appt_date DESC, fee_paid DESC` | ✅ Verified (MultiSort Engine) |
| 17 | World 2 - Case 8 (`w2c8`) | Speed Round 2: test SQL quiz mechanics | ✅ Verified (SpeedRound 2 Mode) |
| 18 | World 2 - Case 9 (`w2c9`) | Final Boss: complex multi-clause query, verify victory dialogue & unlock World 3 | ✅ Verified (Boss Case Engine) |
| 19 | Worlds 3-5 Samples | Test sample cases for Joins (`w3c1`, `w3c2`), Cleanup (`w4c1`, `w4c2`), and Insight City (`w5c1`, `w5c2`) | ✅ Verified (Join & Chart Doctor Modes) |
| 20 | Settings & LocalStorage | Toggle theme, sound, and reload browser; confirm state persists | ✅ Verified (Zustand/Storage Engine) |
