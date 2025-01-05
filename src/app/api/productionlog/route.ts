import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../lib/apiHandler';
import { sql } from '../../../lib/db';

// Define a POST method for creating/updating a production log
import { getConnection } from '../../../lib/db';

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const body = await req.json();

    const {
      IU_FLAG,
      PIPE_SRNO,
      MACHINE_SRNO,
      STAFF_SRNO,
      SHIFT_SRNO,
      CREATED_DATE,
      PIPE_QUANTITY,
      PIPE_GROUP,
      STATUS_SRNO,
      PIPE_TYPE,
      OD,
      THICKNESS,
      GRADE,
      PRODUCT_SRNO,
      MATERIAL_SRNO,
      USER_SRNO,
      LENGTH,
    } = body;

    // Ensure required parameters are provided
    if (!IU_FLAG || !MACHINE_SRNO || !STAFF_SRNO || !SHIFT_SRNO || !CREATED_DATE || !PIPE_QUANTITY) {
      return NextResponse.json({
        MsgId: -1,
        Msg: 'Missing required fields!',
      });
    }

    const pool = await getConnection();

    const result = await pool
      .request()
      .input('IU_FLAG', sql.VarChar(1), IU_FLAG)
      .input('PIPE_SRNO', sql.Int, PIPE_SRNO || null)
      .input('OD', sql.Int, OD || null)
      .input('THICKNESS', sql.Int, THICKNESS || null)
      .input('GRADE', sql.Int, GRADE || null)
      .input('MATERIAL_SRNO', sql.Int, MATERIAL_SRNO || null)
      .input('MACHINE_SRNO', sql.Int, MACHINE_SRNO)
      .input('STAFF_SRNO', sql.Int, STAFF_SRNO)
      .input('SHIFT_SRNO', sql.Int, SHIFT_SRNO)
      .input('PIPE_GROUP', sql.VarChar(50), PIPE_GROUP || null)
      .input('PIPE_QUANTITY', sql.Int, PIPE_QUANTITY)
      .input('LENGTH', sql.Int, LENGTH || null)
      .input('STATUS_SRNO', sql.VarChar(50), STATUS_SRNO || null)
      .input('PIPE_TYPE', sql.VarChar(50), PIPE_TYPE || null)
      .input('PROD_SRNO', sql.Int, PRODUCT_SRNO || null)
      .input('USER_SRNO', sql.Int, USER_SRNO) // Replace with actual user ID
      .input('CREATED_DATE', sql.DateTime, new Date(CREATED_DATE))
      .execute('IU_PIPE'); // Execute the stored procedure

    const data = result.recordset;

    // Response for successful execution
    if (data.length > 0) {
      return NextResponse.json({
        MsgId: 1,
        Msg: IU_FLAG === 'I' ? 'Pipe added successfully!' : 'Pipe updated successfully!',
        Data: data,
      });
    } else {
      return NextResponse.json({
        MsgId: 0,
        Msg: 'No record found!',
      });
    }
  } catch (error: any) {
    console.error('Error in IU_PIPE API:', error);
    // Response for errors
    return NextResponse.json({
      MsgId: -1,
      Msg: 'Internal server error!',
      Data: { error: error.message },
    });
  }
}



// Define a GET method for retrieving all production logs
export async function GET(request: NextRequest) {
  try {
    const pool = await getConnection(); // Get a database connection
    const searchParams = request.nextUrl.searchParams; // Parse query parameters
    const USER_SRNO = searchParams.get('USER_SRNO'); // Extract TBL_SRNO from query

    // Execute stored procedure with input
    const result = await pool   
      .request()
      .input('USER_SRNO', sql.Int, USER_SRNO)
      .execute('DT_PIPE'); // Replace with your actual stored procedure name

    // Extract data from the result sets
    const { recordsets } = result;
    if (!recordsets || recordsets.length === 0) {
      const response: If_ApiResponse = {
        MsgId: 0,
        Msg: 'No records found',
      };
      return NextResponse.json(response, { status: 404 });
    }
    console.log(recordsets,"recordsets");
    
    const PIPES = recordsets[0];
  

    const response: If_ApiResponse = {
      MsgId: 1,
      Msg: 'Success',
      Data: {
        PIPES
      },
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error:any) {
    console.error('Error fetching data:', error);

    const response: If_ApiResponse = {
      MsgId: -1,
      Msg: 'Error loading data',
      Data: error.message,
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Define a DELETE method for soft deleting a production log
export async function DELETE(request: Request) {
  const { LogID, DeletedBy } = await request.json();

  const pool = await getConnection();
  try {
    const result = await pool.request()
      .input('LogID', sql.Int, LogID)
      .input('DeletedBy', sql.Int, DeletedBy)
      .execute('DEL_ProductionLog'); // Calling stored procedure to delete a production log

    return NextResponse.json(apiHandler.success(result.recordset, 'Production Log Deleted Successfully'), { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(apiHandler.error('Error deleting production log'), { status: 500 });
  }
}


