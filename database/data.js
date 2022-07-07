const sqlite = require('sqlite3').verbose(); 
const db = new sqlite.Database("./database/data.sqlite3");

module.exports = db;