import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import alertService from '../../../utils/alertService';

const AlertManagement = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAlert, setEditingAlert] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    let isMounted = true;

    const loadAlerts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await alertService.getAllAlerts();

        if (isMounted) {
          if (result?.success) {
            setAlerts(result.data || []);
          } else {
            setError(result?.error || 'Failed to load alerts');
          }
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load alert data');
          setIsLoading(false);
        }
      }
    };

    loadAlerts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const subscription = alertService.subscribeToAlerts((payload) => {
      if (payload.eventType === 'INSERT') {
        setAlerts(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setAlerts(prev => prev.map(alert => 
          alert.id === payload.new.id ? payload.new : alert
        ));
      } else if (payload.eventType === 'DELETE') {
        setAlerts(prev => prev.filter(alert => alert.id !== payload.old.id));
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleEdit = (alert) => {
    setEditingAlert(alert?.id);
    setFormData({
      message: alert?.message || '',
      alert_level: alert?.alert_level || 'info',
      is_active: alert?.is_active ?? true
    });
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      message: '',
      alert_level: 'info',
      is_active: true
    });
  };

  const handleSave = async () => {
    try {
      let result;
      if (isCreating) {
        result = await alertService.createAlert(formData);
      } else {
        result = await alertService.updateAlert(editingAlert, formData);
      }

      if (result?.success) {
        setEditingAlert(null);
        setIsCreating(false);
        setFormData({});
        setError(null);
      } else {
        setError(result?.error || 'Failed to save alert');
      }
    } catch (error) {
      setError('Failed to save alert');
    }
  };

  const handleDelete = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        const result = await alertService.deleteAlert(alertId);
        if (result?.success) {
          setError(null);
        } else {
          setError(result?.error || 'Failed to delete alert');
        }
      } catch (error) {
        setError('Failed to delete alert');
      }
    }
  };

  const handleToggleActive = async (alert) => {
    try {
      const result = await alertService.updateAlert(alert?.id, {
        is_active: !alert?.is_active
      });
      
      if (!result?.success) {
        setError(result?.error || 'Failed to update alert status');
      }
    } catch (error) {
      setError('Failed to update alert status');
    }
  };

  const handleCancel = () => {
    setEditingAlert(null);
    setIsCreating(false);
    setFormData({});
  };

  const getAlertLevelColor = (level) => {
    switch (level) {
      case 'critical':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-info';
      default:
        return 'text-text-secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Alert Management</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-text-secondary">Loading alerts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Alert Management</h3>
        <button
          onClick={handleCreate}
          disabled={isCreating || editingAlert}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Alert</span>
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
          <AlertForm
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onCancel={handleCancel}
            isCreating={true}
          />
        )}

        {/* Alert List */}
        {alerts?.length > 0 ? (
          alerts.map(alert => (
            <div key={alert?.id} className="border border-border rounded-lg p-4">
              {editingAlert === alert?.id ? (
                <AlertForm
                  formData={formData}
                  setFormData={setFormData}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  isCreating={false}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-sm font-medium ${getAlertLevelColor(alert?.alert_level)}`}>
                        {alert?.alert_level?.toUpperCase() || 'INFO'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert?.is_active 
                          ? 'bg-success-light text-success-dark' :'bg-error-light text-error-dark'
                      }`}>
                        {alert?.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-text-primary mb-2">
                      {alert?.message || 'No message'}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Created: {alert?.created_at ? new Date(alert.created_at).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(alert)}
                      disabled={editingAlert || isCreating}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors disabled:opacity-50 ${
                        alert?.is_active
                          ? 'bg-warning text-warning-dark hover:bg-warning-dark' :'bg-success text-success-dark hover:bg-success-dark'
                      }`}
                    >
                      {alert?.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(alert)}
                      disabled={editingAlert || isCreating}
                      className="p-2 text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(alert?.id)}
                      disabled={editingAlert || isCreating}
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
            No alerts found. Create your first alert to get started.
          </div>
        )}
      </div>
    </div>
  );
};

const AlertForm = ({ formData, setFormData, onSave, onCancel, isCreating }) => {
  return (
    <div className="border border-border rounded-lg p-4 bg-background">
      <h4 className="font-medium text-text-primary mb-4">
        {isCreating ? 'Create New Alert' : 'Edit Alert'}
      </h4>
      
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Alert Level
          </label>
          <select
            value={formData?.alert_level || 'info'}
            onChange={(e) => setFormData(prev => ({ ...prev, alert_level: e.target.value }))}
            className="w-full p-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Message
          </label>
          <textarea
            value={formData?.message || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={3}
            className="w-full p-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter alert message..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            checked={formData?.is_active ?? true}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          <label htmlFor="is_active" className="ml-2 text-sm text-text-secondary">
            Alert is active
          </label>
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

export default AlertManagement;