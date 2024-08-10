import supabase from '../config/supabase.js';

export const checkInitialSubmit = async (projectId) => {
  if (!projectId) {
    throw new Error('Invalid projectId: cannot be null or undefined');
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('initial_submit_complete')
      .eq('id', projectId)
      .single();

    if (error) {
      throw error;
    }

    return { isComplete: data?.initial_submit_complete || false };
  } catch (error) {
    console.error('Error checking initial submit status:', error);
    throw error;
  }
};

export const markInitialSubmitComplete = async (projectId) => {
  if (!projectId) {
    throw new Error('Invalid projectId: cannot be null or undefined');
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ initial_submit_complete: true })
      .eq('id', projectId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking initial submit as complete:', error);
    throw error;
  }
};