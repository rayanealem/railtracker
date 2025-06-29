import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavigation from '../../components/ui/PublicNavigation';
import AlertBanner from '../../components/ui/AlertBanner';
import JourneyForm from './components/JourneyForm';
import RouteResults from './components/RouteResults';
import SavedRoutes from './components/SavedRoutes';
import RecentSearches from './components/RecentSearches';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RoutePlanner = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [activeTab, setActiveTab] = useState('plan'); // 'plan', 'saved', 'recent'
  const [alerts, setAlerts] = useState([]);

  // Mock data for stations
  const stations = [
    {
      id: 'central',
      name: 'Central Station',
      code: 'CNT',
      zone: 'Zone 1',
      lines: ['Blue Line', 'Red Line', 'Green Line'],
      status: 'operational',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 'downtown',
      name: 'Downtown Terminal',
      code: 'DWT',
      zone: 'Zone 1',
      lines: ['Blue Line', 'Yellow Line'],
      status: 'operational',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: 'airport',
      name: 'Airport Station',
      code: 'APT',
      zone: 'Zone 3',
      lines: ['Red Line'],
      status: 'delayed',
      coordinates: { lat: 40.6892, lng: -74.1745 }
    },
    {
      id: 'university',
      name: 'University Campus',
      code: 'UNI',
      zone: 'Zone 2',
      lines: ['Green Line', 'Yellow Line'],
      status: 'operational',
      coordinates: { lat: 40.8176, lng: -73.9782 }
    },
    {
      id: 'business',
      name: 'Business District',
      code: 'BUS',
      zone: 'Zone 1',
      lines: ['Blue Line', 'Green Line'],
      status: 'operational',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    {
      id: 'residential',
      name: 'Residential Park',
      code: 'RES',
      zone: 'Zone 2',
      lines: ['Red Line', 'Yellow Line'],
      status: 'maintenance',
      coordinates: { lat: 40.7831, lng: -73.9712 }
    }
  ];

  // Mock data for saved routes
  const [savedRoutes] = useState([
    {
      id: 'saved-1',
      fromStationName: 'Central Station',
      toStationName: 'Business District',
      nickname: 'Daily Commute',
      duration: 25,
      transfers: 0,
      cost: 3.50,
      departureTime: '08:30',
      arrivalTime: '08:55',
      savedAt: '2024-01-15T10:30:00Z',
      steps: [
        {
          type: 'train',
          lineName: 'Blue Line',
          lineCode: 'BL',
          lineColor: '#2563EB',
          fromStation: 'Central Station',
          toStation: 'Business District',
          departureTime: '08:30',
          platform: '2A'
        }
      ]
    },
    {
      id: 'saved-2',
      fromStationName: 'Downtown Terminal',
      toStationName: 'Airport Station',
      nickname: 'Airport Route',
      duration: 45,
      transfers: 1,
      cost: 5.25,
      departureTime: '14:15',
      arrivalTime: '15:00',
      savedAt: '2024-01-10T16:20:00Z',
      steps: [
        {
          type: 'train',
          lineName: 'Blue Line',
          lineCode: 'BL',
          lineColor: '#2563EB',
          fromStation: 'Downtown Terminal',
          toStation: 'Central Station',
          departureTime: '14:15',
          platform: '1B'
        },
        {
          type: 'walk',
          description: 'Transfer to Red Line',
          duration: '5 min'
        },
        {
          type: 'train',
          lineName: 'Red Line',
          lineCode: 'RL',
          lineColor: '#EF4444',
          fromStation: 'Central Station',
          toStation: 'Airport Station',
          departureTime: '14:35',
          platform: '3A'
        }
      ]
    }
  ]);

  // Mock data for recent searches
  const [recentSearches] = useState([
    {
      id: 'recent-1',
      fromStationName: 'Central Station',
      toStationName: 'University Campus',
      date: '2024-01-20',
      time: '09:00',
      type: 'depart',
      searchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      routesFound: 3,
      bestRoute: {
        duration: 35,
        transfers: 1,
        cost: 4.25
      }
    },
    {
      id: 'recent-2',
      fromStationName: 'Business District',
      toStationName: 'Residential Park',
      date: '2024-01-19',
      time: '17:30',
      type: 'depart',
      searchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      routesFound: 2,
      bestRoute: {
        duration: 28,
        transfers: 0,
        cost: 3.75
      }
    }
  ]);

  // Mock alerts
  useEffect(() => {
    setAlerts([
      {
        id: 'alert-1',
        severity: 'warning',
        title: 'Service Update',
        message: 'Red Line experiencing minor delays due to signal maintenance. Allow extra 5-10 minutes for your journey.',
        timestamp: new Date().toISOString(),
        dismissible: true
      }
    ]);
  }, []);

  const handlePlanJourney = async (journeyData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockRoutes = [
        {
          id: 'route-1',
          departureTime: journeyData.time,
          arrivalTime: '09:25',
          duration: 25,
          transfers: 0,
          delay: 0,
          cost: 3.50,
          distance: 8.5,
          lastUpdated: '2 min ago',
          steps: [
            {
              type: 'train',
              lineName: 'Blue Line',
              lineCode: 'BL',
              lineColor: '#2563EB',
              fromStation: stations.find(s => s.id === journeyData.from)?.name || 'Origin',
              toStation: stations.find(s => s.id === journeyData.to)?.name || 'Destination',
              departureTime: journeyData.time,
              platform: '2A'
            }
          ]
        },
        {
          id: 'route-2',
          departureTime: journeyData.time,
          arrivalTime: '09:35',
          duration: 35,
          transfers: 1,
          delay: 3,
          cost: 4.25,
          distance: 12.2,
          lastUpdated: '1 min ago',
          steps: [
            {
              type: 'train',
              lineName: 'Green Line',
              lineCode: 'GL',
              lineColor: '#10B981',
              fromStation: stations.find(s => s.id === journeyData.from)?.name || 'Origin',
              toStation: 'Central Station',
              departureTime: journeyData.time,
              platform: '1B'
            },
            {
              type: 'walk',
              description: 'Transfer to Blue Line',
              duration: '4 min'
            },
            {
              type: 'train',
              lineName: 'Blue Line',
              lineCode: 'BL',
              lineColor: '#2563EB',
              fromStation: 'Central Station',
              toStation: stations.find(s => s.id === journeyData.to)?.name || 'Destination',
              departureTime: '09:15',
              platform: '2A',
              alerts: ['Minor delays expected due to signal maintenance']
            }
          ]
        },
        {
          id: 'route-3',
          departureTime: '09:15',
          arrivalTime: '09:45',
          duration: 30,
          transfers: 0,
          delay: 0,
          cost: 3.75,
          distance: 9.8,
          lastUpdated: '3 min ago',
          steps: [
            {
              type: 'train',
              lineName: 'Yellow Line',
              lineCode: 'YL',
              lineColor: '#F59E0B',
              fromStation: stations.find(s => s.id === journeyData.from)?.name || 'Origin',
              toStation: stations.find(s => s.id === journeyData.to)?.name || 'Destination',
              departureTime: '09:15',
              platform: '3C'
            }
          ]
        }
      ];
      
      setRoutes(mockRoutes);
      setIsLoading(false);
    }, 2000);
  };

  const handleViewOnMap = (route) => {
    // Navigate to interactive map with route data
    navigate('/interactive-live-map', { 
      state: { 
        highlightRoute: route,
        fromStation: route.steps[0]?.fromStation,
        toStation: route.steps[route.steps.length - 1]?.toStation
      }
    });
  };

  const handleSaveRoute = (route) => {
    // In a real app, this would save to backend/localStorage
    console.log('Saving route:', route);
  };

  const handleSelectSavedRoute = (savedRoute) => {
    setActiveTab('plan');
    // Pre-populate form with saved route data
  };

  const handleDeleteSavedRoute = (routeId) => {
    // In a real app, this would delete from backend/localStorage
    console.log('Deleting saved route:', routeId);
  };

  const handleSelectRecentSearch = (search) => {
    setActiveTab('plan');
    // Pre-populate form with recent search data
  };

  const handleClearHistory = () => {
    // In a real app, this would clear from backend/localStorage
    console.log('Clearing search history');
  };

  const handleRefresh = () => {
    setRoutes([]);
    setActiveTab('plan');
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />
      
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="Route" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Route Planner</h1>
              <p className="text-text-secondary">Plan your journey with real-time transit information</p>
            </div>
          </div>

          {/* Alerts */}
          <AlertBanner alerts={alerts} className="mb-4" />
        </div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden mb-6">
          <div className="flex bg-surface-secondary rounded-lg p-1">
            <button
              onClick={() => setActiveTab('plan')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'plan' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="Search" size={16} className="inline mr-2" />
              Plan
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'saved' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="Heart" size={16} className="inline mr-2" />
              Saved
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'recent' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="Clock" size={16} className="inline mr-2" />
              Recent
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Desktop */}
          <div className="lg:col-span-1 space-y-6">
            {/* Journey Form - Always visible on desktop, tab-controlled on mobile */}
            <div className={`${activeTab !== 'plan' ? 'hidden lg:block' : ''}`}>
              <JourneyForm
                stations={stations}
                onPlanJourney={handlePlanJourney}
                isLoading={isLoading}
              />
            </div>

            {/* Saved Routes - Desktop sidebar, mobile tab */}
            <div className={`${activeTab !== 'saved' ? 'hidden lg:block' : ''}`}>
              <SavedRoutes
                savedRoutes={savedRoutes}
                onSelectRoute={handleSelectSavedRoute}
                onDeleteRoute={handleDeleteSavedRoute}
              />
            </div>

            {/* Recent Searches - Desktop sidebar, mobile tab */}
            <div className={`${activeTab !== 'recent' ? 'hidden lg:block' : ''}`}>
              <RecentSearches
                recentSearches={recentSearches}
                onSelectSearch={handleSelectRecentSearch}
                onClearHistory={handleClearHistory}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`lg:col-span-2 ${activeTab === 'plan' || window.innerWidth >= 1024 ? '' : 'hidden'}`}>
            <RouteResults
              routes={routes}
              isLoading={isLoading}
              onViewOnMap={handleViewOnMap}
              onSaveRoute={handleSaveRoute}
              onRefresh={handleRefresh}
            />
          </div>
        </div>

        {/* Quick Actions - Mobile */}
        <div className="lg:hidden fixed bottom-4 right-4 z-100">
          <div className="flex flex-col space-y-2">
            <Button
              variant="primary"
              size="lg"
              iconName="Map"
              onClick={() => navigate('/interactive-live-map')}
              className="rounded-full w-14 h-14 p-0 shadow-lg"
              title="View Live Map"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;