import React, { useState, useEffect } from 'react';
import { Activity, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import trainService from '../../../utils/trainService';
import alertService from '../../../utils/alertService';

const SystemMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalTrains: 0,
    activeTrains: 0,
    onTimeTrains: 0,
    delayedTrains: 0,
    cancelledTrains: 0,
    activeAlerts: 0,
    criticalAlerts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      try {
        setIsLoading(true);

        const [trainsResult, alertsResult] = await Promise.all([
          trainService.getTrains(),
          alertService.getAllAlerts()
        ]);

        if (isMounted) {
          const trains = trainsResult?.data || [];
          const alerts = alertsResult?.data || [];

          const newMetrics = {
            totalTrains: trains.length,
            activeTrains: trains.filter(t => t?.status !== 'cancelled').length,
            onTimeTrains: trains.filter(t => t?.status === 'on-time').length,
            delayedTrains: trains.filter(t => t?.status === 'delayed').length,
            cancelledTrains: trains.filter(t => t?.status === 'cancelled').length,
            activeAlerts: alerts.filter(a => a?.is_active).length,
            criticalAlerts: alerts.filter(a => a?.is_active && a?.alert_level === 'critical').length
          };

          setMetrics(newMetrics);
          setLastUpdated(new Date());
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMetrics();

    // Update metrics every 30 seconds
    const interval = setInterval(loadMetrics, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const calculatePerformance = () => {
    if (metrics.activeTrains === 0) return 0;
    return Math.round((metrics.onTimeTrains / metrics.activeTrains) * 100);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-border rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-border rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const performance = calculatePerformance();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">System Metrics</h2>
        {lastUpdated && (
          <p className="text-sm text-text-secondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Trains */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">Active Trains</p>
              <p className="text-2xl font-bold text-text-primary">{metrics.activeTrains}</p>
              <p className="text-xs text-text-muted">of {metrics.totalTrains} total</p>
            </div>
            <div className="p-3 bg-primary-light rounded-lg">
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* On-Time Performance */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">On-Time Performance</p>
              <p className="text-2xl font-bold text-text-primary">{performance}%</p>
              <p className="text-xs text-text-muted">{metrics.onTimeTrains} on time</p>
            </div>
            <div className={`p-3 rounded-lg ${
              performance >= 90 ? 'bg-success-light' : 
              performance >= 70 ? 'bg-warning-light' : 'bg-error-light'
            }`}>
              <Clock className={`w-6 h-6 ${
                performance >= 90 ? 'text-success' : 
                performance >= 70 ? 'text-warning' : 'text-error'
              }`} />
            </div>
          </div>
        </div>

        {/* Delayed Trains */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">Delayed Trains</p>
              <p className="text-2xl font-bold text-warning">{metrics.delayedTrains}</p>
              <p className="text-xs text-text-muted">{metrics.cancelledTrains} cancelled</p>
            </div>
            <div className="p-3 bg-warning-light rounded-lg">
              <TrendingUp className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">Active Alerts</p>
              <p className="text-2xl font-bold text-text-primary">{metrics.activeAlerts}</p>
              <p className="text-xs text-text-muted">{metrics.criticalAlerts} critical</p>
            </div>
            <div className={`p-3 rounded-lg ${
              metrics.criticalAlerts > 0 ? 'bg-error-light' : 'bg-info-light'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${
                metrics.criticalAlerts > 0 ? 'text-error' : 'text-info'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-6 bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${
              performance >= 90 ? 'text-success' : 
              performance >= 70 ? 'text-warning' : 'text-error'
            }`}>
              {performance}%
            </div>
            <p className="text-sm text-text-secondary">Overall Performance</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold mb-1 text-text-primary">
              {metrics.activeTrains > 0 ? Math.round((metrics.delayedTrains / metrics.activeTrains) * 100) : 0}%
            </div>
            <p className="text-sm text-text-secondary">Delay Rate</p>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${
              metrics.criticalAlerts === 0 ? 'text-success' : 'text-error'
            }`}>
              {metrics.criticalAlerts === 0 ? 'Good' : 'Issues'}
            </div>
            <p className="text-sm text-text-secondary">System Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMetrics;