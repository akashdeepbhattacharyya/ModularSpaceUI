import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Folder,
  Clock,
  DollarSign,
  Download,
  Calendar,
  Filter,
  Eye,
  Share2,
  Star,
  Activity
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('projects');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const response = await axios.get(`/analytics?range=${timeRange}`);
      return response.data.data;
    }
  });

  const metrics = [
    {
      label: 'Total Projects',
      value: analytics?.totalProjects || 0,
      change: 12.5,
      trend: 'up',
      icon: Folder,
      color: 'blue'
    },
    {
      label: 'Design Hours',
      value: analytics?.designHours || 0,
      change: 8.2,
      trend: 'up',
      icon: Clock,
      color: 'purple'
    },
    {
      label: 'Collaborators',
      value: analytics?.collaborators || 0,
      change: -2.4,
      trend: 'down',
      icon: Users,
      color: 'green'
    },
    {
      label: 'Est. Project Value',
      value: `$${(analytics?.projectValue || 0).toLocaleString()}`,
      change: 15.3,
      trend: 'up',
      icon: DollarSign,
      color: 'yellow'
    }
  ];

  // Mock data for charts
  const projectTrends = [
    { month: 'Jan', projects: 12, completed: 8 },
    { month: 'Feb', projects: 19, completed: 14 },
    { month: 'Mar', projects: 15, completed: 12 },
    { month: 'Apr', projects: 25, completed: 20 },
    { month: 'May', projects: 22, completed: 18 },
    { month: 'Jun', projects: 30, completed: 25 },
  ];

  const projectTypes = [
    { name: 'Modern', value: 35, color: '#3B82F6' },
    { name: 'Traditional', value: 25, color: '#8B5CF6' },
    { name: 'Farmhouse', value: 20, color: '#10B981' },
    { name: 'Minimalist', value: 15, color: '#F59E0B' },
    { name: 'Other', value: 5, color: '#6B7280' },
  ];

  const activityData = [
    { date: '2024-06-01', views: 120, shares: 15, exports: 8 },
    { date: '2024-06-02', views: 132, shares: 18, exports: 10 },
    { date: '2024-06-03', views: 101, shares: 12, exports: 6 },
    { date: '2024-06-04', views: 134, shares: 20, exports: 12 },
    { date: '2024-06-05', views: 90, shares: 10, exports: 5 },
    { date: '2024-06-06', views: 230, shares: 30, exports: 18 },
    { date: '2024-06-07', views: 210, shares: 28, exports: 15 },
  ];

  const topProjects = [
    { name: 'Modern Kitchen Remodel', views: 1234, shares: 45, rating: 4.8 },
    { name: 'Farmhouse Kitchen', views: 1100, shares: 38, rating: 4.9 },
    { name: 'Minimalist Design', views: 980, shares: 32, rating: 4.7 },
    { name: 'Industrial Loft', views: 875, shares: 28, rating: 4.6 },
    { name: 'Traditional Upgrade', views: 650, shares: 22, rating: 4.8 },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your design performance and project insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {metric.label}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {metric.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(metric.change)}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Project Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="projects" fill="#3B82F6" name="Started" />
              <Bar dataKey="completed" fill="#10B981" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Project Types */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {projectTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow lg:col-span-2"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#3B82F6" name="Views" />
              <Line type="monotone" dataKey="shares" stroke="#8B5CF6" name="Shares" />
              <Line type="monotone" dataKey="exports" stroke="#10B981" name="Exports" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow lg:col-span-2"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Projects</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shares
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProjects.map((project) => (
                  <tr key={project.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1 text-gray-400" />
                        {project.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Share2 className="h-4 w-4 mr-1 text-gray-400" />
                        {project.shares}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        {project.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <button className="hover:text-blue-700">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6"
      >
        <div className="flex items-start">
          <Activity className="h-6 w-6 text-blue-600 mt-1" />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Key Insights</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>• Your modern kitchen designs receive 45% more engagement than other styles</li>
              <li>• Projects shared on Tuesdays get 2x more views on average</li>
              <li>• Adding 3D walkthroughs increases project completion rate by 30%</li>
              <li>• Collaborating with others reduces design time by 25%</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;