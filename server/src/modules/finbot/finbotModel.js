import supabase from '../../config/supabase.js'

class ChatModel {
  static async addMessage(userId, message, response) {
    const { data, error } = await supabase
      .from('chats')
      .insert([
        { user_id: userId, message, response }
      ]);

    if (error) throw error;
    return data;
  }

  static async getMessageCount(userId, date) {
    const { count, error } = await supabase
      .from('chats')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('message_date', date);

    if (error) throw error;
    return count;
  }
}

export default ChatModel;