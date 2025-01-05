import { getConnection, sql } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request, res: NextApiResponse) {

    const body = await req.json();
    
    const { payload } = body;
    const { newEntries, updatedEntries } = payload;
// 
    // const body = await req.json();
  

  try {
    const pool = await getConnection();

    // Process New Entries
    for (const entry of newEntries) {
      await pool
        .request()
        .input("CHALLAN_NO", sql.VarChar, entry.CHALLAN_NO)
        .input("MATERIAL_GRADE", sql.VarChar, entry.MATERIAL_GRADE)
        .input("MATERIAL_WEIGHT", sql.Decimal(10, 2), entry.MATERIAL_WEIGHT)
        .execute("dbo.sp_InsertNewMaterial"); // Example SP for inserting new entries
    }

    // Process Updated Entries
    for (const entry of updatedEntries) {
      await pool
        .request()
        .input("CHALLAN_NO", sql.VarChar, entry.CHALLAN_NO)
        .input("MATERIAL_GRADE", sql.VarChar, entry.MATERIAL_GRADE)
        .input("MATERIAL_WEIGHT", sql.Decimal(10, 2), entry.MATERIAL_WEIGHT)
        .execute("dbo.sp_UpdateMaterial"); // Example SP for updating existing entries
    }

    res.status(200).json({ message: "Entries finalized successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finalizing entries." });
  }
}
