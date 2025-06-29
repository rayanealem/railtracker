import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RouteCard = ({ 
  route, 
  onViewOnMap, 
  onSaveRoute,
  className = ""
}) => {
  const formatTime = (timeString) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getDelayColor = (delay) => {
    if (delay === 0) return 'text-success';
    if (delay <= 5) return 'text-warning';
    return 'text-error';
  };

  const getDelayText = (delay) => {
    if (delay === 0) return 'On time';
    return `${delay}min delay`;
  };

  return (
    <div className={`bg-surface rounded-lg border border-border p-6 hover:shadow-md transition-shadow duration-200 ${className}`}>
      {/* Route Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <div className="text-lg font-semibold text-text-primary">
              {formatTime(route.departureTime)} → {formatTime(route.arrivalTime)}
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">
                {formatDuration(route.duration)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Icon name="ArrowRightLeft" size={14} className="text-text-secondary" />
              <span className="text-text-secondary">
                {route.transfers} transfer{route.transfers !== 1 ? 's' : ''}
              </span>
            </div>
            <div className={`flex items-center space-x-1 ${getDelayColor(route.delay)}`}>
              <Icon name="AlertCircle" size={14} />
              <span className="font-medium">
                {getDelayText(route.delay)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Heart"
            onClick={() => onSaveRoute(route)}
            title="Save route"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Map"
            iconPosition="left"
            onClick={() => onViewOnMap(route)}
          >
            View on Map
          </Button>
        </div>
      </div>

      {/* Route Steps */}
      <div className="space-y-3">
        {route.steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            {/* Step Icon */}
            <div className="flex-shrink-0 mt-1">
              {step.type === 'train' ? (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold`}
                     style={{ backgroundColor: step.lineColor }}>
                  {step.lineCode}
                </div>
              ) : (
                <div className="w-6 h-6 bg-surface-secondary rounded-full flex items-center justify-center">
                  <Icon name="Footprints" size={12} className="text-text-secondary" />
                </div>
              )}
            </div>

            {/* Step Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">
                    {step.type === 'train' ? step.lineName : 'Walk'}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {step.type === 'train' 
                      ? `${step.fromStation} → ${step.toStation}`
                      : `${step.description} (${step.duration})`
                    }
                  </p>
                </div>
                <div className="text-right text-sm text-text-secondary">
                  {step.type === 'train' && (
                    <>
                      <div>{formatTime(step.departureTime)}</div>
                      <div>Platform {step.platform}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Step Alerts */}
              {step.alerts && step.alerts.length > 0 && (
                <div className="mt-2">
                  {step.alerts.map((alert, alertIndex) => (
                    <div key={alertIndex} className="flex items-start space-x-2 p-2 bg-warning-50 rounded text-sm">
                      <Icon name="AlertTriangle" size={14} className="text-warning mt-0.5" />
                      <span className="text-warning-600">{alert}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Route Footer */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-text-secondary">
              Total cost: <span className="font-medium text-text-primary">${route.cost}</span>
            </span>
            <span className="text-text-secondary">
              Distance: <span className="font-medium text-text-primary">{route.distance} miles</span>
            </span>
          </div>
          <div className="flex items-center space-x-1 text-text-secondary">
            <Icon name="Zap" size={14} />
            <span>Updated {route.lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;