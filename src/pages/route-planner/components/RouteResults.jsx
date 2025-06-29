import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import RouteCard from './RouteCard';

const RouteResults = ({ 
  routes = [], 
  isLoading = false,
  onViewOnMap,
  onSaveRoute,
  onRefresh,
  className = ""
}) => {
  const [sortBy, setSortBy] = useState('fastest'); // 'fastest', 'cheapest', 'fewest-transfers'

  const sortedRoutes = [...routes].sort((a, b) => {
    switch (sortBy) {
      case 'fastest':
        return a.duration - b.duration;
      case 'cheapest':
        return a.cost - b.cost;
      case 'fewest-transfers':
        return a.transfers - b.transfers;
      default:
        return 0;
    }
  });

  const getSortLabel = (sortType) => {
    switch (sortType) {
      case 'fastest':
        return 'Fastest';
      case 'cheapest':
        return 'Cheapest';
      case 'fewest-transfers':
        return 'Fewest Transfers';
      default:
        return 'Fastest';
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-surface rounded-lg border border-border p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="loading-spinner w-8 h-8" />
          <div className="text-center">
            <p className="font-medium text-text-primary">Planning your journey...</p>
            <p className="text-sm text-text-secondary">Finding the best routes</p>
          </div>
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className={`bg-surface rounded-lg border border-border p-8 ${className}`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto">
            <Icon name="Route" size={24} className="text-text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No routes found
            </h3>
            <p className="text-text-secondary mb-4">
              We couldn't find any routes for your selected stations and time.
            </p>
            <Button
              variant="outline"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={onRefresh}
            >
              Try Different Options
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Results Header */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Journey Options
            </h3>
            <p className="text-sm text-text-secondary">
              {routes.length} route{routes.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-surface border border-border rounded px-3 py-1 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary"
              >
                <option value="fastest">Fastest</option>
                <option value="cheapest">Cheapest</option>
                <option value="fewest-transfers">Fewest Transfers</option>
              </select>
            </div>

            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              onClick={onRefresh}
              title="Refresh routes"
            />
          </div>
        </div>
      </div>

      {/* Route Cards */}
      <div className="space-y-4">
        {sortedRoutes.map((route, index) => (
          <div key={route.id} className="relative">
            {/* Best Route Badge */}
            {index === 0 && (
              <div className="absolute -top-2 left-4 z-10">
                <div className="bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <Icon name="Star" size={12} />
                  <span>Best {getSortLabel(sortBy)}</span>
                </div>
              </div>
            )}
            
            <RouteCard
              route={route}
              onViewOnMap={onViewOnMap}
              onSaveRoute={onSaveRoute}
              className={index === 0 ? 'border-success' : ''}
            />
          </div>
        ))}
      </div>

      {/* Results Footer */}
      <div className="bg-surface-secondary rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-text-secondary">
              <Icon name="Clock" size={14} />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export
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

export default RouteResults;