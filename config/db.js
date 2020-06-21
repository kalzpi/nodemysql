const mysql = require("mysql");
const config = require("config");

const db = mysql.createPool({
  host: config.get("host"),
  user: config.get("user"),
  password: config.get("password"),
  database: config.get("database"),
});

module.exports = db;
