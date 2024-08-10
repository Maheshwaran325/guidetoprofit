import supabase from '../../config/supabase.js';
import bcrypt from 'bcrypt';

export const createUser = async (email, password) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
        .from('users')
        .insert([{ email, password_hash: passwordHash }])
        .single();

    if (error) throw error;
    return data;
};

export const findUserByEmail = async (email) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) throw error;
    return data;
};

export const createProject = async (userId) => {
    const { data, error } = await supabase
        .from('projects')
        .insert([{ auth_user_id: userId }])
        .single();

    if (error) throw error;
    return data;
};

export const createNewProject = async (userId) => {
    const { data, error } = await supabase
      .from('projects')
      .insert({ user_id: userId })
      .select()
      .single();
  
    if (error) {
      throw error;
    }
  
    return data;
  };

export const findOrCreateProject = async (userId) => {
    let { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

    if (error && error.code === 'PGRST116') {
        // No project found, create a new one
        const { data: newProject, error: createError } = await supabase
            .from('projects')
            .insert([{ auth_user_id: userId }])
            .single();

        if (createError) throw createError;
        project = newProject;
    } else if (error) {
        throw error;
    }

    return project;
};