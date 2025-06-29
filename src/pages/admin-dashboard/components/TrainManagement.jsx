import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import trainService from '../../../utils/trainService';
import stationService from '../../../utils/stationService';

const TrainManagement = () => {
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTrain, setEditingTrain] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [trainsResult, stationsResult] = await Promise.all([
          trainService.getTrains(),
          stationService.getStations()
        ]);

        if (isMounted) {
          if (trainsResult?.success) {
            setTrains(trainsResult.data || []);
          } else {
            setError(trainsResult?.error || 'Failed to load trains');
          }

          if (stationsResult?.success) {
            setStations(stationsResult.data || []);
          }

          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load train data');
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const subscription = trainService.subscribeToTrains((payload) => {
      if (payload.eventType === 'INSERT') {
        setTrains(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setTrains(prev => prev.map(train => 
          train.id === payload.new.id ? payload.new : train
        ));
      } else if (payload.eventType === 'DELETE') {
        setTrains(prev => prev.filter(train => train.id !== payload.old.id));
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleEdit = (train) => {
    setEditingTrain(train?.id);
    setFormData({
      train_identifier: train?.train_identifier || '',
      direction: train?.direction || '',
      start_station_id: train?.start_station_id || '',
      destination_station_id: train?.destination_station_id || '',
      current_station_id: train?.current_station_id || '',
      start_time: train?.start_time ? new Date(train.start_time).toISOString().slice(0, 16) : '',
      eta: train?.eta ? new Date(train.eta).toISOString().slice(0, 16) : '',
      status: train?.status || 'on-time',
      is_delayed: train?.is_delayed || false,
      live_latitude: train?.live_latitude || '',
      live_longitude: train?.live_longitude || ''
    });
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      train_identifier: '',
      direction: '',
      start_station_id: '',
      destination_station_id: '',
      current_station_id: '',
      start_time: '',
      eta: '',
      status: 'on-time',
      is_delayed: false,
      live_latitude: '',
      live_longitude: ''
    });
  };

  const handleSave = async () => {
    try {
      const submitData = {
        ...formData,
        start_time: formData.start_time ? new Date(formData.start_time).toISOString() : null,
        eta: formData.eta ? new Date(formData.eta).toISOString() : null,
        live_latitude: formData.live_latitude ? parseFloat(formData.live_latitude) : null,
        live_longitude: formData.live_longitude ? parseFloat(formData.live_longitude) : null
      };

      let result;
      if (isCreating) {
        result = await trainService.createTrain(submitData);
      } else {
        result = await trainService.updateTrain(editingTrain, submitData);
      }

      if (result?.success) {
        setEditingTrain(null);
        setIsCreating(false);
        setFormData({});
        setError(null);
      } else {
        setError(result?.error || 'Failed to save train');
      }
    } catch (error) {
      setError('Failed to save train');
    }
  };

  const handleDelete = async (trainId) => {
    if (window.confirm('Are you sure you want to delete this train?')) {
      try {
        const result = await trainService.deleteTrain(trainId);
        if (result?.success) {
          setError(null);
        } else {
          setError(result?.error || 'Failed to delete train');
        }
      } catch (error) {
        setError('Failed to delete train');
      }
    }
  };

  const handleCancel = () => {
    setEditingTrain(null);
    setIsCreating(false);
    setFormData({});
  };

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Train Management</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-text-secondary">Loading trains...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Train Management</h3>
        <button
          onClick={handleCreate}
          disabled={isCreating || editingTrain}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Train</span>
        </button>
      </div>

      {error && (
        <div className="bg-error-light border border-error text-error-dark p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Create Form */}
        {isCreating && (
          <TrainForm
            formData={formData}
            setFormData={setFormData}
            stations={stations}
            onSave={handleSave}
            onCancel={handleCancel}
            isCreating={true}
          />
        )}

        {/* Train List */}
        {trains?.length > 0 ? (
          trains.map(train => (
            <div key={train?.id} className="border border-border rounded-lg p-4">
              {editingTrain === train?.id ? (
                <TrainForm
                  formData={formData}
                  setFormData={setFormData}
                  stations={stations}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  isCreating={false}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">
                      {train?.train_identifier || 'Unknown Train'}
                    </h4>
                    <p className="text-sm text-text-secondary">
                      {train?.direction} | {train?.destination_station?.name || 'Unknown Destination'}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Status: <span className={`font-medium ${
                        train?.status === 'on-time' ? 'text-success' : 
                        train?.status === 'delayed' ? 'text-warning' : 'text-error'
                      }`}>
                        {train?.status || 'Unknown'}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(train)}
                      disabled={editingTrain || isCreating}
                      className="p-2 text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(train?.id)}
                      disabled={editingTrain || isCreating}
                      className="p-2 text-text-secondary hover:text-error transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-text-secondary">
            No trains found. Create your first train to get started.
          </div>
        )}
      </div>
    </div>
  );
};

const TrainForm = ({ formData, setFormData, stations, onSave, onCancel, isCreating }) => {
  return (
    <div className="border border-border rounded-lg p-4 bg-background">
      <h4 className="font-medium text-text-primary mb-4">
        {isCreating ? 'Create New Train' : 'Edit Train'}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Train Identifier
          </label>
          <input
            type="text"
            value={formData?.train_identifier || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, train_identifier: e.target.value }))}
            className="w-full p-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Blue Line #55"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Direction
          </label>
          <input
            type="text"
            value={formData?.direction || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, direction: e.target.value }))}
            className="w-full p-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Northbound"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Start Station
          </label>
          <select
            value={formData?.start_station_id || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, start_station_id: e.target.value }))}
            className="w-full p-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select start station</option>
            {stations?.map(station => (
              <option key={station?.id} value={station?.id}>
                {station?.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Destination Station
          </label>
          <select
            value={formData?.destination_station_id || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, destination_station_id: e.target.value }))}
            className="w-full p-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select destination</option>
            {stations?.map(station => (
              <option key={station?.id} value={station?.id}>
                {station?.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Current Station
          </label>
          <select
            value={formData?.current_station_id || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, current_station_id: e.target.value }))}
            className="w-full p-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select current station</option>
            {stations?.map(station => (
              <option key={station?.id} value={station?.id}>
                {station?.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Status
          </label>
          <select
            value={formData?.status || 'on-time'}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full p-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="on-time">On Time</option>
            <option value="delayed">Delayed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            value={formData?.start_time || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
            className="w-full p-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            ETA
          </label>
          <input
            type="datetime-local"
            value={formData?.eta || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, eta: e.target.value }))}
            className="w-full p-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-surface transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
        <button
          onClick={onSave}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default TrainManagement;