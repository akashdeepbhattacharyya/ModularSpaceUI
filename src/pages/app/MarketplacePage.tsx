import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ShoppingCart,
  Package,
  Star,
  Download,
  Eye,
  Heart,
  Tag,
  TrendingUp,
  Clock,
  Shield,
  Award,
  Grid,
  List,
  ChevronRight,
  DollarSign,
  Sparkles,
  Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: 'template' | 'material' | 'model' | 'plugin';
  price: number;
  currency: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  images: string[];
  rating: number;
  reviews: number;
  downloads: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  compatible: string[];
}

const MarketplacePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items', icon: Grid, count: 1234 },
    { id: 'template', name: 'Templates', icon: Package, count: 456 },
    { id: 'material', name: 'Materials', icon: Sparkles, count: 389 },
    { id: 'model', name: '3D Models', icon: Package, count: 267 },
    { id: 'plugin', name: 'Plugins', icon: Zap, count: 122 },
  ];

  const { data: marketplaceItems, isLoading } = useQuery({
    queryKey: ['marketplace', searchTerm, selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      // Mock data for now
      return mockMarketplaceItems;
    }
  });

  const { data: featuredItems } = useQuery({
    queryKey: ['marketplace-featured'],
    queryFn: async () => {
      return mockMarketplaceItems.filter(item => item.featured);
    }
  });

  const purchaseItem = async (itemId: string) => {
    try {
      await axios.post(`/marketplace/purchase/${itemId}`);
      toast.success('Item purchased successfully!');
    } catch (error) {
      toast.error('Failed to purchase item');
    }
  };

  const addToWishlist = async (itemId: string) => {
    try {
      await axios.post(`/marketplace/wishlist/${itemId}`);
      toast.success('Added to wishlist');
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
        <p className="mt-1 text-sm text-gray-500">
          Discover templates, materials, and plugins to enhance your designs
        </p>
      </div>

      {/* Featured Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Featured This Week</h2>
              <p className="text-blue-100 mb-4">
                Hand-picked items to take your designs to the next level
              </p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Explore Featured
              </button>
            </div>
            <div className="hidden lg:block">
              <Award className="h-32 w-32 text-blue-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search marketplace..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div className="flex items-center space-x-2 border-l pl-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <category.icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </div>
                  <span className="text-xs text-gray-500">{category.count}</span>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}+</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['Modern', 'Minimalist', 'Luxury', 'Eco-friendly', 'Smart Home'].map(tag => (
                  <button
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Stats Bar */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Weekly Sales</p>
                  <p className="text-xl font-bold text-gray-900">2,341</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Avg Rating</p>
                  <p className="text-xl font-bold text-gray-900">4.8</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Verified Sellers</p>
                  <p className="text-xl font-bold text-gray-900">189</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">New Today</p>
                  <p className="text-xl font-bold text-gray-900">47</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Grid/List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaceItems?.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    {item.featured && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                          FEATURED
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => addToWishlist(item.id)}
                          className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                        >
                          <Heart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate flex-1">
                        {item.name}
                      </h3>
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center mb-3">
                      <img
                        src={item.author.avatar}
                        alt={item.author.name}
                        className="h-6 w-6 rounded-full mr-2"
                      />
                      <span className="text-xs text-gray-600">{item.author.name}</span>
                      {item.author.verified && (
                        <Shield className="h-3 w-3 text-blue-500 ml-1" />
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        {item.rating} ({item.reviews})
                      </div>
                      <div className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {item.downloads}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        ${item.price}
                      </span>
                      <button
                        onClick={() => purchaseItem(item.id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4 inline mr-1" />
                        Buy Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {marketplaceItems?.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="h-24 w-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            {item.name}
                            {item.featured && (
                              <span className="ml-2 px-2 py-1 text-xs font-bold bg-yellow-400 text-yellow-900 rounded-full">
                                FEATURED
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <img
                                src={item.author.avatar}
                                alt={item.author.name}
                                className="h-5 w-5 rounded-full mr-1"
                              />
                              {item.author.name}
                              {item.author.verified && (
                                <Shield className="h-3 w-3 text-blue-500 ml-1" />
                              )}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              {item.rating}
                            </span>
                            <span>•</span>
                            <span>{item.downloads} downloads</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${item.price}</p>
                          <div className="mt-2 space-x-2">
                            <button
                              onClick={() => addToWishlist(item.id)}
                              className="p-2 text-gray-400 hover:text-red-600"
                            >
                              <Heart className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => purchaseItem(item.id)}
                              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock data
const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Premium Kitchen Cabinet Set',
    description: 'High-quality 3D models of modern kitchen cabinets with customizable materials',
    category: 'model',
    price: 49.99,
    currency: 'USD',
    author: {
      id: '1',
      name: 'Design Studio Pro',
      avatar: 'https://ui-avatars.com/api/?name=Design+Studio&background=3B82F6&color=fff',
      verified: true
    },
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'],
    rating: 4.8,
    reviews: 234,
    downloads: 1567,
    tags: ['kitchen', 'cabinets', 'modern', '3d-model'],
    createdAt: '2024-01-15',
    updatedAt: '2024-06-01',
    featured: true,
    compatible: ['ModularSpace Pro', 'ModularSpace Home']
  },
  {
    id: '2',
    name: 'Marble Material Pack',
    description: '50+ photorealistic marble textures for countertops and backsplashes',
    category: 'material',
    price: 29.99,
    currency: 'USD',
    author: {
      id: '2',
      name: 'TextureMaster',
      avatar: 'https://ui-avatars.com/api/?name=TextureMaster&background=8B5CF6&color=fff',
      verified: true
    },
    images: ['https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=400&h=300&fit=crop'],
    rating: 4.9,
    reviews: 189,
    downloads: 892,
    tags: ['marble', 'texture', 'countertop', 'material'],
    createdAt: '2024-02-20',
    updatedAt: '2024-05-15',
    featured: false,
    compatible: ['All Versions']
  },
  {
    id: '3',
    name: 'Smart Kitchen Layout Optimizer',
    description: 'AI-powered plugin that optimizes kitchen layouts for maximum efficiency',
    category: 'plugin',
    price: 99.99,
    currency: 'USD',
    author: {
      id: '3',
      name: 'AI Solutions Inc',
      avatar: 'https://ui-avatars.com/api/?name=AI+Solutions&background=10B981&color=fff',
      verified: true
    },
    images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop'],
    rating: 4.7,
    reviews: 156,
    downloads: 423,
    tags: ['ai', 'layout', 'optimization', 'plugin'],
    createdAt: '2024-03-10',
    updatedAt: '2024-05-28',
    featured: true,
    compatible: ['ModularSpace Pro']
  }
];

export default MarketplacePage;