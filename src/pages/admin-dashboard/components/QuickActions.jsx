import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const handleEmergencyAlert = () => {
    // This would typically open a modal or navigate to emergency alert creation
    alert('Emergency alert system activated. This would open the emergency alert creation interface.');
  };

  const handleSystemMaintenance = () => {
    // This would typically open a maintenance mode interface
    alert('System maintenance mode. This would open the maintenance scheduling interface.');
  };

  const handleExportData = () => {
    // This would typically trigger a data export
    alert('Data export initiated. This would generate and download system reports.');
  };

  const handleBackupSystem = () => {
    // This would typically trigger a system backup
    alert('System backup initiated. This would create a full system backup.');
  };

  const handleViewLogs = () => {
    // This would typically open system logs
    alert('System logs viewer. This would open the detailed system logs interface.');
  };

  const quickActions = [
    {
      id: 'refresh',
      title: 'Refresh Data',
      description: 'Update all system data',
      icon: 'RefreshCw',
      variant: 'primary',
      action: handleRefreshData,
      loading: isRefreshing
    },
    {
      id: 'emergency',
      title: 'Emergency Alert',
      description: 'Broadcast critical alert',
      icon: 'AlertTriangle',
      variant: 'danger',
      action: handleEmergencyAlert
    },
    {
      id: 'maintenance',
      title: 'Maintenance Mode',
      description: 'Schedule system maintenance',
      icon: 'Settings',
      variant: 'warning',
      action: handleSystemMaintenance
    },
    {
      id: 'export',
      title: 'Export Data',
      description: 'Download system reports',
      icon: 'Download',
      variant: 'outline',
      action: handleExportData
    },
    {
      id: 'backup',
      title: 'Backup System',
      description: 'Create system backup',
      icon: 'Shield',
      variant: 'secondary',
      action: handleBackupSystem
    },
    {
      id: 'logs',
      title: 'View Logs',
      description: 'Check system logs',
      icon: 'FileText',
      variant: 'ghost',
      action: handleViewLogs
    }
  ];

  const systemStatus = {
    database: { status: 'healthy', latency: '12ms' },
    api: { status: 'healthy', latency: '45ms' },
    realtime: { status: 'healthy', latency: '8ms' },
    backup: { status: 'warning', lastBackup: '2 hours ago' }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Quick Actions
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Common administrative tasks and system controls
            </p>
          </div>
          <div className="text-xs text-text-secondary font-data">
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className="p-4 border border-border rounded-lg hover:border-primary transition-colors duration-200 group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-200">
                  <Icon 
                    name={action.icon} 
                    size={20} 
                    color="var(--color-primary)"
                    className={action.loading ? 'animate-spin' : ''}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-text-primary mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-3">
                    {action.description}
                  </p>
                  <Button
                    variant={action.variant}
                    size="sm"
                    onClick={action.action}
                    disabled={action.loading}
                    loading={action.loading}
                    fullWidth
                  >
                    {action.loading ? 'Processing...' : 'Execute'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              System Status
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Real-time system health monitoring
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-text-secondary">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(systemStatus).map(([key, status]) => (
            <div
              key={key}
              className="p-4 border border-border rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getStatusIcon(status.status)} 
                    size={16} 
                    className={getStatusColor(status.status)}
                  />
                  <span className="text-sm font-medium text-text-primary capitalize">
                    {key}
                  </span>
                </div>
                <span className={`text-xs font-medium capitalize ${getStatusColor(status.status)}`}>
                  {status.status}
                </span>
              </div>
              <div className="text-xs text-text-secondary font-data">
                {status.latency && `Latency: ${status.latency}`}
                {status.lastBackup && `Last: ${status.lastBackup}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary font-heading">
              Recent Activity
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Latest system events and administrative actions
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            iconPosition="right"
          >
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {[
            {
              id: 1,
              action: 'Train BL-101 status updated to "On Time"',
              user: 'System Admin',
              timestamp: new Date(Date.now() - 300000),
              type: 'update'
            },
            {
              id: 2,
              action: 'Critical alert created for Red Line suspension',
              user: 'Operations Manager',
              timestamp: new Date(Date.now() - 600000),
              type: 'alert'
            },
            {
              id: 3,
              action: 'System backup completed successfully',
              user: 'System',
              timestamp: new Date(Date.now() - 1200000),
              type: 'system'
            },
            {
              id: 4,
              action: 'New train GL-203 added to fleet',
              user: 'Fleet Manager',
              timestamp: new Date(Date.now() - 1800000),
              type: 'create'
            }
          ].map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                <Icon 
                  name={
                    activity.type === 'update' ? 'Edit' :
                    activity.type === 'alert' ? 'AlertTriangle' :
                    activity.type === 'system' ? 'Server' : 'Plus'
                  } 
                  size={14} 
                  color="var(--color-primary)"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">
                  {activity.action}
                </p>
                <div className="flex items-center space-x-2 text-xs text-text-secondary">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;