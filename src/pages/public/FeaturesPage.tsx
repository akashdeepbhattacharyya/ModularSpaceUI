import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Palette,
  Box,
  Users,
  Zap,
  Shield,
  Globe,
  Smartphone,
  BarChart,
  Cloud,
  Lock,
  Layers,
  Camera,
  Mic,
  Download,
  Share2,
  RefreshCw,
  DollarSign,
  Clock,
  CheckCircle,
  Play,
  X
} from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  category: string;
  image?: string;
  video?: string;
}

const FeaturesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showVideo, setShowVideo] = useState(false);

  const categories = [
    { id: 'all', name: 'All Features' },
    { id: 'ai', name: 'AI & Automation' },
    { id: 'design', name: 'Design Tools' },
    { id: 'collaboration', name: 'Collaboration' },
    { id: 'business', name: 'Business' },
  ];

  const features: Feature[] = [
    {
      icon: Camera,
      title: 'AI Photo Analysis',
      description: 'Upload a photo of any kitchen and watch our AI transform it into an editable 3D design in seconds.',
      category: 'ai',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    },
    {
      icon: Sparkles,
      title: 'Smart Layout Optimization',
      description: 'AI analyzes your space and suggests optimal layouts based on ergonomics and efficiency.',
      category: 'ai',
    },
    {
      icon: Mic,
      title: 'Voice Commands',
      description: 'Design hands-free with natural language commands like "make the cabinets white" or "add an island".',
      category: 'ai',
    },
    {
      icon: Palette,
      title: 'Real-time Material Swapping',
      description: 'Change materials, colors, and finishes instantly with one click and see photorealistic results.',
      category: 'design',
    },
    {
      icon: Box,
      title: '3D & AR Visualization',
      description: 'Walk through your design in 3D or place it in your actual space using AR on your phone.',
      category: 'design',
    },
    {
      icon: Layers,
      title: '2D Floor Plans',
      description: 'Switch seamlessly between 2D and 3D views with professional-grade floor plan tools.',
      category: 'design',
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Work simultaneously with designers, contractors, and family members on the same project.',
      category: 'collaboration',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share designs via link, embed in websites, or present in full-screen mode to clients.',
      category: 'collaboration',
    },
    {
      icon: RefreshCw,
      title: 'Version History',
      description: 'Never lose work with automatic saves and the ability to restore any previous version.',
      category: 'collaboration',
    },
    {
      icon: DollarSign,
      title: 'Instant Cost Estimation',
      description: 'Get real-time pricing from verified vendors as you design, with no hidden costs.',
      category: 'business',
    },
    {
      icon: BarChart,
      title: 'Project Analytics',
      description: 'Track project progress, budget usage, and team productivity with detailed analytics.',
      category: 'business',
    },
    {
      icon: Download,
      title: 'Professional Exports',
      description: 'Export designs in multiple formats including PDF, DWG, 3D models, and shopping lists.',
      category: 'business',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption, SSO support, and compliance with industry standards.',
      category: 'business',
    },
    {
      icon: Cloud,
      title: 'Cloud Storage',
      description: 'All projects backed up automatically with unlimited cloud storage on paid plans.',
      category: 'design',
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Design on the go with native iOS and Android apps featuring full functionality.',
      category: 'design',
    },
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  const highlights = [
    {
      title: 'Faster Design Process',
      value: '10x',
      description: 'Complete designs in minutes, not hours',
    },
    {
      title: 'Cost Savings',
      value: '40%',
      description: 'Average savings on kitchen renovations',
    },
    {
      title: 'Accuracy',
      value: '99.9%',
      description: 'Precision in measurements and estimates',
    },
    {
      title: 'User Satisfaction',
      value: '4.9/5',
      description: 'Average rating from 10,000+ reviews',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Modern Kitchen Design
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Everything you need to create stunning kitchen designs, powered by cutting-edge AI 
              and built for professionals and homeowners alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </Link>
              <button
                onClick={() => setShowVideo(true)}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 space-x-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden group"
              >
                {feature.image && (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                  <Link
                    to="/auth/register"
                    className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium group-hover:underline"
                  >
                    Learn more →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Teams Choose ModularSpace
            </h2>
            <p className="text-lg text-gray-600">
              Real results from real users
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">{highlight.value}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{highlight.title}</h3>
                <p className="text-sm text-gray-600">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Spotlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                <Sparkles className="h-4 w-4 mr-1" />
                Feature Spotlight
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                AI That Understands Your Vision
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our proprietary AI doesn't just recognize objects—it understands design intent. 
                Upload a photo, describe your dream kitchen, or start from scratch, and watch 
                as intelligent algorithms bring your vision to life.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">
                    Automatically detects room dimensions and existing features
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">
                    Suggests optimal layouts based on your preferences
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="ml-3 text-gray-700">
                    Learns from millions of successful designs
                  </span>
                </li>
              </ul>
              <Link
                to="/auth/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Try AI Design Assistant
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
                  alt="AI Kitchen Design"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">AI Assistant</p>
                      <p className="text-xs text-gray-600">Analyzing your space...</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Integrates With Your Favorite Tools
            </h2>
            <p className="text-lg text-gray-600">
              Seamlessly connect ModularSpace with your existing workflow
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            {['AutoCAD', 'SketchUp', 'Revit', 'Google Drive', 'Dropbox', 'Slack'].map((tool) => (
              <div key={tool} className="flex items-center justify-center">
                <div className="h-16 w-32 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <span className="text-gray-600 font-medium">{tool}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Experience the Future of Kitchen Design
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals and homeowners already using ModularSpace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/register"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="ModularSpace Demo"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturesPage;