// connect.js

const mysql = require('mysql');

let db;

const connectToMySQL = () => {
  const config = {
    host: 'localhost', // Your MySQL server address
    user: 'root', // Your MySQL username
    password: '', // Your MySQL password (if any)
    port: 3306, // Default MySQL port
    database: 'analysto', // Your database name
  };

  db = mysql.createConnection(config);

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL server:', err.message);
    } else {
      console.log('Connected to MySQL server.');
      // Proceed with your queries or other operations
    }
  });
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectToMySQL() first.');
  }
  return db;
};

module.exports = { connectToMySQL, getDatabase };
