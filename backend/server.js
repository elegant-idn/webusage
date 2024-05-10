// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

// Initialize Express app
const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json()); // Parse incoming JSON requests

// Initialize SQLite in-memory database
const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the in-memory SQLite database.");
  }
});

// Create table if it doesn't exist
db.run(
  "CREATE TABLE IF NOT EXISTS usage_data (id INTEGER PRIMARY KEY, username TEXT, device TEST, url TEXT, duration INTEGER, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)",
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Table created or already exists.");
    }
  }
);

// Endpoint to insert data
app.post("/data", (req, res) => {
  const { username, device, url, duration } = req.body;
  const inserted_sql =
    "INSERT INTO usage_data (username, device, url, duration) VALUES (?, ?, ?, ?)";
  db.run(inserted_sql, [username, device, url, duration], function (err) {
    if (err) {
      res.status(500).send(err.message);
    }

    const updated_sql = "UPDATE usage_data SET username = ? WHERE device = ?";
    db.run(updated_sql, [username, device], function (err) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(200).send(`Username updated for ${this.changes} records`);
      }
    });
  });
});

// Endpoint to retrieve filtered data
app.get("/data", (req, res) => {
  let sql = "SELECT * FROM usage_data";
  const { username, url, duration } = req.query;

  let filters = [];
  if (username) filters.push(`username LIKE '%${username}%'`);
  if (url) filters.push(`url LIKE '%${url}%'`);
  if (duration) {
    const currentTime = new Date().getTime();
    if (duration === "pastHour") {
      filters.push(`timestamp >= ${currentTime - 3600000}`); // Past hour in milliseconds
    } else if (duration === "past24Hours") {
      filters.push(`timestamp >= ${currentTime - 86400000}`); // Past 24 hours in milliseconds
    } else if (duration === "pastWeek") {
      filters.push(`timestamp >= ${currentTime - 604800000}`); // Past week in milliseconds
    }
  }

  if (filters.length > 0) {
    sql += " WHERE " + filters.join(" AND ");
  }
  sql += " ORDER BY timestamp DESC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json(rows);
    }
  });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
