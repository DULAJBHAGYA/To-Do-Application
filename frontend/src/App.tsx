import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import { authService } from './services/authService';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        setIsAuthenticated(true);
        setCurrentUser(JSON.parse(user));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleLoginSuccess = () => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  };

  const handleRegisterSuccess = () => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        {isAuthenticated ? (
          <Layout currentUser={currentUser} onLogout={handleLogout} />
        ) : (
          <div className="min-h-screen">
            {showLogin ? (
              <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setShowLogin(false)} />
            ) : (
              <Register onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={() => setShowLogin(true)} />
            )}
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;