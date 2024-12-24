// /app/api/master/user/route.ts

import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db'; // Path to your database connection file

// Define the ApiResponse interface for consistent response structure
export interface ApiResponse {
  MsgId: number;
  Msg: string;
}

// GET request handler - calling a stored procedure to get users
export async function GET() {
  try {
    const db = await getConnection();
    const result = await db.request().execute('DT_USER_MASTER'); // Replace with your SP name

    // Return the result as JSON
    return NextResponse.json({
      MsgId: 1,
      Msg: result.recordset,
    });
  } catch (error) {
    console.error('Error fetching users from SP:', error);
    return NextResponse.json({
      MsgId: -1,
      Msg: error,
    }, { status: 500 });
  }
}

// POST request handler - calling a stored procedure to insert/update a user
export async function POST(req: Request) {
  try {
    const db = await getConnection();
    const body = await req.json();

    const { USERNAME, F_NAME, L_NAME, ROLE, IS_ACTIVE, IU_FLAG } = body;

    // Validate required fields
    if (!USERNAME || !ROLE || IS_ACTIVE === undefined || !IU_FLAG) {
      return NextResponse.json({
        MsgId: 2,
        Msg: 'Missing required fields',
      }, { status: 400 });
    }

    // Calling the stored procedure for inserting/updating the user
    await db
      .request()
      .input('USERNAME', USERNAME)
      .input('F_NAME', F_NAME || null)
      .input('L_NAME', L_NAME || null)
      .input('ROLE', ROLE)
      .input('IS_ACTIVE', IS_ACTIVE)
      .input('IU_FLAG', IU_FLAG)
      .execute('IU_USER_MASTER'); // Replace with your SP name

    return NextResponse.json({
      MsgId: 1,
      Msg: 'User processed successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error in SP call (Insert/Update user):', error, "END SREVER");
    return NextResponse.json({
      MsgId: -1,
      Msg: error,
    }, { status: 201 });
  }
}
