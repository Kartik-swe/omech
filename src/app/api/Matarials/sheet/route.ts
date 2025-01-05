import { getConnection, sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the JSON body from the request
    const body = await req.json();
    const { fileData } = body;

    // Validate the incoming data
    if (!fileData || !Array.isArray(fileData)) {
      return NextResponse.json(
        { message: "Invalid or missing file data. Expected an array." },
        { status: 400 }
      );
    }

    // Establish a connection to the database
    const pool = await getConnection();

    // Call the stored procedure to process the imported data
    const result = await pool
      .request()
      .input("ImportedData", sql.NVarChar, JSON.stringify(fileData)) // Pass fileData as a JSON string
      .execute("dbo.sp_ProcessImportedData");

    // Process the stored procedure result
    const newEntries = result.recordsets?.[0] || []; // New entries (1st recordset)
    const updatedEntries = result.recordsets?.[1] || []; // Updated entries (2nd recordset)

    // Return the result for confirmation to the user
    return NextResponse.json({
      message: "Data processed successfully. Please confirm the changes.",
      newEntries,
      updatedEntries,
    });
  } catch (error: any) {
    console.error("Error processing file data:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
