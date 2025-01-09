import { getConnection, sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
// import { getConnection } from '../../../lib/db';
// import { sql } from '../../../lib/db';
// Helper function for success and error responses
const apiResponse = (MsgId: number, Msg: string, Data: any = null) => ({
    MsgId,
    Msg,
    Data,
  });
  
// **POST API**: Insert or Update Slit Data
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      IU_FLAG,
      SLIT_SRNO,
      MATERIAL_SRNO,
      SLIT_WIDTH,
      SLIT_WEIGHT,
      SLIT_DATE,
      USER_SRNO,
      DC_NUMBER,
    } = body;

    if (!IU_FLAG || !MATERIAL_SRNO || !SLIT_WIDTH || !SLIT_WEIGHT || !SLIT_DATE || !USER_SRNO) {
      return NextResponse.json(apiResponse(-1, 'Missing required fields!'));
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input('IU_FLAG', sql.VarChar(1), IU_FLAG)
      .input('SLIT_SRNO', sql.Int, SLIT_SRNO || null)
      .input('MATERIAL_SRNO', sql.Int, MATERIAL_SRNO)
      .input('SLIT_WIDTH', sql.Float, SLIT_WIDTH)
      .input('SLIT_WEIGHT', sql.Float, SLIT_WEIGHT)
      .input('SLIT_DATE', sql.DateTime, new Date(SLIT_DATE))
      .input('USER_SRNO', sql.Int, USER_SRNO)
      .input('DC_NUMBER', sql.VarChar(100), DC_NUMBER || null)
      .execute('IU_SLIT');

    return NextResponse.json(
      apiResponse(
        1,
        IU_FLAG === 'I' ? 'Slit added successfully!' : 'Slit updated successfully!',
        result.recordset
      )
    );
  } catch (error: any) {
    console.error('Error in IU_SLIT API:', error);
    return NextResponse.json(apiResponse(-1, 'Internal server error!', { error: error.message }));
  }
}

// **GET API**: Retrieve Slits
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const MATERIAL_SRNO = searchParams.get('MATERIAL_SRNO');

    const pool = await getConnection();
    const result = await pool
      .request()
      .input('MATERIAL_SRNO', sql.Int, MATERIAL_SRNO)
      .execute('DT_SLIT');

    const { recordsets } = result;

    if (!recordsets || recordsets.length === 0) {
      return NextResponse.json(apiResponse(0, 'No records found'));
    }

    return NextResponse.json(apiResponse(1, 'Success', { SLITS: recordsets[0] }));
  } catch (error: any) {
    console.error('Error fetching slits:', error);
    return NextResponse.json(apiResponse(-1, 'Error loading data', { error: error.message }));
  }
}

// **DELETE API**: Soft Delete Slit Data
export async function DELETE(req: Request) {
  try {
    const { SLIT_SRNO, USER_SRNO } = await req.json();

    if (!SLIT_SRNO || !USER_SRNO) {
      return NextResponse.json(apiResponse(-1, 'Missing required fields!'));
    }

    const pool = await getConnection();
    await pool
      .request()
      .input('SLIT_SRNO', sql.Int, SLIT_SRNO)
      .input('DEL_BY', sql.Int, USER_SRNO)
      .execute('DEL_SLIT');

    return NextResponse.json(apiResponse(1, 'Slit deleted successfully!'));
  } catch (error: any) {
    console.error('Error deleting slit:', error);
    return NextResponse.json(apiResponse(-1, 'Error deleting data', { error: error.message }));
  }
}
