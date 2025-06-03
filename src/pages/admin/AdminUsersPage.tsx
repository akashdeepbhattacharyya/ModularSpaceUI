import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Download,
  UserPlus,
  Shield,
  Ban,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Activity,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  subscriptionTier: string;
  status: 'active' | 'suspended' | 'deleted';
  createdAt: string;
  lastLoginAt: string;
  projectCount: number;
  storageUsed: number;
  totalSpent: number;
  verified: boolean;
}

const AdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', searchTerm, filterStatus, filterRole],
    queryFn: async () => {
      // Mock data for now
      return mockUsers;
    }
  });

  // Define color classes explicitly
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' }
    };
    return colors[color] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  const stats = [
    { label: 'Total Users', value: users?.length || 0, icon: Users, color: 'blue' },
    { label: 'Active Users', value: users?.filter(u => u.status === 'active').length || 0, icon: CheckCircle, color: 'green' },
    { label: 'Suspended', value: users?.filter(u => u.status === 'suspended').length || 0, icon: AlertCircle, color: 'yellow' },
    { label: 'Pro Users', value: users?.filter(u => u.subscriptionTier === 'PRO').length || 0, icon: Shield, color: 'purple' },
  ];

  const suspendUser = async (userId: string) => {
    try {
      await axios.post(`/admin/users/${userId}/suspend`);
      toast.success('User suspended');
      refetch();
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`/admin/users/${userId}`);
        toast.success('User deleted');
        refetch();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const exportUsers = () => {
    toast.success('User export started. You will receive an email when ready.');
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users?.map(u => u.id) || []);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all users and their permissions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportUsers}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const colorClasses = getColorClasses(stat.color);
          return (
            <div key={stat.label} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-md ${colorClasses.bg}`}>
                    <stat.icon className={`h-6 w-6 ${colorClasses.text}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.label}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="deleted">Deleted</option>
          </select>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>

          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedUsers.length === users?.length && users?.length > 0}
              onChange={selectAllUsers}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              {selectedUsers.length > 0 && `${selectedUsers.length} selected`}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="px-6 py-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {users?.map((user) => (
              <li key={user.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          {user.verified && (
                            <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                          )}
                          {user.role === 'ADMIN' && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Admin
                            </span>
                          )}
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : user.status === 'suspended'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {user.subscriptionTier}
                          </span>
                        </div>
                        
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.phone}
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Activity className="h-3 w-3 mr-1" />
                            Last active {user.lastLoginAt}
                          </span>
                          <span>{user.projectCount} projects</span>
                          <span>{(user.storageUsed / 1024).toFixed(1)} GB used</span>
                          <span className="flex items-center">
                            <CreditCard className="h-3 w-3 mr-1" />
                            ${user.totalSpent}
                          </span>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </button>
                        
                        {showActionMenu === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                            <div className="py-1">
                              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </button>
                              <button
                                onClick={() => suspendUser(user.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                              </button>
                              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </button>
                              <hr className="my-1" />
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 555-1234',
    role: 'USER',
    subscriptionTier: 'PRO',
    status: 'active',
    createdAt: '2024-01-15',
    lastLoginAt: '2 hours ago',
    projectCount: 12,
    storageUsed: 2048,
    totalSpent: 299,
    verified: true
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'ADMIN',
    subscriptionTier: 'ENTERPRISE',
    status: 'active',
    createdAt: '2023-11-20',
    lastLoginAt: '1 day ago',
    projectCount: 45,
    storageUsed: 5120,
    totalSpent: 1299,
    verified: true
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.j@example.com',
    phone: '+1 555-5678',
    role: 'USER',
    subscriptionTier: 'FREE',
    status: 'suspended',
    createdAt: '2024-03-01',
    lastLoginAt: '1 week ago',
    projectCount: 3,
    storageUsed: 512,
    totalSpent: 0,
    verified: false
  }
];

export default AdminUsersPage;