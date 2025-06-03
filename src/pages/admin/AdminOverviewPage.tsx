import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Folder,
  DollarSign,
  TrendingUp,
  Activity,
  Server,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Cpu
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const AdminOverviewPage: React.FC = () => {
  const stats = [
    {
      name: 'Total Users',
      value: '12,345',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      name: 'Active Projects',
      value: '45,678',
      change: '+8.2%',
      trend: 'up',
      icon: Folder,
      color: 'purple'
    },
    {
      name: 'Monthly Revenue',
      value: '$123,456',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      name: 'System Health',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: Activity,
      color: 'yellow'
    }
  ];

  const userGrowthData = [
    { month: 'Jan', users: 8000, revenue: 80000 },
    { month: 'Feb', users: 8500, revenue: 85000 },
    { month: 'Mar', users: 9200, revenue: 92000 },
    { month: 'Apr', users: 10000, revenue: 100000 },
    { month: 'May', users: 11000, revenue: 110000 },
    { month: 'Jun', users: 12345, revenue: 123456 },
  ];

  const systemMetrics = [
    { name: 'API Response Time', value: '45ms', status: 'good' },
    { name: 'Database Load', value: '23%', status: 'good' },
    { name: 'Storage Used', value: '67%', status: 'warning' },
    { name: 'CDN Performance', value: '99.8%', status: 'good' },
  ];

  const recentActivities = [
    { id: 1, type: 'user', message: 'New user registration spike detected', time: '5 minutes ago', icon: Users },
    { id: 2, type: 'system', message: 'Database backup completed successfully', time: '1 hour ago', icon: Database },
    { id: 3, type: 'security', message: 'Failed login attempts from IP 192.168.1.1', time: '2 hours ago', icon: Shield },
    { id: 4, type: 'revenue', message: 'New enterprise subscription activated', time: '3 hours ago', icon: DollarSign },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          System-wide metrics and administrative insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-md bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth & Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="users" stroke="#3B82F6" name="Users" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue ($)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            {systemMetrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    metric.status === 'good' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                  <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                </div>
                <span className="text-sm text-gray-500">{metric.value}</span>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Overall Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Healthy
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white shadow rounded-lg"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="px-6 py-4">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-2 rounded-full ${
                  activity.type === 'user' ? 'bg-blue-100' :
                  activity.type === 'system' ? 'bg-green-100' :
                  activity.type === 'security' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  <activity.icon className={`h-5 w-5 ${
                    activity.type === 'user' ? 'text-blue-600' :
                    activity.type === 'system' ? 'text-green-600' :
                    activity.type === 'security' ? 'text-red-600' :
                    'text-yellow-600'
                  }`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="px-6 py-3 bg-gray-50 text-center">
          <a href="/admin/activity" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all activity →
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOverviewPage;