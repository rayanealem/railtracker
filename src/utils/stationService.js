import supabase from './supabase';

const stationService = {
  // Get all stations
  async getStations() {
    try {
      const { data, error } = await supabase
        .from('stations')
        .select('*')
        .order('name');

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
      return { success: false, error: 'Failed to load stations', data: [] };
    }
  },

  // Get station by ID
  async getStation(stationId) {
    try {
      const { data, error } = await supabase
        .from('stations')
        .select('*')
        .eq('id', stationId)
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
      return { success: false, error: 'Failed to load station' };
    }
  },

  // Create new station (admin only)
  async createStation(stationData) {
    try {
      const { data, error } = await supabase
        .from('stations')
        .insert([stationData])
        .select()
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
      return { success: false, error: 'Failed to create station' };
    }
  },

  // Update station (admin only)
  async updateStation(stationId, updates) {
    try {
      const { data, error } = await supabase
        .from('stations')
        .update(updates)
        .eq('id', stationId)
        .select()
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
      return { success: false, error: 'Failed to update station' };
    }
  },

  // Delete station (admin only)
  async deleteStation(stationId) {
    try {
      const { error } = await supabase
        .from('stations')
        .delete()
        .eq('id', stationId);

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
      return { success: false, error: 'Failed to delete station' };
    }
  }
};

export default stationService;