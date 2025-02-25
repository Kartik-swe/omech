import Cookies from 'js-cookie';
// export const getCookieData = () => ({
//     USER_SRNO: 1,
//     UT_SRNO: 1,
//     API_BASE_URL:`${process.env.NEXT_PUBLIC_API_BASE_URL}api/omech/`,
//     AUTH_TOKEN: '',
// });


export const getCookieData = () => {
  const userData = Cookies.get("user");
  const user = userData ? JSON.parse(userData) : null;

  return {
    USER_SRNO: user ? user.userId : null, // Get userId from stored user
    UT_SRNO: user ? user.role : null, // Assuming role acts as a type identifier
    API_BASE_URL: `${process.env.NEXT_PUBLIC_API_BASE_URL}api/omech/`,
    AUTH_TOKEN: Cookies.get("token") || "",
  };
};

export const getToken = () => {
    return Cookies.get("token");
  };
  
  export const isAuthenticated = () => {
    return !!getToken();
  };
  
  export const logout = () => {
    Cookies.remove("token");
  };

  
export const getSelectedText = (value: number, options: any[]): string => {
    const selectedOption = options.find((option:any) => option.value === value);
    return selectedOption ? selectedOption.label : '';
};