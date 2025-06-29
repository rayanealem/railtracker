import React, { useState, useEffect } from 'react';
import PublicNavigation from '../../components/ui/PublicNavigation';
import DashboardHeader from './components/DashboardHeader';
import AlertCard from './components/AlertCard';
import TrainStatusCard from './components/TrainStatusCard';
import RoutePlannerWidget from './components/RoutePlannerWidget';
import LiveMapPreview from './components/LiveMapPreview';
import { InlineLoading } from '../../components/ui/LoadingOverlay';
import trainService from '../../utils/trainService';
import alertService from '../../utils/alertService';

const PublicTransitDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [trains, setTrains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load trains and alerts in parallel
        const [trainsResult, alertsResult] = await Promise.all([
          trainService.getTrains(),
          alertService.getCriticalAlerts()
        ]);

        if (isMounted) {
          if (trainsResult?.success) {
            setTrains(trainsResult.data || []);
          } else {
            setError(trainsResult?.error || 'Failed to load train data');
          }

          if (alertsResult?.success) {
            setAlerts(alertsResult.data || []);
          }

          setLastUpdated(new Date().toISOString());
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load transit data');
          setIsLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    let trainSubscription;
    let alertSubscription;

    // Subscribe to train updates
    trainSubscription = trainService.subscribeToTrains((payload) => {
      if (payload.eventType === 'INSERT') {
        setTrains(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setTrains(prev => prev.map(train => 
          train.id === payload.new.id ? payload.new : train
        ));
      } else if (payload.eventType === 'DELETE') {
        setTrains(prev => prev.filter(train => train.id !== payload.old.id));
      }
      setLastUpdated(new Date().toISOString());
    });

    // Subscribe to alert updates
    alertSubscription = alertService.subscribeToAlerts((payload) => {
      if (payload.eventType === 'INSERT' && payload.new.is_active) {
        setAlerts(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setAlerts(prev => prev.map(alert => 
          alert.id === payload.new.id ? payload.new : alert
        ).filter(alert => alert.is_active));
      } else if (payload.eventType === 'DELETE') {
        setAlerts(prev => prev.filter(alert => alert.id !== payload.old.id));
      }
    });

    return () => {
      if (trainSubscription) {
        trainSubscription.unsubscribe();
      }
      if (alertSubscription) {
        alertSubscription.unsubscribe();
      }
    };
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      setIsRefreshing(true);
    }

    try {
      const [trainsResult, alertsResult] = await Promise.all([
        trainService.getTrains(),
        alertService.getCriticalAlerts()
      ]);

      if (trainsResult?.success) {
        setTrains(trainsResult.data || []);
      }

      if (alertsResult?.success) {
        setAlerts(alertsResult.data || []);
      }

      setLastUpdated(new Date().toISOString());
      setError(null);
    } catch (error) {
      setError('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDismissAlert = async (alertId) => {
    try {
      const result = await alertService.updateAlert(alertId, { is_active: false });
      if (result?.success) {
        setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
      }
    } catch (error) {
      // Alert will be filtered out by real-time subscription if successfully updated
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNavigation />
        <div className="flex items-center justify-center h-96">
          <InlineLoading message="Loading transit data..." size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNavigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-error mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.304 17.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">Unable to Load Transit Data</h3>
            <p className="text-text-secondary mb-4">{error}</p>
            <button 
              onClick={() => handleRefresh()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const visibleAlerts = alerts.filter(alert => alert?.alert_level === 'critical' || alert?.alert_level === 'warning');
  const activeTrains = trains.filter(train => train?.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />
      <DashboardHeader onRefresh={handleRefresh} lastUpdated={lastUpdated} />
      
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Critical Alerts Section */}
          {visibleAlerts?.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <h2 className="text-xl font-semibold text-text-primary">Service Alerts</h2>
                <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-3">
                {visibleAlerts.map(alert => (
                  <AlertCard
                    key={alert?.id}
                    alert={alert}
                    onDismiss={handleDismissAlert}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Train Status */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Train Status */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-text-primary">Live Train Status</h2>
                    <div className="flex items-center space-x-1 text-sm text-text-secondary">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span>Live</span>
                    </div>
                  </div>
                  {isRefreshing && (
                    <InlineLoading message="Updating..." size="sm" />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trains?.length > 0 ? trains.map(train => (
                    <TrainStatusCard key={train?.id} train={train} />
                  )) : (
                    <div className="col-span-2 text-center py-8 text-text-secondary">
                      No trains currently available
                    </div>
                  )}
                </div>
              </section>

              {/* Live Map Preview - Mobile/Tablet */}
              <section className="lg:hidden">
                <LiveMapPreview trains={activeTrains} />
              </section>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Route Planner Widget */}
              <RoutePlannerWidget />

              {/* Live Map Preview - Desktop */}
              <div className="hidden lg:block">
                <LiveMapPreview trains={activeTrains} />
              </div>

              {/* Quick Stats */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">System Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Total Lines</span>
                    <span className="font-semibold text-text-primary">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Active Trains</span>
                    <span className="font-semibold text-success">{activeTrains?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">On Time</span>
                    <span className="font-semibold text-success">
                      {activeTrains?.filter(t => t?.status === 'on-time')?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Delayed</span>
                    <span className="font-semibold text-warning">
                      {activeTrains?.filter(t => t?.status === 'delayed')?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Service Alerts</span>
                    <span className="font-semibold text-error">{visibleAlerts?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicTransitDashboard;