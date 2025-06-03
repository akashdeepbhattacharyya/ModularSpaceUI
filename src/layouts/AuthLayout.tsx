import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <span className="text-3xl font-bold text-blue-600">ModularSpace</span>
        </Link>
      </div>
      <div className="mt-8">
        <Outlet />
      </div>
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          © 2025 ModularSpace. All rights reserved.{' '}
          <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500">
            Terms
          </Link>
          {' · '}
          <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
            Privacy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;