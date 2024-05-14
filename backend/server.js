// Import required modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

// Initialize Express app
const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json()); // Parse incoming JSON requests

// Set up MySQL database connection
const db = mysql.createConnection({
  host: "host.docker.internal", // Use service name defined in docker-compose.yml
  user: process.env.MYSQLDB_USER,
  password: process.env.MYSQLDB_ROOT_PASSWORD,
  database: process.env.MYSQLDB_DATABASE,
  connectionLimit: 10,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err.message);
  } else {
    console.log("Connected to the MySQL database.");
  }
});

// Create table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS usage_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    device VARCHAR(255),
    url VARCHAR(255),
    duration INT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error("Error creating table:", err.message);
  } else {
    console.log("Table created or already exists.");
  }
});

// Endpoint to insert data
app.post("/data", (req, res) => {
  const { username, device, url, duration } = req.body;
  const inserted_sql =
    "INSERT INTO usage_data (username, device, url, duration) VALUES (?, ?, ?, ?)";
  db.query(inserted_sql, [username, device, url, duration], function (err) {
    if (err) {
      res.status(500).send(err.message);
    }

    const updated_sql = "UPDATE usage_data SET username = ? WHERE device = ?";
    db.query(updated_sql, [username, device], function (err) {
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

  db.query(sql, [], (err, rows) => {
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
