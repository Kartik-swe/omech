import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';
import { apiHandler } from '../../../lib/apiHandler';



// Define a method for loading required dropdown data (like products, machines, etc.)
export async function GET() {
    const pool = await getConnection();
    try {
      const result = await pool.request().execute('PL_COMMON');
      // const machines = await pool.request().query('SELECT * FROM Machines');
      // const staff = await pool.request().query('SELECT * FROM Staff');
      // const shifts = await pool.request().query('SELECT * FROM StaffShifts');
  
      // Example of assuming the procedure returns multiple result sets
      const { recordsets } = result;
    const products = recordsets[0];  // 1st result set, maybe products
    const machines = recordsets[1];  // 2nd result set, maybe machines
    const staff = recordsets[2];     // 3rd result set, maybe staff
    const shifts = recordsets[3];    // 4th result set, maybe shifts
        return NextResponse.json({
        success: true,
        // data: { products: products.recordset, machines: machines.recordset, staff: staff.recordset, shifts: shifts.recordset },
        data: { result },
      }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, message: 'Error loading data', desc: error }, { status: 500 });
    }
  }