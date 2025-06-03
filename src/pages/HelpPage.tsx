import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Book,
  Video,
  MessageCircle,
  Search,
  ChevronRight,
  FileText,
  Play,
  Users,
  Zap,
  Shield,
  CreditCard,
  Settings,
  Layers,
  Palette,
  Download,
  Upload,
  Mail
} from 'lucide-react';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'getting-started', name: 'Getting Started', icon: Zap },
    { id: 'design', name: 'Design Tools', icon: Layers },
    { id: 'collaboration', name: 'Collaboration', icon: Users },
    { id: 'billing', name: 'Billing & Plans', icon: CreditCard },
    { id: 'account', name: 'Account & Security', icon: Shield },
    { id: 'technical', name: 'Technical Support', icon: Settings },
  ];

  const popularArticles = [
    {
      id: 1,
      title: 'How to Create Your First Kitchen Design',
      category: 'getting-started',
      icon: Palette,
      readTime: '5 min read',
      views: 15234
    },
    {
      id: 2,
      title: 'Understanding the 3D Design Tools',
      category: 'design',
      icon: Layers,
      readTime: '8 min read',
      views: 12456
    },
    {
      id: 3,
      title: 'Collaborating with Team Members',
      category: 'collaboration',
      icon: Users,
      readTime: '4 min read',
      views: 9876
    },
    {
      id: 4,
      title: 'Exporting and Sharing Your Designs',
      category: 'design',
      icon: Download,
      readTime: '3 min read',
      views: 8234
    },
    {
      id: 5,
      title: 'Managing Your Subscription',
      category: 'billing',
      icon: CreditCard,
      readTime: '4 min read',
      views: 7654
    },
    {
      id: 6,
      title: 'Importing CAD Files',
      category: 'technical',
      icon: Upload,
      readTime: '6 min read',
      views: 6543
    }
  ];

  const videoTutorials = [
    {
      id: 1,
      title: 'ModularSpace Overview',
      duration: '3:45',
      thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=225&fit=crop',
      level: 'Beginner'
    },
    {
      id: 2,
      title: 'Advanced 3D Modeling',
      duration: '12:30',
      thumbnail: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=225&fit=crop',
      level: 'Advanced'
    },
    {
      id: 3,
      title: 'AI Features Explained',
      duration: '8:15',
      thumbnail: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=225&fit=crop',
      level: 'Intermediate'
    }
  ];

  const filteredArticles = popularArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <HelpCircle className="mx-auto h-16 w-16 mb-6" />
            <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
            <p className="text-xl mb-8 text-blue-100">
              Search our knowledge base or browse topics below
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <Video className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorials</h3>
            <p className="text-gray-600 mb-4">
              Learn with step-by-step video guides
            </p>
            <Link to="/help/videos" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              Watch videos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <Book className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
            <p className="text-gray-600 mb-4">
              Detailed guides and API documentation
            </p>
            <Link to="/docs" className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
              Read docs
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <MessageCircle className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-gray-600 mb-4">
              Get help from our support team
            </p>
            <Link to="/contact" className="text-green-600 hover:text-green-700 font-medium flex items-center">
              Contact us
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <article.icon className="h-8 w-8 text-gray-400 mr-4 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        <Link to={`/help/article/${article.id}`} className="hover:text-blue-600">
                          {article.title}
                        </Link>
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{article.readTime}</span>
                        <span className="mx-2">•</span>
                        <span>{article.views.toLocaleString()} views</span>
                        <span className="mx-2">•</span>
                        <span className="capitalize">{article.category.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No articles found matching your search.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Video Tutorials */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Tutorials</h3>
              <div className="space-y-4">
                {videoTutorials.map((video) => (
                  <div key={video.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900">{video.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{video.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-blue-50 rounded-lg p-6">
              <Mail className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can't find what you need?
              </h3>
              <p className="text-gray-600 mb-4">
                Our support team is here to help you 24/7
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;