import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const popularPages = [
    { name: 'Dashboard', path: '/app/dashboard' },
    { name: 'Projects', path: '/app/projects' },
    { name: 'Designer', path: '/app/designer' },
    { name: 'Help Center', path: '/help' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center"
            >
              <span className="text-9xl font-bold text-gray-300">4</span>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-4"
              >
                <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="h-12 w-12 text-white" />
                </div>
              </motion.div>
              <span className="text-9xl font-bold text-gray-300">4</span>
            </motion.div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! Page not found
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you may have mistyped the URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Homepage
            </Link>
          </div>

          {/* Popular Pages */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Popular pages you might be looking for:
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {popularPages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow text-left"
                >
                  <h3 className="font-medium text-gray-900">{page.name}</h3>
                  <p className="text-sm text-gray-500">{page.path}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <HelpCircle className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Need help?
            </h3>
            <p className="text-gray-600 mb-4">
              If you're having trouble finding what you need, our support team is here to help.
            </p>
            <Link
              to="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact Support →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;