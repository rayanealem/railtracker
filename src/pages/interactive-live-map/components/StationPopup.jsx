import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StationPopup = ({ station, onClose, onPlanRoute }) => {
  if (!station) return null;

  const getLineColor = (lineId) => {
    const colors = {
      'blue-line': '#2563EB',
      'red-line': '#DC2626',
      'green-line': '#059669',
      'yellow-line': '#D97706'
    };
    return colors[lineId] || '#64748B';
  };

  const formatArrivalTime = (arrival) => {
    const now = new Date();
    const arrivalTime = new Date(arrival.scheduledTime);
    const diffMinutes = Math.round((arrivalTime - now) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Arriving now';
    if (diffMinutes < 60) return `${diffMinutes} min`;
    return arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-secondary-900 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-surface rounded-lg shadow-xl max-w-md w-full animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="MapPin" size={16} color="white" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">
                {station.name}
              </h3>
              <p className="text-sm text-text-secondary">
                {station.zone} • {station.accessibility ? 'Accessible' : 'Limited Access'}
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
          {/* Lines Served */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Lines Served</h4>
            <div className="flex flex-wrap gap-2">
              {station.lines.map((line) => (
                <div
                  key={line.id}
                  className="flex items-center space-x-1 px-2 py-1 rounded-full text-white text-xs font-medium"
                  style={{ backgroundColor: getLineColor(line.id) }}
                >
                  <Icon name="Train" size={12} />
                  <span className="capitalize">{line.name.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Arrivals */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Upcoming Arrivals</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {station.upcomingArrivals.map((arrival, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-surface-secondary rounded-md">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getLineColor(arrival.line) }}
                    />
                    <div>
                      <div className="text-sm font-medium text-text-primary">
                        {arrival.destination}
                      </div>
                      <div className="text-xs text-text-secondary">
                        Train {arrival.trainNumber}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      arrival.status === 'delayed' ? 'text-warning' : 'text-text-primary'
                    }`}>
                      {formatArrivalTime(arrival)}
                    </div>
                    {arrival.status === 'delayed' && (
                      <div className="text-xs text-warning">
                        {arrival.delayMinutes} min late
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Station Facilities */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Facilities</h4>
            <div className="grid grid-cols-2 gap-2">
              {station.facilities.map((facility) => (
                <div key={facility.type} className="flex items-center space-x-2 text-xs text-text-secondary">
                  <Icon 
                    name={
                      facility.type === 'parking' ? 'Car' :
                      facility.type === 'wifi' ? 'Wifi' :
                      facility.type === 'restroom' ? 'Users' :
                      facility.type === 'elevator' ? 'ArrowUp' :
                      facility.type === 'bike-rack'? 'Bike' : 'Check'
                    } 
                    size={14} 
                    className={facility.available ? 'text-success' : 'text-text-muted'}
                  />
                  <span className={facility.available ? 'text-text-secondary' : 'text-text-muted line-through'}>
                    {facility.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="text-xs text-text-muted">
            <Icon name="MapPin" size={12} className="inline mr-1" />
            {station.address}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="primary"
            fullWidth
            onClick={() => onPlanRoute && onPlanRoute(station)}
            iconName="Route"
            iconPosition="left"
          >
            Plan Route from Here
          </Button>
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Navigation"
              iconPosition="left"
            >
              Directions
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Bell"
              iconPosition="left"
            >
              Alerts
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

export default StationPopup;