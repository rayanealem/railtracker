import React from 'react';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AlertCard = ({ alert, onDismiss }) => {
  const getAlertIcon = (level) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertStyles = (level) => {
    switch (level) {
      case 'critical':
        return {
          container: 'bg-error-light border-error text-error-dark',
          icon: 'text-error',
          button: 'text-error hover:text-error-dark'
        };
      case 'warning':
        return {
          container: 'bg-warning-light border-warning text-warning-dark',
          icon: 'text-warning',
          button: 'text-warning hover:text-warning-dark'
        };
      case 'info':
        return {
          container: 'bg-info-light border-info text-info-dark',
          icon: 'text-info',
          button: 'text-info hover:text-info-dark'
        };
      default:
        return {
          container: 'bg-surface border-border text-text-primary',
          icon: 'text-text-secondary',
          button: 'text-text-secondary hover:text-text-primary'
        };
    }
  };

  if (!alert) return null;

  const styles = getAlertStyles(alert?.alert_level);
  const timeAgo = alert?.created_at ? formatDistanceToNow(new Date(alert.created_at), { addSuffix: true }) : '';

  return (
    <div className={`border rounded-lg p-4 ${styles.container}`}>
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {getAlertIcon(alert?.alert_level)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium mb-1">
                {alert?.message || 'Service Alert'}
              </h4>
              {timeAgo && (
                <p className="text-sm opacity-75">
                  {timeAgo}
                </p>
              )}
            </div>
            
            {onDismiss && (
              <button
                onClick={() => onDismiss?.(alert?.id)}
                className={`flex-shrink-0 ml-3 p-1 rounded-md transition-colors ${styles.button}`}
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;