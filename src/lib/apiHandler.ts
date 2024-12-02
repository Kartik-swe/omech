/**
 * lib/apiHandler.ts
 * Provides standardized responses for success and error handling.
 */
export const apiHandler = {
    success: (data: any, message = 'Success', status = 200) => {
      console.log(data);
      
      return new Response(
        JSON.stringify({ status, message, data }),
        { status }
      );
    },
    error: (message = 'An error occurred', status = 500) => {
      return new Response(
        JSON.stringify({ status, message }),
        { status }
      );
    },
  };
  