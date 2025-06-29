import supabase from './supabase';

const trainService = {
  // Get all trains with station details
  async getTrains() {
    try {
      const { data, error } = await supabase
        .from('trains')
        .select(`
          *,
          start_station:start_station_id(id, name),
          destination_station:destination_station_id(id, name),
          current_station:current_station_id(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message, data: [] };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.',
          data: []
        };
      }
      return { success: false, error: 'Failed to load trains', data: [] };
    }
  },

  // Get active trains (not cancelled)
  async getActiveTrains() {
    try {
      const { data, error } = await supabase
        .from('trains')
        .select(`
          *,
          start_station:start_station_id(id, name),
          destination_station:destination_station_id(id, name),
          current_station:current_station_id(id, name)
        `)
        .neq('status', 'cancelled')
        .order('eta');

      if (error) {
        return { success: false, error: error.message, data: [] };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.',
          data: []
        };
      }
      return { success: false, error: 'Failed to load active trains', data: [] };
    }
  },

  // Get train by ID
  async getTrain(trainId) {
    try {
      const { data, error } = await supabase
        .from('trains')
        .select(`
          *,
          start_station:start_station_id(id, name),
          destination_station:destination_station_id(id, name),
          current_station:current_station_id(id, name)
        `)
        .eq('id', trainId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { success: false, error: 'Failed to load train' };
    }
  },

  // Create new train (admin only)
  async createTrain(trainData) {
    try {
      const { data, error } = await supabase
        .from('trains')
        .insert([trainData])
        .select(`
          *,
          start_station:start_station_id(id, name),
          destination_station:destination_station_id(id, name),
          current_station:current_station_id(id, name)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { success: false, error: 'Failed to create train' };
    }
  },

  // Update train (admin only)
  async updateTrain(trainId, updates) {
    try {
      const { data, error } = await supabase
        .from('trains')
        .update(updates)
        .eq('id', trainId)
        .select(`
          *,
          start_station:start_station_id(id, name),
          destination_station:destination_station_id(id, name),
          current_station:current_station_id(id, name)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { success: false, error: 'Failed to update train' };
    }
  },

  // Delete train (admin only)
  async deleteTrain(trainId) {
    try {
      const { error } = await supabase
        .from('trains')
        .delete()
        .eq('id', trainId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { success: false, error: 'Failed to delete train' };
    }
  },

  // Subscribe to real-time train updates
  subscribeToTrains(callback) {
    return supabase
      .channel('trains')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'trains' 
      }, callback)
      .subscribe();
  }
};

export default trainService;