import { API } from './axios';
import Cookies from 'js-cookie';





export const getMeAPI = async () => {
  const res = await API.get('/user/own');
  console.log(res.data, 'getMeAPI response');
  return res.data;
};


export const checkEmail = async (email: string) => {
  try {
    const response = await API.post('/auth/check-email', { email }, {
      headers: {
        'devicemodel': 'IPhone 11 Pro',
        'deviceuniqueid': 'UUID_IPhone11Prohihiuiuhiuhiuhiuh'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Login/Auth API call
export const login = async (credentials: any) => {
  const response = await API.post('/auth', {
    ...credentials,
    method: 'email',
    role: 'partner'
  }, {
    headers: {
      'devicemodel': 'IPhone 11 Pro',
      'deviceuniqueid': 'UUID_IPhone11Prohihiuiuhiuhiuhiuh'
    }
  });



  // Extract token from API response
  const token = response.data.data?.token;

  if (token) {
    // Save in cookie (7 days)
    Cookies.set('authToken', token, { expires: 7, sameSite: 'strict' });
  }

  console.log(response.data, 'login response');
  
  return response.data;
};

  export const resendOtpAPI = async (email: string) => {
    const response = await API.post('/auth/email-verification-otp', { email }, {
      headers: {
        'devicemodel': 'IPhone 11 Pro',
        'deviceuniqueid': 'UUID_IPhone11Pro'
      }
    });
    return response.data;
  };
// Verify Email OTP API call
export const verifyEmail = async (payload: { email: string; otp: string; role: string }) => {
  const response = await API.post('/auth/verify-email', payload, {
    headers: {
      'devicemodel': 'IPhone 11 Pro',
      'deviceuniqueid': 'UUID_IPhone11Pro'
    }
  });
  
  const token = response.data?.data?.token ;

  const resetToken = response.data?.data?.resetToken;
  console.log(token, 'token');
  if (token) {
    Cookies.set('authToken', token, { expires: 7, sameSite: 'strict' });
  } else if (resetToken) {
    Cookies.set('resetToken', resetToken, { expires: 7, sameSite: 'strict' });
  }
  
  return response.data;
};

// Register API call
export const register = async (credentials: any) => {
  const response = await API.post('/auth/register', credentials);
  if (response.data.token) {
    Cookies.set('authToken', response.data.token);
  }
  return response.data;
};

// Logout API call
export const logout = async () => {
  try {
    await API.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always remove token locally
    Cookies.remove('authToken');
    Cookies.remove('resetToken');
  }
};

// import { API } from './axios'; // your axios instance

export const forgotPassword = async (email: string) => {
  try {
    const response = await API.post('/auth/forgot', { email });
    return response.data;
  } catch (error: any) {
  

    // ❌ Galat
    // throw new Error(error as any);

    // ✅ Sahi (original error forward karo)
    throw error;
  }
};

export const verifyOTP = async (otp: number, email: string) => {
  try {
    const response = await API.post('/admin/verify-otp', { otp, email });
    Cookies.set('authToken', response?.data?.data?.data?.resetToken, { expires: 7 });
    
    return response.data;
    
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (password: string) => {
  try {
    const token = Cookies.get("resetToken");
    console.log(token, 'token');

    const response = await API.post("/auth/update-password", {
      password,
      resetToken: token,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update password"
    );
  }
};



// Complete Profile API call
export const completeProfile = async (formData: FormData) => {
  const response = await API.post('/user/complete-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Refresh token (if needed)
