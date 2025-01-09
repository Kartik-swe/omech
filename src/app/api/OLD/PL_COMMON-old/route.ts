import { NextRequest, NextResponse } from 'next/server';
import { getConnection, sql } from '../../../../lib/db'; // Ensure these are correctly set up

export async function GET(request: NextRequest) {
  try {
    const pool = await getConnection(); // Get a database connection
    const searchParams = request.nextUrl.searchParams; // Parse query parameters
    const USER_SRNO = searchParams.get('USER_SRNO'); // Extract TBL_SRNO from query
    const tblSrno = searchParams.get('TBL_SRNO'); // Extract TBL_SRNO from query

    if (!tblSrno) {
      return NextResponse.json(
        { success: false, message: 'TBL_SRNO is required' },
        { status: 400 }
      );
    }

    // Execute stored procedure with input
    const result = await pool
      .request()
      .input('USER_SRNO', sql.Int, USER_SRNO)
      .input('TBL_SRNO', sql.NVarChar, tblSrno)
      .execute('PLD_COMMON'); // Replace with your actual stored procedure name

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
    
    const M_MACHINE = recordsets[0];
    const STAFF = recordsets[1];
    const M_SHIFT = recordsets[2];
    const M_GRADE = recordsets[3];
    const M_OD = recordsets[4];
    const M_THICKNESS  = recordsets[5];
    const M_PRODUCT  = recordsets[6];
  

    const response: If_ApiResponse = {
      MsgId: 1,
      Msg: 'Success',
      Data: {
        M_MACHINE,
        STAFF,
        M_SHIFT,
        M_GRADE,
        M_OD,
        M_THICKNESS,
        M_PRODUCT
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