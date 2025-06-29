import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentSearches = ({ 
  recentSearches = [], 
  onSelectSearch,
  onClearHistory,
  className = ""
}) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (recentSearches.length === 0) {
    return (
      <div className={`bg-surface rounded-lg border border-border p-6 ${className}`}>
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-surface-secondary rounded-full flex items-center justify-center mx-auto">
            <Icon name="Clock" size={20} className="text-text-secondary" />
          </div>
          <div>
            <h4 className="font-medium text-text-primary">No recent searches</h4>
            <p className="text-sm text-text-secondary">
              Your recent route searches will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface rounded-lg border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={20} className="text-primary" />
            <div>
              <h3 className="font-semibold text-text-primary">Recent Searches</h3>
              <p className="text-sm text-text-secondary">
                {recentSearches.length} recent search{recentSearches.length !== 1 ? 'es' : ''}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={onClearHistory}
            className="text-text-secondary hover:text-error"
            title="Clear history"
          />
        </div>
      </div>

      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {recentSearches.map((search) => (
          <button
            key={search.id}
            onClick={() => onSelectSearch(search)}
            className="w-full p-4 text-left hover:bg-surface-secondary transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} className="text-primary" />
                    <span className="font-medium text-text-primary truncate">
                      {search.fromStationName}
                    </span>
                  </div>
                  <Icon name="ArrowRight" size={14} className="text-text-secondary" />
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} className="text-error" />
                    <span className="font-medium text-text-primary truncate">
                      {search.toStationName}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>{new Date(search.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{search.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name={search.type === 'depart' ? 'ArrowRight' : 'ArrowLeft'} size={14} />
                    <span>{search.type === 'depart' ? 'Depart at' : 'Arrive by'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1 ml-4">
                <span className="text-xs text-text-secondary">
                  {formatTime(search.searchedAt)}
                </span>
                {search.routesFound > 0 && (
                  <span className="text-xs bg-success-100 text-success-600 px-2 py-1 rounded">
                    {search.routesFound} route{search.routesFound !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Preview of Best Route */}
            {search.bestRoute && (
              <div className="mt-3 p-3 bg-surface-secondary rounded-md">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} className="text-text-secondary" />
                      <span className="text-text-primary font-medium">
                        {search.bestRoute.duration}m
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="ArrowRightLeft" size={14} className="text-text-secondary" />
                      <span className="text-text-primary">
                        {search.bestRoute.transfers} transfer{search.bestRoute.transfers !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="DollarSign" size={14} className="text-text-secondary" />
                      <span className="text-text-primary">${search.bestRoute.cost}</span>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-text-secondary" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;