import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrainPopup = ({ train, onClose, onViewRoute }) => {
  if (!train) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-time':
        return 'text-success';
      case 'delayed':
        return 'text-warning';
      case 'cancelled':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on-time':
        return 'CheckCircle';
      case 'delayed':
        return 'Clock';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'Info';
    }
  };

  const formatDelay = (delayMinutes) => {
    if (!delayMinutes || delayMinutes === 0) return null;
    return `${delayMinutes} min${delayMinutes !== 1 ? 's' : ''} late`;
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-secondary-900 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-surface rounded-lg shadow-xl max-w-sm w-full animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: train.routeColor || '#64748B' }}
            >
              <Icon name="Train" size={16} color="white" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">
                Train {train.number}
              </h3>
              <p className="text-sm text-text-secondary capitalize">
                {train.route?.replace('-', ' ')} Line
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Status</span>
            <div className={`flex items-center space-x-1 ${getStatusColor(train.status)}`}>
              <Icon name={getStatusIcon(train.status)} size={16} />
              <span className="text-sm font-medium capitalize">
                {train.status.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Delay Information */}
          {train.delayMinutes > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Delay</span>
              <span className="text-sm font-medium text-warning">
                {formatDelay(train.delayMinutes)}
              </span>
            </div>
          )}

          {/* Destination */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Destination</span>
            <span className="text-sm font-medium text-text-primary">
              {train.destination}
            </span>
          </div>

          {/* Current Location */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Current Location</span>
            <span className="text-sm font-medium text-text-primary">
              {train.currentLocation || 'Between stations'}
            </span>
          </div>

          {/* Next Station */}
          {train.nextStation && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Next Station</span>
              <div className="text-right">
                <div className="text-sm font-medium text-text-primary">
                  {train.nextStation.name}
                </div>
                <div className="text-xs text-text-secondary">
                  ETA: {train.nextStation.eta}
                </div>
              </div>
            </div>
          )}

          {/* Speed */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Speed</span>
            <span className="text-sm font-medium text-text-primary">
              {train.speed || 0} mph
            </span>
          </div>

          {/* Capacity */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Capacity</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-secondary-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    train.capacity >= 90 ? 'bg-error' :
                    train.capacity >= 70 ? 'bg-warning': 'bg-success'
                  }`}
                  style={{ width: `${train.capacity}%` }}
                />
              </div>
              <span className="text-sm font-medium text-text-primary">
                {train.capacity}%
              </span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Last updated</span>
            <span>{new Date(train.lastUpdated).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="primary"
            fullWidth
            onClick={() => onViewRoute && onViewRoute(train)}
            iconName="Route"
            iconPosition="left"
          >
            View Full Route
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Bell"
              iconPosition="left"
            >
              Set Alert
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Share"
              iconPosition="left"
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainPopup;