// import { executeStoredProcedure } from '@/utils/storedProcedure';
import { createResponse } from '@/utils/response';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '@/utils/constants';
import { NextResponse } from 'next/server';
import { executeStoredProcedure } from '@/utils/storedProcedures';

/**
 * Handles GET requests to fetch a user by ID.
 * @param req The request object
 * @returns The response object
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Validate request parameters
    if (!userId) {
      return NextResponse.json(createResponse(RESPONSE_CODES.VALIDATION_ERROR, RESPONSE_MESSAGES.VALIDATION_ERROR), {
        status: 400,
      });
    }

    // Call stored procedure
    const result = await executeStoredProcedure('SP_GetUserById', { UserId: parseInt(userId) });
    const data = result.recordset;

    // Return appropriate response
    if (data.length === 0) {
      return NextResponse.json(createResponse(RESPONSE_CODES.NO_RECORD, RESPONSE_MESSAGES.NO_RECORD));
    }
    return NextResponse.json(createResponse(RESPONSE_CODES.SUCCESS, RESPONSE_MESSAGES.SUCCESS, data));
  } catch (error: any) {
    return NextResponse.json(createResponse(RESPONSE_CODES.ERROR, error.message), { status: 500 });
  }
}

/**
 * Handles POST requests to add a new user.
 * @param req The request object
 * @returns The response object
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email } = body;

    // Validate request body
    if (!name || !email) {
      return NextResponse.json(createResponse(RESPONSE_CODES.VALIDATION_ERROR, RESPONSE_MESSAGES.VALIDATION_ERROR), {
        status: 400,
      });
    }

    // Call stored procedure
    const result = await executeStoredProcedure('SP_AddUser', { Name: name, Email: email });
    const newUserId = result.recordset[0]?.NewUserId;

    // Return success response
    return NextResponse.json(createResponse(RESPONSE_CODES.SUCCESS, 'User added successfully', { newUserId }));
  } catch (error: any) {
    return NextResponse.json(createResponse(RESPONSE_CODES.ERROR, error.message), { status: 500 });
  }
}
