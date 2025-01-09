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
    const {IU_FLAG,SLITTING_SRNO,MATERIAL_SRNO,SLITTING_SRNO_FK,VENDOR_SRNO,SLITTING_LEVEL,SLITTING_DATE,GRADE,THICKNESS,SLITTING_WIDTH,SLITTING_WEIGHT,DC_NO,USER_SRNO} = body;
    console.log("Called api", body);
    
    // Validate request body
    if ( !MATERIAL_SRNO || !VENDOR_SRNO || !SLITTING_DATE || !GRADE || !THICKNESS || !SLITTING_WIDTH || !SLITTING_WEIGHT || !DC_NO || !USER_SRNO) {
      return NextResponse.json(createResponse(RESPONSE_CODES.VALIDATION_ERROR, RESPONSE_MESSAGES.VALIDATION_ERROR), {
        status: 400,
      });
    }

    // Call stored procedure
    const result = await executeStoredProcedure('IU_SLITTING_PROCESSES', {
        IU_FLAG,
        MATERIAL_SRNO,
        SLITTING_SRNO_FK: SLITTING_SRNO_FK || null,
        VENDOR_SRNO,
        SLITTING_LEVEL,
        SLITTING_DATE: new Date(SLITTING_DATE),
        SLITTING_GRADE_SRNO: GRADE,
        SLITTING_THICKNESS_SRNO: THICKNESS,
        SLITTING_WIDTH,
        SLITTING_WEIGHT,
        DC_NO,
        SLITTING_STATUS_SRNO: 1, // Example: active status
        IS_SLITTED : 1,
        USER_SRNO,
        SLITTING_SRNO: SLITTING_SRNO || null,
    });
    // const result = await executeStoredProcedure('SP_AddUser', { Name: name, Email: email });
    // const newUSER_SRNO = result.recordset[0]?.NewUSER_SRNO;

    const Table = result.recordset[0];

    // Return success response
    return NextResponse.json(createResponse(RESPONSE_CODES.SUCCESS, 'Slitted successfully', { Table }));
  } catch (error: any) {
    return NextResponse.json(createResponse(RESPONSE_CODES.ERROR, error.message), { status: 201 });
  }
}
