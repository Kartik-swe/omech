import { Url } from "next/dist/shared/lib/router/router";
import { apiService } from "./apiUtils";

// export const fetchPl_Common = async ( USER_SRNO : Number, TBL_SRNO : String) => {
//     try {
//       debugger
//       const url = `HOSP_SRNO=${USER_SRNO}&TBL_SRNO=${TBL_SRNO}`
//       const response = await apiService.get(`PL_COMMON?${url}`, 'application/json');
//       // Handle API response using the Op_Handle_Api_Response function
//       const apiResponse = (response);
//       console.log(apiResponse, "Kartik");
      
//       return apiResponse;
//     } catch (error: any) {
//       // Show the error message in a toast
//       const errorMessage = error?.message || 'Something went wrong!';
//     //   toast.error(errorMessage, { position: 'top-center' });
//     }
//   };