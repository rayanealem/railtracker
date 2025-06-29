import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Login from "pages/login";
import PublicTransitDashboard from "pages/public-transit-dashboard";
import AdminDashboard from "pages/admin-dashboard";
import RoutePlanner from "pages/route-planner";
import InteractiveLiveMap from "pages/interactive-live-map";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<PublicTransitDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/public-transit-dashboard" element={<PublicTransitDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/route-planner" element={<RoutePlanner />} />
        <Route path="/interactive-live-map" element={<InteractiveLiveMap />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;