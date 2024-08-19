import supabase from '../../config/supabase.js';

class UserProfileModel {
  static async getProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return null;
      }
      throw error;
    }

    // Check if all profile fields are null or empty
    const isProfileEmpty = ['startup_stage', 'industry_type', 'business_model', 'company_description'].every(
      key => data[key] === null || data[key] === ''
    );

    return isProfileEmpty ? null : data;
  }

 
  static async updateProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ 
        user_id: userId, 
        ...profileData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async clearProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        startup_stage: null,
        industry_type: null,
        business_model: null,
        company_description: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async saveProfileToHistory(userId) {
    const currentProfile = await this.getProfile(userId);
    if (currentProfile) {
      const { error } = await supabase
        .from('user_profile_history')
        .insert({
          user_id: userId,
          startup_stage: currentProfile.startup_stage,
          industry_type: currentProfile.industry_type,
          business_model: currentProfile.business_model,
          company_description: currentProfile.company_description
        });

      if (error) throw error;
    }
  }
}

export default UserProfileModel;