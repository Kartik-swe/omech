// import Cookies from 'react-cookies';
// Helper function to get cookie data
// export const getCookieData = () => ({
//     //default
//     USER_SRNO: Cookies.load('USER_SRNO'),
//     UT_SRNO: Cookies.load('UT_SRNO'),
//     // USER_SRNO: Cookies.load('USER_SRNO'),
//     HT_API_URL: Cookies.load('HT_API_URL'),
//     AUTH_TOKEN: Cookies.load('AUTH_TOKEN'),
// });
export const getCookieData = () => ({
    //default
    USER_SRNO: 1,
    UT_SRNO: 1,
    // USER_SRNO: Cookies.load('USER_SRNO'),
    API_BASE_URL:'https://localhost:7135/api/omech/',
    AUTH_TOKEN: 'SDEDF3FVXR45',
});


export const getSelectedText = (value: number, options: any[]): string => {
    const selectedOption = options.find((option:any) => option.value === value);
    return selectedOption ? selectedOption.label : '';
};