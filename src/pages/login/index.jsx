import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginBackground from './components/LoginBackground';

const Login = () => {
  const navigate = useNavigate();
  const { user, signIn, authError, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError?.();
    setError('');

    // If user is already authenticated, redirect to admin dashboard
    if (user) {
      navigate('/admin-dashboard');
    }
  }, [user, navigate, clearError]);

  const handleLogin = async (userData) => {
    setIsLoading(true);
    setError('');
    clearError?.();

    try {
      const result = await signIn(userData.email, userData.password);

      if (result?.success) {
        // Redirect will happen via useEffect when user state updates
      } else {
        setError(result?.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = error || authError;

  return (
    <div className="min-h-screen bg-background">
      {/* Background Elements */}
      <LoginBackground />
      
      {/* Header */}
      <LoginHeader />
      
      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Admin Login
            </h1>
            <p className="text-text-secondary">
              Sign in to access the RailTracker admin dashboard
            </p>
          </div>

          {/* Demo Credentials Notice */}
          <div className="bg-info-light border border-info text-info-dark p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">Demo Credentials</h3>
            <div className="text-sm space-y-1">
              <p><strong>Email:</strong> admin@railtracker.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>

          <LoginForm
            onLogin={handleLogin}
            isLoading={isLoading}
            error={displayError}
          />

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              ← Back to Public Dashboard
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-surface border-t border-border py-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-text-secondary text-sm">
              © {new Date().getFullYear()} RailTracker. All rights reserved.
            </p>
            <p className="text-text-muted text-xs mt-1">
              Secure administrative access for transit management
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;