import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/db';
import { sql } from '../../../../lib/db';

// Helper function for success and error responses
const apiResponse = (MsgId: number, Msg: string, Data: any = null) => ({
  MsgId,
  Msg,
  Data,
});

// **POST API**: Insert or Update Raw Material
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      IU_FLAG,
      MATERIAL_SRNO,
      VENDOR_SRNO,
      GRADE,
      WIDTH,
      THICKNESS,
      WEIGHT,
      CHALLAN_NO,
      DATE,
      USER_SRNO,
    } = body;

    if (!IU_FLAG || !VENDOR_SRNO || !GRADE || !WIDTH || !THICKNESS || !WEIGHT || !DATE || !USER_SRNO) {
      return NextResponse.json(apiResponse(-1, 'Missing required fields!'));
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input('IU_FLAG', sql.VarChar(1), IU_FLAG)
      .input('MATERIAL_SRNO', sql.Int, MATERIAL_SRNO || null)
      .input('VENDOR_SRNO', sql.Int, VENDOR_SRNO)
      .input('MATERIAL_GRADE_SRNO', sql.VarChar(50), GRADE)
      .input('WIDTH', sql.Float, WIDTH)
      .input('MATERIAL_THICKNESS_SRNO', sql.Float, THICKNESS)
      .input('MATERIAL_WEIGHT', sql.Float, WEIGHT)
      .input('CHALLAN_NO', sql.VarChar(100), CHALLAN_NO)
      .input('RECEIVED_DATE', sql.DateTime, new Date(DATE))
      .input('USER_SRNO', sql.Int, USER_SRNO)
      .input('MATERIAL_STATUS_SRNO', sql.Int, 1)
      .execute('IU_RAW_MATERIALS');

    return NextResponse.json(
      apiResponse(
        1,
        IU_FLAG === 'I' ? 'Raw material added successfully!' : 'Raw material updated successfully!',
        result.recordset
      )
    );
  } catch (error: any) {
    console.error('Error in IU_RAW_MATERIAL API:', error);
    return NextResponse.json(apiResponse(-1, 'Internal server error!', { error: error.message }));
  }
}

// **GET API**: Retrieve Raw Materials
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const USER_SRNO = searchParams.get('USER_SRNO');

    const pool = await getConnection();
    const result = await pool
      .request()
      .input('USER_SRNO', sql.Int, USER_SRNO)
      .execute('DT_RAW_MATERIALS');

    const { recordsets } = result;

    if (!recordsets || recordsets.length === 0) {
      return NextResponse.json(apiResponse(0, 'No records found'));
    }

    return NextResponse.json(apiResponse(1, 'Success', { RAW_MATERIALS: recordsets[0] }));
  } catch (error: any) {
    console.error('Error fetching raw materials:', error);
    return NextResponse.json(apiResponse(-1, 'Error loading data', { error: error.message }));
  }
}

// **DELETE API**: Soft Delete Raw Material
export async function DELETE(req: Request) {
  try {
    const { MATERIAL_SRNO, USER_SRNO } = await req.json();

    if (!MATERIAL_SRNO || !USER_SRNO) {
      return NextResponse.json(apiResponse(-1, 'Missing required fields!'));
    }

    const pool = await getConnection();
    await pool
      .request()
      .input('MATERIAL_SRNO', sql.Int, MATERIAL_SRNO)
      .input('DEL_BY', sql.Int, USER_SRNO)
      .execute('DEL_RAW_MATERIAL');

    return NextResponse.json(apiResponse(1, 'Raw material deleted successfully!'));
  } catch (error: any) {
    console.error('Error deleting raw material:', error);
    return NextResponse.json(apiResponse(-1, 'Error deleting data', { error: error.message }));
  }
}
