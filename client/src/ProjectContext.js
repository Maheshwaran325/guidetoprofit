import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './auth/supabaseClient';

export const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    const fetchProjectId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('projects')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        if (data) {
          setProjectId(data.id);
        } else if (error) {
          console.error('Error fetching project:', error);
        }
      }
    };

    fetchProjectId();
  }, []);

  return (
    <ProjectContext.Provider value={{ projectId, setProjectId }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}