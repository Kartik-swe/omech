interface ApiResponse {
    msgId: number;
    msg: string;
    data?: any;
  }
  
  /**
   * Creates a standardized API response.
   * @param msgId The response code
   * @param msg The response message
   * @param data Optional response data
   * @returns A standardized response object
   */
  export const createResponse = (msgId: number, msg: string, data: any = null): ApiResponse => ({
    msgId,
    msg,
    data,
  });
  