import supabase from '../../config/supabase.js';

class SubscriptionModel {
  static async addSubscription(email) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({ email })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export default SubscriptionModel;
