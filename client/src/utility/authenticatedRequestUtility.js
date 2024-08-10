import axios from 'axios';
import { supabase } from '../auth/supabaseClient'; // Adjust the import path as needed

export async function authenticatedRequest(url, method = 'GET', data = null) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      throw new Error('No access token available');
    }

    const config = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: method !== 'GET' ? data : undefined
    };

    const response = await axios(config);
    return response; // Return the entire response, not just response.data
  } catch (error) {
    console.error('Error in authenticated request:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
}