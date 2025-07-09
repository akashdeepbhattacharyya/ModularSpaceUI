import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Settings,
  Bell,
  Shield,
  Globe,
  Palette,
  Key,
  Database,
  Download,
  Monitor,
  Moon,
  Sun,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsFormData {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  projectReminders: boolean;
  collaborationAlerts: boolean;
  weeklyDigest: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  measurementUnit: string;
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  autoSaveInterval: number;
  highQualityRendering: boolean;
  hardwareAcceleration: boolean;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<SettingsFormData>({
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      projectReminders: true,
      collaborationAlerts: true,
      weeklyDigest: true,
      language: 'en',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      measurementUnit: 'imperial',
      theme: 'light',
      autoSave: true,
      autoSaveInterval: 5,
      highQualityRendering: true,
      hardwareAcceleration: true,
    }
  });

  const watchAllFields = watch();

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'performance', label: 'Performance', icon: Monitor },
    { id: 'data', label: 'Data & Privacy', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Key },
  ];

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      // Save settings to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    try {
      // Export user data
      toast.success('Your data export has started. You will receive an email when it\'s ready.');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const deleteAllData = async () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      try {
        // Delete all user data
        toast.success('All data deleted successfully');
      } catch (error) {
        toast.error('Failed to delete data');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <select
                      {...register('language')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timezone</label>
                    <select
                      {...register('timezone')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    >
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Denver">Mountain Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Format</label>
                    <select
                      {...register('dateFormat')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select
                      {...register('currency')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Measurement Units</label>
                    <select
                      {...register('measurementUnit')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    >
                      <option value="imperial">Imperial (inches, feet)</option>
                      <option value="metric">Metric (cm, meters)</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Project Updates</p>
                      <p className="text-sm text-gray-500">Get notified when someone comments or makes changes</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue('emailNotifications', !watchAllFields.emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        watchAllFields.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          watchAllFields.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Collaboration Invites</p>
                      <p className="text-sm text-gray-500">Receive invitations to collaborate on projects</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue('collaborationAlerts', !watchAllFields.collaborationAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        watchAllFields.collaborationAlerts ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          watchAllFields.collaborationAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
                      <p className="text-sm text-gray-500">New features, tips, and special offers</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue('marketingEmails', !watchAllFields.marketingEmails)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        watchAllFields.marketingEmails ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          watchAllFields.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Weekly Digest</p>
                      <p className="text-sm text-gray-500">Summary of your weekly activity and insights</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue('weeklyDigest', !watchAllFields.weeklyDigest)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        watchAllFields.weeklyDigest ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          watchAllFields.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Browser Notifications</p>
                      <p className="text-sm text-gray-500">Get notifications in your browser</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue('pushNotifications', !watchAllFields.pushNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        watchAllFields.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          watchAllFields.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  <button
                    type="button"
                    onClick={() => setValue('theme', 'light')}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                      watchAllFields.theme === 'light'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Sun className="h-8 w-8 text-yellow-500" />
                    <span className="text-sm font-medium">Light</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue('theme', 'dark')}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                      watchAllFields.theme === 'dark'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Moon className="h-8 w-8 text-gray-700" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue('theme', 'system')}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                      watchAllFields.theme === 'system'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Monitor className="h-8 w-8 text-gray-500" />
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Display Options</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grid Size</label>
                    <p className="text-sm text-gray-500 mb-2">Adjust the grid size in the designer</p>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      step="10"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">UI Scale</label>
                    <p className="text-sm text-gray-500 mb-2">Make UI elements larger or smaller</p>
                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md">
                      <option value="small">Small (90%)</option>
                      <option value="normal">Normal (100%)</option>
                      <option value="large">Large (110%)</option>
                      <option value="xlarge">Extra Large (125%)</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Auto-save</p>
                      <p className="text-sm text-gray-500">Automatically save your work</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue('autoSave', !watchAllFields.autoSave)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        watchAllFields.autoSave ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          watchAllFields.autoSave ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {watchAllFields.autoSave && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Auto-save Interval</label>
                      <select
                        {...register('autoSaveInterval')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                      >
                        <option value={1}>Every minute</option>
                        <option value={5}>Every 5 minutes</option>
                        <option value={10}>Every 10 minutes</option>
                        <option value={30}>Every 30 minutes</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">High Quality Rendering</p>
                      <p className="text-sm text-gray-500">Enable high quality rendering (uses more resources)</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue('highQualityRendering', !watchAllFields.highQualityRendering)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        watchAllFields.highQualityRendering ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          watchAllFields.highQualityRendering ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Hardware Acceleration</p>
                      <p className="text-sm text-gray-500">Use GPU for better performance</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue('hardwareAcceleration', !watchAllFields.hardwareAcceleration)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        watchAllFields.hardwareAcceleration ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          watchAllFields.hardwareAcceleration ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cache Management</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Cache Size</span>
                      <span className="text-sm text-gray-500">234 MB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Used 234 MB of 1 GB</p>
                  </div>

                  <button
                    type="button"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Clear Cache
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex">
                      <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-900">Your Data</p>
                        <p className="text-sm text-blue-700 mt-1">
                          You can export all your data at any time. This includes projects, settings, and activity history.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={exportData}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Analytics</p>
                      <p className="text-sm text-gray-500">Help us improve by sharing usage data</p>
                    </div>
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Personalized Ads</p>
                      <p className="text-sm text-gray-500">Show ads based on your activity</p>
                    </div>
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Delete All Data</h4>
                  <p className="text-sm text-red-600 mb-4">
                    Permanently delete all your data including projects, settings, and account information. This action cannot be undone.
                  </p>
                  <button
                    type="button"
                    onClick={deleteAllData}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                  >
                    Delete All Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Services</h3>
                
                <div className="space-y-4">
                  {[
                    { name: 'Google Drive', connected: true, icon: '🔗' },
                    { name: 'Dropbox', connected: false, icon: '📦' },
                    { name: 'Slack', connected: true, icon: '💬' },
                    { name: 'Zapier', connected: false, icon: '⚡' },
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{service.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-500">
                            {service.connected ? 'Connected' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          service.connected
                            ? 'text-red-600 hover:bg-red-50'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {service.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Import/Export</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">AutoCAD (.dwg)</p>
                      <p className="text-sm text-gray-500">Import and export DWG files</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">SketchUp (.skp)</p>
                      <p className="text-sm text-gray-500">Import SketchUp models</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">3DS Max (.3ds)</p>
                      <p className="text-sm text-gray-500">Import 3DS files</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Enabled</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;