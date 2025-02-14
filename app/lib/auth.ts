interface GetSignedCookieParams {
    fileType: string;
    fileName: string;
  }
  
  interface SignedCookieResponse {
    cookieKey: string;
    signedUrl: string;
  }
  
  export async function getSignedCookie({
    fileType,
    fileName
  }: GetSignedCookieParams): Promise<SignedCookieResponse> {
    try {
      const response = await fetch('/api/get-cloudfront-cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileType,
          fileName,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get signed cookie');
      }
  
      const data = await response.json();
      
      // Store the cookie in the browser
      Object.entries(data.cookies).forEach(([name, value]) => {
        document.cookie = `${name}=${value}; path=/; secure; samesite=strict`;
      });
  
      return {
        cookieKey: data.cookieKey,
        signedUrl: data.signedUrl
      };
    } catch (error) {
      console.error('Error getting signed cookie:', error);
      throw error;
    }
  }
  