import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AlertBanner = ({ alerts = [], onDismiss, className = '' }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  if (!alerts || alerts.length === 0) {
    return null;
  }

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  if (visibleAlerts.length === 0) {
    return null;
  }

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    if (onDismiss) {
      onDismiss(alertId);
    }
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'success':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Info';
    }
  };

  const getAlertClasses = (severity) => {
    switch (severity) {
      case 'success':
        return 'alert-success';
      case 'warning':
        return 'alert-warning';
      case 'error':
        return 'alert-error';
      default:
        return 'bg-primary-50 border-primary text-primary-600';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`alert-banner ${getAlertClasses(alert.severity)} animate-fade-in`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex-shrink-0">
            <Icon 
              name={getAlertIcon(alert.severity)} 
              size={20}
              className="mt-0.5"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            {alert.title && (
              <h4 className="font-semibold text-sm mb-1">
                {alert.title}
              </h4>
            )}
            <p className="text-sm leading-relaxed">
              {alert.message}
            </p>
            {alert.timestamp && (
              <p className="text-xs opacity-75 mt-1 font-data">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>

          {alert.dismissible !== false && (
            <div className="flex-shrink-0 ml-4">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleDismiss(alert.id)}
                iconName="X"
                className="opacity-70 hover:opacity-100 -mr-1"
                title="Dismiss alert"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Example usage with sample alerts
AlertBanner.defaultProps = {
  alerts: [
    {
      id: 'delay-001',
      severity: 'warning',
      title: 'Service Delay',
      message: 'Blue Line experiencing 5-minute delays due to signal maintenance at Central Station.',
      timestamp: new Date().toISOString(),
      dismissible: true
    },
    {
      id: 'maintenance-002',
      severity: 'error',
      title: 'Service Disruption',
      message: 'Red Line suspended between Downtown and Airport stations. Shuttle buses available.',
      timestamp: new Date().toISOString(),
      dismissible: false
    }
  ]
};

export default AlertBanner;