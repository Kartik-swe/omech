// src/app/api/test/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// Handle GET request
export async function GET() {
  try {
    const pool = await getConnection();
    
    // Example query to fetch all rows from a table called 'your_table_name'
    const result = await pool.request().query('SELECT * FROM Staff');
    
    // Send the fetched data as a response
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error1: 'Internal Server Error', error}, { status: 500 });
  }
}

// DATABASE_HOST=DESKTOP-C7E52JU
// DATABASE_NAME=Omech
// DATABASE_USER=kartik
// DATABASE_PASSWORD=kartik
    
