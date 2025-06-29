import React from 'react';
import { Clock, MapPin, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TrainStatusCard = ({ train }) => {
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'on-time':
        return 'On Time';
      case 'delayed':
        return 'Delayed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const formatETA = (eta) => {
    if (!eta) return 'N/A';
    
    try {
      const etaDate = new Date(eta);
      const now = new Date();
      const diffMinutes = Math.round((etaDate - now) / (1000 * 60));
      
      if (diffMinutes <= 0) {
        return 'Arriving';
      } else if (diffMinutes === 1) {
        return '1 min';
      } else {
        return `${diffMinutes} min`;
      }
    } catch (error) {
      return 'N/A';
    }
  };

  if (!train) return null;

  const statusColor = getStatusColor(train?.status);
  const statusLabel = getStatusLabel(train?.status);
  const etaFormatted = formatETA(train?.eta);

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary text-lg mb-1">
            {train?.train_identifier || 'Unknown Train'}
          </h3>
          <p className="text-text-secondary text-sm">
            {train?.direction || 'Direction Unknown'}
          </p>
        </div>
        
        <div className={`flex items-center space-x-1 text-sm font-medium ${statusColor}`}>
          {train?.status === 'delayed' && <AlertCircle className="w-4 h-4" />}
          <span>{statusLabel}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-text-secondary flex-shrink-0" />
          <span className="text-text-secondary">To:</span>
          <span className="font-medium text-text-primary">
            {train?.destination_station?.name || 'Unknown Destination'}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-text-secondary flex-shrink-0" />
          <span className="text-text-secondary">Current:</span>
          <span className="font-medium text-text-primary">
            {train?.current_station?.name || 'Unknown Location'}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4 text-text-secondary flex-shrink-0" />
          <span className="text-text-secondary">ETA:</span>
          <span className={`font-medium ${statusColor}`}>
            {etaFormatted}
          </span>
        </div>
      </div>

      {train?.is_delayed && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-warning">
            This train is experiencing delays
          </p>
        </div>
      )}

      {train?.updated_at && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-text-muted">
            Last updated {formatDistanceToNow(new Date(train.updated_at), { addSuffix: true })}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrainStatusCard;