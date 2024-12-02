// src/utils/apiUtils.ts
export const fetchAPI = async (url: string, method: string = 'GET', body?: any) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  };
  