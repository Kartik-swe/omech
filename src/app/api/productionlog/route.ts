import { NextResponse } from 'next/server';
import { apiHandler } from '../../../lib/apiHandler';
import { sql } from '../../../lib/db';

// Define a POST method for creating/updating a production log
import { getConnection } from '../../../lib/db';
export async function POST(request: Request) {
  // console.log(request.jso?Sn(), "requestKHS");
  
  const { LogID, ProductID, MachineID, StaffID, ShiftID, Quantity, IsLaserCut, Remarks, Action } = await request.json();
  
  const pool = await getConnection();
  try {
    const result = await pool.request()
    .input('LogID', sql.Int, LogID || null)
    .input('ProductID', sql.Int, ProductID)
    .input('MachineID', sql.Int, MachineID)
    .input('StaffID', sql.Int, StaffID)
    .input('ShiftID', sql.Int, ShiftID)
    .input('Quantity', sql.Int, Quantity)
    .input('IsLaserCut', sql.Bit, IsLaserCut)
    .input('Remarks', sql.NVarChar, Remarks || '')
    .input('Action', sql.Char, Action)
      .execute('IU_ProductionLogs'); // Calling the stored procedure for insert/update
      
      console.log(result);
      
      return NextResponse.json(apiHandler.success(result.recordset, 'Production Log Created/Updated Successfully'), { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(apiHandler.error('Error processing request'), { status: 500 });
    }
  }
  
// Define a GET method for retrieving all production logs
export async function GET() {
  debugger
  const pool = await getConnection();
  try {
    const result = await pool.request().execute('DT_ProductionLogs'); // Calling stored procedure to fetch production logs
    return NextResponse.json(apiHandler.success(result.recordset, 'Production Logs Retrieved Successfully'), { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(apiHandler.error('Error retrieving production logs'), { status: 500 });
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


