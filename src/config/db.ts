import sql, { ConnectionPool } from 'mssql';

let pool: ConnectionPool | null = null;

// Database configuration
const dbConfig = {
    user: process.env.DATABASE_USER || '',
    password: process.env.DATABASE_PASSWORD|| '',
    server: process.env.DATABASE_HOST|| '',
    database: process.env.DATABASE_NAME|| '',
  options: {
    encrypt: false, // Set to true if encryption is required
    trustServerCertificate: true, // Use true if connecting to a server with a self-signed certificate
    enableArithAbort: true, 
  },
};

// Singleton function to get database connection
export const getDatabaseConnection = async (): Promise<ConnectionPool> => {
  if (!pool) {
    try {
        console.log(dbConfig);
        
      pool = await sql.connect(dbConfig);
      console.log('Database connected');
    } catch (err:any) {
      console.error('Database connection failed:', err.message);
      throw new Error('Failed to connect to the database');
    }
  }
  return pool;
};
