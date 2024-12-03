// lib/db.js
const sql = require('mssql');

// Define the configuration for your database connection
const config = {
  user: process.env.DATABASE_USER || '',
  password: process.env.DATABASE_PASSWORD || '',
  server: process.env.DATABASE_HOST || '',
  database: process.env.DATABASE_NAME || '',
  options: {
    encrypt: false, // Set to true if encryption is required
    trustServerCertificate: true, // Use true if connecting to a server with a self-signed certificate
    enableArithAbort: true, 
    
  },
};

// Connection pool (reusable connection)
let poolPromise: any;

const getConnection = async () => {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
};

export { sql, getConnection };

  