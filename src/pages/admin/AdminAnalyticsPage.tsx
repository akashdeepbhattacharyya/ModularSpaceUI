import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  Globe,
  Smartphone,
  Monitor,
  Clock
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminAnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedMetric, setSelectedMetric] = useState('users');

  const kpiData = [
    { label: 'Total Revenue', value: '$45,231', change: '+20.1%', trend: 'up' },
    { label: 'Active Users', value: '2,345', change: '+15.3%', trend: 'up' },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', trend: 'up' },
    { label: 'Avg. Session Duration', value: '12m 34s', change: '-2.1%', trend: 'down' },
  ];

  const userGrowthData = [
    { date: 'Jan 1', users: 1200, revenue: 12000 },
    { date: 'Jan 7', users: 1350, revenue: 13500 },
    { date: 'Jan 14', users: 1500, revenue: 15000 },
    { date: 'Jan 21', users: 1800, revenue: 18000 },
    { date: 'Jan 28', users: 2100, revenue: 21000 },
    { date: 'Feb 4', users: 2345, revenue: 23450 },
  ];

  const subscriptionData = [
    { name: 'Free', value: 4500, color: '#6B7280' },
    { name: 'Basic', value: 3200, color: '#3B82F6' },
    { name: 'Pro', value: 2100, color: '#8B5CF6' },
    { name: 'Enterprise', value: 450, color: '#10B981' },
  ];

  const deviceData = [
    { device: 'Desktop', users: 5832, percentage: 65 },
    { device: 'Mobile', users: 2520, percentage: 28 },
    { device: 'Tablet', users: 630, percentage: 7 },
  ];

  const geographicData = [
    { country: 'United States', users: 3456, revenue: 34560 },
    { country: 'United Kingdom', users: 1234, revenue: 12340 },
    { country: 'Canada', users: 890, revenue: 8900 },
    { country: 'Australia', users: 567, revenue: 5670 },
    { country: 'Germany', users: 456, revenue: 4560 },
  ];

  const exportAnalytics = () => {
    console.log('Exporting analytics...');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor key metrics and user behavior
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="last7days">Last 7 days</option>
            <option value="last30days">Last 30 days</option>
            <option value="last90days">Last 90 days</option>
            <option value="lastyear">Last year</option>
            <option value="custom">Custom range</option>
          </select>
          <button
            onClick={exportAnalytics}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{kpi.value}</p>
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {kpi.change}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth & Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="users" stroke="#3B82F6" name="Users" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue ($)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subscription Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={subscriptionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {subscriptionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Device & Geographic Stats */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        {/* Device Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Device Usage</h3>
          <div className="space-y-4">
            {deviceData.map((device) => (
              <div key={device.device}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {device.device === 'Desktop' && <Monitor className="h-5 w-5 text-gray-400 mr-2" />}
                    {device.device === 'Mobile' && <Smartphone className="h-5 w-5 text-gray-400 mr-2" />}
                    {device.device === 'Tablet' && <Monitor className="h-5 w-5 text-gray-400 mr-2" />}
                    <span className="text-sm font-medium text-gray-900">{device.device}</span>
                  </div>
                  <span className="text-sm text-gray-500">{device.users} users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Countries</h3>
          <div className="space-y-4">
            {geographicData.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">{country.country}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{country.users} users</p>
                  <p className="text-xs text-gray-500">${country.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detailed Metrics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow rounded-lg"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Detailed Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Today
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yesterday
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last 7 Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last 30 Days
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Page Views
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12,543</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">11,234</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">78,234</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">342,123</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Unique Visitors
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3,234</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3,123</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18,234</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">82,456</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Bounce Rate
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">42.3%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">43.1%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">41.8%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">40.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalyticsPage;