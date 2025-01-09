import { getDatabaseConnection } from '@/config/db';
import sql from 'mssql';


/**
 * Executes a stored procedure with the provided name and parameters.
 * @param procedureName - The name of the stored procedure to execute.
 * @param params - An object containing parameter key-value pairs.
 * @returns The result of the stored procedure execution.
 */
export const executeStoredProcedure = async (
  procedureName: string,
  params: Record<string, any>
): Promise<sql.IResult<any>> => {
  try {
    const db = await getDatabaseConnection();
    const request = db.request();

    // Add input parameters to the request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    // Execute the stored procedure
    const result = await request.execute(procedureName);
    return result;
  } catch (error:any) {
    console.error(`Error executing stored procedure "${procedureName}":`, error.message);
    throw new Error(`Failed to execute stored procedure: ${error.message}`);
  }
};


