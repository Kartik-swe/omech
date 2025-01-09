export interface ApiResponse<T = any> {
    msgId: number;
    msg: string;
    data?: T;
  }
  
  /**
   * A reusable function for making API requests.
   * @param url The endpoint URL
   * @param method The HTTP method (GET, POST, PUT, DELETE)
   * @param body The request body (optional)
   * @param headers Additional headers (optional)
   * @returns The standardized API response
   */
  export const apiClient = async <T = any>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: Record<string, any>,
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
  
      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (error: any) {
      console.error(`API Client Error (${url}):`, error.message);
  
      // Return a standardized error response
      return {
        msgId: -1,
        msg: error.message || 'An unknown error occurred',
      };
    }
  };
  