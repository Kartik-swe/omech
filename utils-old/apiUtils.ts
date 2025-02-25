import axios from 'axios';
import Cookies from 'js-cookie';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// interface If_ApiResponse {
//     MsgId: number;
//     Msg: string;
// }

function getAuthHeaders(contentType: string): Record<string, string> {
  const headers: Record<string, string> = {
      'Content-Type': contentType, // Add Content-Type header
  };

  // Example: Add an Authorization token if it's available in localStorage or cookies
  const token =  Cookies.get("token");
  if (token) {
      headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}


export const apiService = {
  // GET request method
  async get<T>(endpoint: string, contentType: string, params?: object): Promise<T | If_ApiResponse> {
    try {
        console.log(`GET DATA : ${API_BASE_URL}${endpoint}`);
        
      const response = await axios.get<T>(`${API_BASE_URL}${endpoint}`, { // Added <T> type for response
        headers: getAuthHeaders(contentType), // Changed Content_Type to contentType
        params,
      });
      console.log(response);
      
      return handleApiRes(response.data);
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // POST request method
  async post<T>(endpoint: string, contentType: string, requestData: object): Promise<T | If_ApiResponse> { // Renamed data to requestData
    debugger
        try {
        console.log(`post DATA : ${API_BASE_URL}${endpoint}`);

            const response = await axios.post<T>(`${API_BASE_URL}${endpoint}`, requestData, {
                headers: getAuthHeaders(contentType),
            });
            return handleApiRes(response.data);
        } catch (error) {
            console.log("SAdSAd", error);
            
            return handleApiError(error);
        }
    },
    
    // DELETE request method
    async delete<T>(endpoint: string, contentType: string): Promise<T | If_ApiResponse> {
        try {
        console.log(`delete DATA : ${API_BASE_URL}${endpoint}`);

            const response = await axios.delete<T>(`${API_BASE_URL}${endpoint}`, {
                headers: getAuthHeaders(contentType),
            });
            return handleApiRes(response.data);
        } catch (error) {
            return handleApiError(error);
        }
    },
};

// Error handling function
function handleApiError(error: any): If_ApiResponse {
    console.error('API Error:', error);
    return {
        MsgId: -2,
        Msg: error?.response?.data?.message || error.message || 'An unknown error occurred',
    };
}

// Api Response Handle
function handleApiRes(resData: any): If_ApiResponse {
    const apiMsgId = resData.MsgId;
    debugger
    switch (apiMsgId) {
        case -1:
            return { MsgId: -2,  Msg: resData.Msg || 'Error occurred during the operation.',Data:resData.Data || [] }; // Simplified return statement
        case 0:
            return { MsgId: -2,  Msg: resData.Msg || 'No record found.',Data:resData.Data || [] };
        case 1:
            return { MsgId: 1,  Msg: resData.Msg || 'Operation completed successfully.',Data:resData.Data || [] };
        case 2:
            return { MsgId: -2,  Msg: resData.Msg || 'SQL exception occurred.',Data:resData.Data || [] };
        default:
            return { MsgId: -2,  Msg: resData.Msg || 'No response.',Data:resData.Data || [] };
    }
}
