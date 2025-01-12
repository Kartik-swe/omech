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
    // Call stored procedure
    const result = await executeStoredProcedure('DT_RAW_MATERIALS', {});
    const { recordsets } = result as { recordsets: IRecordSet<any>[] };

    if (!recordsets || recordsets.length === 0) {
        return NextResponse.json(createResponse(RESPONSE_CODES.NO_RECORD, RESPONSE_MESSAGES.NO_RECORD));
    }
    const data = { 
      RAW_MATERIALS: recordsets[0],
      SLIT_PROCESSES: recordsets[1],
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
    const {  IU_FLAG, MATERIAL_SRNO, VENDOR_SRNO, MATERIAL_GRADE, MATERIAL_WIDTH, MATERIAL_THICKNESS, WEIGHT, CHALLAN_NO, DATE, USER_SRNO } = body;
    console.log("Called api", body);
    
    // Validate request body
    if (!MATERIAL_GRADE || !MATERIAL_WIDTH || !MATERIAL_THICKNESS || !WEIGHT || !CHALLAN_NO || !DATE || !USER_SRNO) {
      return NextResponse.json(createResponse(RESPONSE_CODES.VALIDATION_ERROR, RESPONSE_MESSAGES.VALIDATION_ERROR), {
        status: 400,
      });
    }

    // Call stored procedure
    const result = await executeStoredProcedure('IU_RAW_MATERIALS', {
      IU_FLAG,
      MATERIAL_SRNO: MATERIAL_SRNO || null,
      VENDOR_SRNO,
      MATERIAL_MATERIAL_GRADE_SRNO: MATERIAL_GRADE,
      MATERIAL_WIDTH,
      MATERIAL_THICKNESS_SRNO: MATERIAL_THICKNESS,
      MATERIAL_WEIGHT: WEIGHT,
      CHALLAN_NO,
      RECEIVED_DATE: new Date(DATE),
      USER_SRNO,
      MATERIAL_STATUS_SRNO: 1,
    });
    // const result = await executeStoredProcedure('SP_AddUser', { Name: name, Email: email });
    // const newUSER_SRNO = result.recordset[0]?.NewUSER_SRNO;

    const newRawMaterial = result.recordset[0];

    // Return success response
    return NextResponse.json(createResponse(RESPONSE_CODES.SUCCESS, 'User added successfully', { newRawMaterial }));
  } catch (error: any) {
    return NextResponse.json(createResponse(RESPONSE_CODES.ERROR, error.message), { status: 201 });
  }
}
