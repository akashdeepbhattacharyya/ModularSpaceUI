import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Tag,
  Search,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Filter
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  tags: string[];
  readTime: number;
  publishedAt: string;
  featuredImage: string;
  featured: boolean;
}

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'design-tips', name: 'Design Tips' },
    { id: 'tutorials', name: 'Tutorials' },
    { id: 'industry-news', name: 'Industry News' },
    { id: 'case-studies', name: 'Case Studies' },
    { id: 'product-updates', name: 'Product Updates' },
  ];

  // Mock blog posts
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: '10 Kitchen Design Trends for 2024',
      excerpt: 'Discover the latest trends shaping modern kitchen design, from sustainable materials to smart appliances.',
      content: '',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3B82F6&color=fff',
        role: 'Design Expert'
      },
      category: 'design-tips',
      tags: ['trends', 'kitchen design', '2024'],
      readTime: 5,
      publishedAt: '2024-06-15',
      featuredImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
      featured: true
    },
    {
      id: '2',
      title: 'How to Use AI for Kitchen Layout Optimization',
      excerpt: 'Learn how our AI-powered tools can help you create the perfect kitchen layout for your space.',
      content: '',
      author: {
        name: 'Mike Chen',
        avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=8B5CF6&color=fff',
        role: 'Product Manager'
      },
      category: 'tutorials',
      tags: ['AI', 'layout', 'optimization'],
      readTime: 8,
      publishedAt: '2024-06-10',
      featuredImage: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=400&fit=crop',
      featured: false
    },
    {
      id: '3',
      title: 'Case Study: Modern Kitchen Transformation',
      excerpt: 'See how we helped transform a dated kitchen into a modern masterpiece using ModularSpace.',
      content: '',
      author: {
        name: 'Emily Davis',
        avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=10B981&color=fff',
        role: 'Interior Designer'
      },
      category: 'case-studies',
      tags: ['renovation', 'before-after', 'modern'],
      readTime: 10,
      publishedAt: '2024-06-05',
      featuredImage: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=400&fit=crop',
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ModularSpace Blog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Design inspiration, tips, and insights from our team of experts
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="lg:flex">
                <div className="lg:w-1/2">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Featured
                    </span>
                    <span className="capitalize">{featuredPost.category.replace('-', ' ')}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    <Link to={`/blog/${featuredPost.id}`} className="hover:text-blue-600">
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {featuredPost.author.name}
                        </p>
                        <p className="text-sm text-gray-500">{featuredPost.author.role}</p>
                      </div>
                    </div>
                    <Link
                      to={`/blog/${featuredPost.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              <Link to={`/blog/${post.id}`}>
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-600 font-medium capitalize">
                    {post.category.replace('-', ' ')}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime} min read
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link to={`/blog/${post.id}`} className="hover:text-blue-600">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{post.author.name}</p>
                      <p className="text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No blog posts found matching your criteria.</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-6 text-blue-100">
            Get the latest design tips and product updates delivered to your inbox
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;