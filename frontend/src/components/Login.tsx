import React, { useState } from 'react';
import { authService } from '../services/authService';
import type { LoginRequest } from '../services/authService';

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState<LoginRequest>({
    usernameOrEmail: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      authService.setToken(response.token);
      authService.setUser({
        id: response.id,
        username: response.username,
        email: response.email
      });
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      if (errorMessage.includes('400')) {
        setError('Invalid username/email or password. Please check your credentials.');
      } else if (errorMessage.includes('401')) {
        setError('Authentication failed. Please check your credentials.');
      } else if (errorMessage.includes('500')) {
        setError('Server error. Please try again later.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 dark:bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Todo-themed floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating checkboxes */}
        <div className="absolute top-20 left-20 transform rotate-12 animate-bounce">
          <div className="w-8 h-8 bg-blue-200 dark:bg-blue-700 rounded border-2 border-blue-300 dark:border-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="absolute top-40 right-32 transform -rotate-6 animate-bounce animation-delay-1000">
          <div className="w-6 h-6 bg-blue-200 dark:bg-blue-700 rounded border-2 border-blue-300 dark:border-blue-600 flex items-center justify-center">
            <svg className="w-3 h-3 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-32 left-32 transform rotate-12 animate-bounce animation-delay-2000">
          <div className="w-10 h-10 bg-blue-200 dark:bg-blue-700 rounded border-2 border-blue-300 dark:border-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Floating task icons */}
        <div className="absolute top-60 right-20 transform rotate-45 animate-pulse">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg border-2 border-blue-200 dark:border-blue-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-60 left-20 transform -rotate-12 animate-pulse animation-delay-1000">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-800 rounded-lg border-2 border-indigo-200 dark:border-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Side - App Information */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  DoTask
                </h1>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome Back!
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Sign in to your account and continue managing your tasks efficiently.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Management</h3>
                  <p className="text-gray-600 dark:text-gray-300">Organize and track your tasks efficiently</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Priority Focus</h3>
                  <p className="text-gray-600 dark:text-gray-300">Focus on what matters most</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress Tracking</h3>
                  <p className="text-gray-600 dark:text-gray-300">Monitor your productivity and progress</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h2>
                  <p className="text-gray-600 dark:text-gray-300">Welcome back to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username/Email Field */}
                  <div>
                    <label htmlFor="usernameOrEmail" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Username or Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="usernameOrEmail"
                        name="usernameOrEmail"
                        value={formData.usernameOrEmail}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter your username or email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {loading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      )}
                      <span className="font-semibold">
                        {loading ? 'Signing In...' : 'Sign In'}
                      </span>
                    </div>
                  </button>
                </form>

                {/* Switch to Register */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    Don't have an account?{' '}
                    <button
                      onClick={onSwitchToRegister}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-red-800 dark:text-red-200 font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-800 dark:text-green-200 font-medium">{success}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 