import { executeStoredProcedure, IRecordSet } from '@/utils/storedProcedures';
import { createResponse } from '@/utils/response';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '@/utils/constants';
import { NextResponse } from 'next/server';
// import { IRecordSet } from 'mssql';

/**
 * Handles GET requests to fetch a user by ID.
 * @param req The request object
 * @returns The response object
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const USER_SRNO = searchParams.get('USER_SRNO');
    const TBL_SRNO = searchParams.get('TBL_SRNO');

    // Validate request parameters
    if (!USER_SRNO) {
      return NextResponse.json(createResponse(RESPONSE_CODES.VALIDATION_ERROR, RESPONSE_MESSAGES.VALIDATION_ERROR), {
        status: 400,
      });
    }

    // Call stored procedure
    const result = await executeStoredProcedure('PLD_COMMON', { USER_SRNO: parseInt(USER_SRNO), TBL_SRNO : TBL_SRNO });
    const { recordsets } = result as { recordsets: IRecordSet<any>[] };

    if (!recordsets || recordsets.length === 0) {
        return NextResponse.json(createResponse(RESPONSE_CODES.NO_RECORD, RESPONSE_MESSAGES.NO_RECORD));
    }
    const data = {
      M_GRADE_TEMP: recordsets[0],
      M_GRADE: recordsets[1],
      M_OD: recordsets[2],
      M_THICKNESS: recordsets[3],
    };

    // Return appropriate response
    // if (data.length === 0) {
    //   return NextResponse.json(createResponse(RESPONSE_CODES.NO_RECORD, RESPONSE_MESSAGES.NO_RECORD));
    // }
    return NextResponse.json(createResponse(RESPONSE_CODES.SUCCESS, RESPONSE_MESSAGES.SUCCESS, data));
  } catch (error: any) {
    return NextResponse.json(createResponse(RESPONSE_CODES.ERROR, error.message), { status: 201 });
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
    const newUSER_SRNO = result.recordset[0]?.NewUSER_SRNO;

    // Return success response
    return NextResponse.json(createResponse(RESPONSE_CODES.SUCCESS, 'User added successfully', { newUSER_SRNO }));
  } catch (error: any) {
    return NextResponse.json(createResponse(RESPONSE_CODES.ERROR, error.message), { status: 500 });
  }
}
