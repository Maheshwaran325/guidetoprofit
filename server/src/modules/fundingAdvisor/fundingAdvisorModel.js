import supabase from '../../config/supabase.js';
// import logger from '../../../../logger.js';


export const getFundingTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('funding_types')
      .select('*');

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn('No funding types found in the database');
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error in getFundingTypes:', error);
    throw error;
  }
};

// ... rest of the file remains unchanged ...

export const getUserProfile = async (projectId) => {
  try {
    const { data, error } = await supabase
      .from('funding_user_profiles')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Profile not found
      return null;
    }

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

export const saveUserProfile = async (projectId, profileData) => {
  try {
    // Check if profile exists
    const existingProfile = await getUserProfile(projectId);

    if (!existingProfile) {
      // If profile doesn't exist, insert a new one
      const { error } = await supabase
        .from('funding_user_profiles')
        .insert({
          project_id: projectId,
          profile_data: profileData,
          recommendation_history: []
        });

      if (error) throw error;
    } else {
      // If profile exists, update the existing profile
      const { error } = await supabase
        .from('funding_user_profiles')
        .update({
          profile_data: profileData,
          updated_at: new Date().toISOString()
        })
        .eq('project_id', projectId);

      if (error) throw error;
    }
    return { message: 'Profile saved successfully' };
  } catch (error) {
    console.error('Error in saveUserProfile:', error);
    throw error;
  }
};

export const submitFeedback = async (userId, feedback, rating) => {
  const { data, error } = await supabase
    .from('user_feedback')
    .insert({ user_id: userId, feedback, rating });
  if (error) throw error;
  return data;
};

export const saveRecommendationHistory = async (projectId, recommendations) => {
  const newRecommendation = {
    date: new Date().toISOString(),
    recommendations
  };

  // First, try to get the existing profile
  const { data, error } = await supabase
    .from('funding_user_profiles')
    .select('recommendation_history')
    .eq('project_id', projectId);

  if (error) {
    throw error;
  }

  let updatedHistory;
  let operation;

  if (data.length === 0) {
    // No profile exists, create a new one
    updatedHistory = [newRecommendation];
    operation = supabase
      .from('funding_user_profiles')
      .insert({ project_id: projectId, recommendation_history: updatedHistory });
  } else {
    // Profile exists, update it
    updatedHistory = data[0].recommendation_history || [];
    updatedHistory.push(newRecommendation);
    operation = supabase
      .from('funding_user_profiles')
      .update({ recommendation_history: updatedHistory })
      .eq('project_id', projectId);
  }

  const { error: operationError } = await operation;

  if (operationError) {
    throw operationError;
  }

  return { recommendation_history: updatedHistory };
};



export const getRecentRecommendations = async (projectId) => {
  try {
    const { data, error } = await supabase
      .from('funding_user_profiles')
      .select('recommendation_history')
      .eq('project_id', projectId);
    
    if (error) throw error;
    
    // If no data found or recommendation history is empty
    if (!data || data.length === 0 || !data[0].recommendation_history) {
      return null; // or return empty array []
    }
    
    const recommendationHistory = data[0].recommendation_history;
    const recentRecommendations = recommendationHistory.slice(-5); // Get the last 5 recommendations

    return recentRecommendations;
  } catch (error) {
    throw error; // Let the controller handle the error
  }
};
