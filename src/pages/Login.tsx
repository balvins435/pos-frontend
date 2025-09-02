"use client";
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoginForm from '../components/Auth/LoginForm';
import ForgotPassword from '../components/Auth/ForgotPassword';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">ERP</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your Enterprise System account
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-lg">
          {showForgotPassword ? (
            <ForgotPassword onBack={() => setShowForgotPassword(false)} />
          ) : (
            <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
          )}

          {/* Register Link */}
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 Enterprise System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
