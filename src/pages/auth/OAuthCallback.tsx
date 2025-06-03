import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const OAuthCallback: React.FC = () => {
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    handleOAuthCallback();
  }, [handleOAuthCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing login...</h2>
        <p className="text-gray-600">Please wait while we set up your account</p>
      </motion.div>
    </div>
  );
};

export default OAuthCallback;