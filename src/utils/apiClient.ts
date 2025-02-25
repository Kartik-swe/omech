
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
      // Get JWT token from localStorage
    const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add token if available
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
  
       // Check if token is expired (Unauthorized response)
    if (response.status === 401) {
      console.warn("Token expired or invalid. Logging out...");
      handleLogout();
      return {
        msgId: -1,
        msg: "Session expired. Please log in again.",
      };
    }

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
  
  // Function to handle logout
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login"; // Redirect to login page
};