import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Grid,
  List,
  Search,
  Filter,
  Download,
  Eye,
  Star,
  Clock,
  Users,
  Sparkles,
  Home,
  Building,
  Trees,
  Palette,
  DollarSign,
  Copy,
  Heart,
  Share2,
  Lock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  style: string;
  size: string;
  price: number;
  isPremium: boolean;
  rating: number;
  usageCount: number;
  author: string;
  authorAvatar: string;
  createdAt: string;
  features: string[];
}

const TemplatesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'All Templates', icon: Grid },
    { id: 'modern', name: 'Modern', icon: Building },
    { id: 'traditional', name: 'Traditional', icon: Home },
    { id: 'farmhouse', name: 'Farmhouse', icon: Trees },
    { id: 'minimalist', name: 'Minimalist', icon: Sparkles },
    { id: 'luxury', name: 'Luxury', icon: DollarSign },
  ];

  const styles = [
    'all',
    'Contemporary',
    'Scandinavian',
    'Industrial',
    'Mediterranean',
    'Transitional',
    'Rustic',
  ];

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates', searchTerm, selectedCategory, selectedStyle, priceFilter, sortBy],
    queryFn: async () => {
      // Mock data for now
      return mockTemplates;
    }
  });

  const filteredTemplates = templates?.filter(template => {
    if (searchTerm && !template.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all' && template.category !== selectedCategory) {
      return false;
    }
    if (selectedStyle !== 'all' && template.style !== selectedStyle) {
      return false;
    }
    if (priceFilter === 'free' && template.price > 0) {
      return false;
    }
    if (priceFilter === 'premium' && template.price === 0) {
      return false;
    }
    return true;
  }) || [];

  const useTemplate = async (templateId: string) => {
    try {
      const response = await axios.post(`/templates/${templateId}/use`);
      window.location.href = `/app/designer/${response.data.projectId}`;
    } catch (error) {
      console.error('Failed to use template:', error);
    }
  };

  function handleUseTemplate(id: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kitchen Design Templates</h1>
        <p className="mt-1 text-sm text-gray-500">
          Start with a professionally designed template and customize it to your needs
        </p>
      </div>

      {/* Category Pills */}
      <div className="mb-6 flex overflow-x-auto pb-2 space-x-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <category.icon className="h-4 w-4 mr-2" />
            {category.name}
          </button>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Styles</option>
              {styles.slice(1).map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Templates</option>
              <option value="free">Free Only</option>
              <option value="premium">Premium Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Alphabetical</option>
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

      {/* Templates Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Search className="h-12 w-12" />
          </div>
          <h3 className="text-sm font-medium text-gray-900">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search term</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all relative group overflow-hidden"
            >
              {template.isPremium && (
                <div className="absolute top-2 right-2 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    PREMIUM
                  </div>
                </div>
              )}

              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleUseTemplate(template.id)}
                      className="p-3 bg-white rounded-full text-gray-700 hover:text-blue-600 shadow-lg"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    <button className="p-3 bg-white rounded-full text-gray-700 hover:text-blue-600 shadow-lg">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-3 bg-white rounded-full text-gray-700 hover:text-red-600 shadow-lg">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 truncate">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{template.description}</p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={template.authorAvatar}
                      alt={template.author}
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="text-xs text-gray-500">{template.author}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      {template.rating}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {template.usageCount}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {template.price === 0 ? 'Free' : `$${template.price}`}
                  </span>
                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="h-24 w-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        {template.name}
                        {template.isPremium && (
                          <span className="ml-2 px-2 py-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full">
                            PREMIUM
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{template.category}</span>
                        <span>•</span>
                        <span>{template.style}</span>
                        <span>•</span>
                        <span>{template.size}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        {template.price === 0 ? 'Free' : `$${template.price}`}
                      </p>
                      <div className="flex items-center mt-1 space-x-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {template.rating}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {template.usageCount}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={template.authorAvatar}
                        alt={template.author}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-sm text-gray-500">by {template.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <Heart className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Share2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template.id)}
                        className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Mock data
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Modern Minimalist Kitchen',
    description: 'Clean lines and a neutral palette create a sophisticated cooking space',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    category: 'modern',
    style: 'Minimalist',
    size: 'Medium (150-250 sq ft)',
    price: 0,
    isPremium: false,
    rating: 4.8,
    usageCount: 1234,
    author: 'ModularSpace Team',
    authorAvatar: 'https://ui-avatars.com/api/?name=ModularSpace&background=3B82F6&color=fff',
    createdAt: '2024-01-15',
    features: ['Island', 'Pantry', 'Breakfast Bar']
  },
  {
    id: '2',
    name: 'Luxury Chef\'s Kitchen',
    description: 'Professional-grade appliances and ample prep space for serious cooks',
    thumbnail: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400&h=300&fit=crop',
    category: 'luxury',
    style: 'Contemporary',
    size: 'Large (250+ sq ft)',
    price: 49,
    isPremium: true,
    rating: 4.9,
    usageCount: 567,
    author: 'Sarah Chen',
    authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=8B5CF6&color=fff',
    createdAt: '2024-02-01',
    features: ['Double Island', 'Wine Storage', 'Butler\'s Pantry']
  },
  {
    id: '3',
    name: 'Cozy Farmhouse Kitchen',
    description: 'Warm wood tones and vintage details create a welcoming atmosphere',
    thumbnail: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
    category: 'farmhouse',
    style: 'Rustic',
    size: 'Small (< 150 sq ft)',
    price: 0,
    isPremium: false,
    rating: 4.7,
    usageCount: 2341,
    author: 'ModularSpace Team',
    authorAvatar: 'https://ui-avatars.com/api/?name=ModularSpace&background=3B82F6&color=fff',
    createdAt: '2024-01-20',
    features: ['Breakfast Nook', 'Open Shelving', 'Apron Sink']
  },
  {
    id: '4',
    name: 'Industrial Loft Kitchen',
    description: 'Exposed brick, metal accents, and concrete countertops for urban living',
    thumbnail: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&h=300&fit=crop',
    category: 'modern',
    style: 'Industrial',
    size: 'Medium (150-250 sq ft)',
    price: 29,
    isPremium: true,
    rating: 4.6,
    usageCount: 890,
    author: 'Mike Johnson',
    authorAvatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=10B981&color=fff',
    createdAt: '2024-01-25',
    features: ['Open Concept', 'Bar Seating', 'Statement Lighting']
  }
];

export default TemplatesPage;