import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { setResetSessionTimeout } from '../utility/authenticatedRequestUtility';

const AuthContext = createContext();

const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  


  const signUp = async (data) => {
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { 
            full_name: data.name,
            business_vertical: data.businessVertical
          }
        }
      });
  
      if (error) {
        console.error('Supabase signUp error:', error);
        throw error;
      }
  
      return { data: signUpData, error: null };
    } catch (error) {
      console.error('SignUp function error:', error);
      return { data: null, error };
    }
  };

 
    const signIn = async (data) => {
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;

    return { data: signInData, error: null };
  };

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    if (sessionTimeout) clearTimeout(sessionTimeout);
  }, [sessionTimeout]);

  const resetSessionTimeout = useCallback(() => {
    if (sessionTimeout) clearTimeout(sessionTimeout);
    const newTimeout = setTimeout(() => signOut(), SESSION_TIMEOUT);
    setSessionTimeout(newTimeout);
  }, [sessionTimeout, signOut]);

  useEffect(() => {
    setResetSessionTimeout(resetSessionTimeout);
  }, [resetSessionTimeout]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) resetSessionTimeout();
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) resetSessionTimeout();
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
      if (sessionTimeout) clearTimeout(sessionTimeout);
    };
  }, [resetSessionTimeout, sessionTimeout]);

  const value = {
    signUp,
    signIn,
    signInWithGoogle: async () => {
      const result = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (result.data.user) resetSessionTimeout();
      return result;
    },
    signOut,
    user,
    userName: user?.user_metadata?.full_name || user?.full_name || 'User',
    businessVertical: user?.user_metadata?.business_vertical || '',
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}