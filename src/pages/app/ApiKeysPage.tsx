import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  AlertCircle,
  Check,
  X,
  Clock,
  Globe,
  Code,
  Terminal,
  Zap,
  Info
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string | null;
  createdAt: string;
  expiresAt: string | null;
  permissions: string[];
  usage: {
    calls: number;
    limit: number;
  };
  status: 'active' | 'expired' | 'revoked';
}

const ApiKeysPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [keyExpiry, setKeyExpiry] = useState('never');
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const permissions = [
    { id: 'projects.read', name: 'Read Projects', description: 'View project details' },
    { id: 'projects.write', name: 'Write Projects', description: 'Create and modify projects' },
    { id: 'designs.read', name: 'Read Designs', description: 'Access design elements' },
    { id: 'designs.write', name: 'Write Designs', description: 'Modify design elements' },
    { id: 'ai.access', name: 'AI Access', description: 'Use AI features' },
    { id: 'renders.create', name: 'Create Renders', description: 'Generate high-quality renders' },
    { id: 'team.manage', name: 'Manage Team', description: 'Add and remove team members' },
    { id: 'billing.access', name: 'Billing Access', description: 'View billing information' },
  ];

  const { data: apiKeys, isLoading, refetch } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      // Mock data for now
      return mockApiKeys;
    }
  });

  const createKeyMutation = useMutation({
    mutationFn: async (data: { name: string; permissions: string[]; expiresIn?: string }) => {
      const response = await axios.post('/api-keys', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('API key created successfully!');
      setShowCreateModal(false);
      setNewKeyName('');
      setSelectedPermissions([]);
      refetch();
    },
    onError: () => {
      toast.error('Failed to create API key');
    }
  });

  const revokeKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const response = await axios.delete(`/api-keys/${keyId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('API key revoked');
      refetch();
    },
    onError: () => {
      toast.error('Failed to revoke API key');
    }
  });

  const copyToClipboard = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateKey = () => {
    createKeyMutation.mutate({
      name: newKeyName,
      permissions: selectedPermissions,
      expiresIn: keyExpiry
    });
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage API keys for accessing ModularSpace API
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Key
        </button>
      </div>

      {/* Usage Overview */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Key className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Keys
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {apiKeys?.filter(k => k.status === 'active').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Zap className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    API Calls Today
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {apiKeys?.reduce((sum, key) => sum + key.usage.calls, 0) || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rate Limit
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    1000/hour
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-8 bg-blue-50 rounded-lg p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-400 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">API Documentation</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Learn how to integrate ModularSpace into your application.</p>
              <a href="/api-docs" className="font-medium underline">
                View API Documentation →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="px-6 py-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : apiKeys?.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Key className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No API keys</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new API key.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {apiKeys?.map((apiKey) => (
              <motion.li
                key={apiKey.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-6 py-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">{apiKey.name}</h3>
                      <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        apiKey.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : apiKey.status === 'expired'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {apiKey.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Created {new Date(apiKey.createdAt).toLocaleDateString()}
                      </span>
                      {apiKey.lastUsed && (
                        <>
                          <span>•</span>
                          <span>Last used {apiKey.lastUsed}</span>
                        </>
                      )}
                      {apiKey.expiresAt && (
                        <>
                          <span>•</span>
                          <span>Expires {new Date(apiKey.expiresAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 font-mono text-sm bg-gray-50 rounded p-2 flex items-center">
                          <span className="truncate">
                            {showKey === apiKey.id ? apiKey.key : '••••••••••••••••••••••••••••••••'}
                          </span>
                          <button
                            onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            {showKey === apiKey.id ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            {copiedKey === apiKey.id ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {apiKey.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">API Usage</span>
                        <span className="font-medium">
                          {apiKey.usage.calls} / {apiKey.usage.limit} calls
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(apiKey.usage.calls / apiKey.usage.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to revoke this API key?')) {
                          revokeKeyMutation.mutate(apiKey.id);
                        }
                      }}
                      disabled={apiKey.status !== 'active'}
                      className="text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {/* Code Examples */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Start</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">Node.js</h3>
              <Terminal className="h-5 w-5 text-gray-500" />
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`const axios = require('axios');

const response = await axios.get(
  'https://api.modularspace.com/v1/projects',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  }
);

console.log(response.data);`}
            </pre>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">Python</h3>
              <Code className="h-5 w-5 text-gray-500" />
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}

response = requests.get(
    'https://api.modularspace.com/v1/projects',
    headers=headers
)

print(response.json())`}
            </pre>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Create API Key</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700">
                  Key Name
                </label>
                <input
                  type="text"
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Production API Key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Permissions
                </label>
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                        <p className="text-sm text-gray-500">{permission.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                  Expiration
                </label>
                <select
                  id="expiry"
                  value={keyExpiry}
                  onChange={(e) => setKeyExpiry(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="never">Never expire</option>
                  <option value="30d">30 days</option>
                  <option value="90d">90 days</option>
                  <option value="1y">1 year</option>
                </select>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Make sure to copy your API key after creation. You won't be able to see it again!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName || selectedPermissions.length === 0 || createKeyMutation.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createKeyMutation.isPending ? 'Creating...' : 'Create Key'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Mock data
const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sk_live_abcdefghijklmnopqrstuvwxyz123456',
    lastUsed: '2 hours ago',
    createdAt: '2024-01-15',
    expiresAt: null,
    permissions: ['projects.read', 'projects.write', 'designs.read', 'ai.access'],
    usage: {
      calls: 456,
      limit: 1000
    },
    status: 'active'
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'sk_test_zyxwvutsrqponmlkjihgfedcba654321',
    lastUsed: '5 days ago',
    createdAt: '2024-02-20',
    expiresAt: '2024-12-31',
    permissions: ['projects.read', 'designs.read'],
    usage: {
      calls: 123,
      limit: 1000
    },
    status: 'active'
  }
];

export default ApiKeysPage;