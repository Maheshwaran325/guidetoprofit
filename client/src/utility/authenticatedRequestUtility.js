import axios from 'axios';
import { supabase } from '../auth/supabaseClient';

let resetSessionTimeout = () => {}; // Placeholder function

export const setResetSessionTimeout = (fn) => {
  resetSessionTimeout = fn;
};

export const authenticatedRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      throw new Error('No access token available');
    }

    const baseUrl = process.env.REACT_APP_API_URL;

    if (!baseUrl) {
      throw new Error('API URL is not defined in environment variables');
    }

    const url = `${baseUrl}${endpoint}`;
    const config = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: method !== 'GET' ? data : undefined
    };

    const response = await axios(config);
    
    // Reset session timeout after successful request
    resetSessionTimeout();

    return response;
  } catch (error) {
    console.error('Error in authenticated request:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};