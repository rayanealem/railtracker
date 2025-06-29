import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import TrainManagement from './components/TrainManagement';
import AlertManagement from './components/AlertManagement';
import SystemMetrics from './components/SystemMetrics';
import QuickActions from './components/QuickActions';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading, signOut } = useAuth();
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    // TODO: Before production deployment
    // 1. Wrap protected routes with <ProtectedRoute> component
    // 2. Remove preview mode fallbacks
    // 3. Test all authentication flows
    // 4. Verify role-based access controls
    
    // Preview Mode - Allow access for development
    setDashboardLoading(false);
  }, [user, userProfile]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      // Logout failed, but redirect anyway
      navigate('/login');
    }
  };

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Preview Mode: Show dashboard even if not authenticated
  const displayUser = user || {
    email: 'admin@preview.com',
    user_metadata: { full_name: 'Preview Admin' }
  };

  const displayProfile = userProfile || {
    full_name: 'Preview Admin',
    role: 'admin',
    email: 'admin@preview.com'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Mode Banner */}
      {!user && (
        <div className="bg-warning text-warning-dark px-4 py-2 text-center text-sm">
          Preview Mode - This is the Admin Dashboard. 
          <button 
            onClick={() => navigate('/login')} 
            className="ml-2 underline hover:no-underline"
          >
            Sign in to access full functionality
          </button>
        </div>
      )}

      {/* Header */}
      <AuthenticatedHeader user={displayUser} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary font-heading">
                  Admin Dashboard
                </h1>
                <p className="text-text-secondary mt-2">
                  Manage trains, alerts, and monitor system performance
                </p>
              </div>
              <div className="mt-4 sm:mt-0 text-sm text-text-secondary">
                <div className="flex items-center space-x-4">
                  <span>Welcome back, {displayProfile?.full_name || 'Admin'}</span>
                  <span>•</span>
                  <span>{userProfile?.role || 'admin'} access</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="mb-8">
            <SystemMetrics />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Panel - Trains Management */}
            <div className="xl:col-span-6">
              <TrainManagement />
            </div>

            {/* Right Panel - Alerts Management */}
            <div className="xl:col-span-6">
              <AlertManagement />
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mt-8">
            <QuickActions />
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-text-secondary">
                <p>
                  © {new Date().getFullYear()} RailTracker Admin Portal. All rights reserved.
                </p>
              </div>
              <div className="flex items-center space-x-6 mt-4 sm:mt-0 text-sm text-text-secondary">
                <button className="hover:text-text-primary transition-colors duration-200">
                  System Status
                </button>
                <button className="hover:text-text-primary transition-colors duration-200">
                  Documentation
                </button>
                <button className="hover:text-text-primary transition-colors duration-200">
                  Support
                </button>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;