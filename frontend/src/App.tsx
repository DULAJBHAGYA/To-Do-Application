import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import { authService } from './services/authService';
import type { User } from './services/authService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const user = authService.getUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    const user = authService.getUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowLogin(true); // Reset to login page after logout
  };

  const switchToRegister = () => {
    setShowLogin(false);
  };

  const switchToLogin = () => {
    setShowLogin(true);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        {showLogin ? (
          <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={switchToRegister} />
        ) : (
          <Register onRegisterSuccess={handleLoginSuccess} onSwitchToLogin={switchToLogin} />
        )}
      </div>
    );
  }

  // Show main application if authenticated
  return (
    <div className="min-h-screen bg-gray-100">
      <Layout currentUser={currentUser} onLogout={handleLogout} />
    </div>
  );
};

export default App;