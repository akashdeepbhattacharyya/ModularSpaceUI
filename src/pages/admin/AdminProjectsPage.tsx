import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Folder,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  MoreVertical,
  Calendar,
  User,
  Clock,
  HardDrive,
  Image,
  Layers,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'draft' | 'active' | 'archived' | 'deleted';
  createdAt: string;
  updatedAt: string;
  elementCount: number;
  renderCount: number;
  storageSize: number;
  collaborators: number;
  thumbnail?: string;
}

const AdminProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ['admin-projects', searchTerm, filterStatus],
    queryFn: async () => {
      // Mock data for now
      return mockProjects;
    }
  });

  const stats = [
    { label: 'Total Projects', value: projects?.length || 0, change: '+12%', icon: Folder },
    { label: 'Active Projects', value: projects?.filter(p => p.status === 'active').length || 0, change: '+8%', icon: TrendingUp },
    { label: 'Total Storage', value: '1.2 TB', change: '+15%', icon: HardDrive },
    { label: 'Avg. Elements', value: '234', change: '+5%', icon: Layers },
  ];

  const deleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/admin/projects/${projectId}`);
        toast.success('Project deleted');
        refetch();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const exportProjects = () => {
    toast.success('Project export started. You will receive an email when ready.');
  };

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and manage all user projects
          </p>
        </div>
        <button
          onClick={exportProjects}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="flex flex-col items-end">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
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
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
            <option value="deleted">Deleted</option>
          </select>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Layers className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Image className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Table/Grid */}
      {viewMode === 'list' ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                {selectedProjects.length > 0 && `${selectedProjects.length} selected`}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="px-6 py-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {projects?.map((project) => (
                <li key={project.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => toggleProjectSelection(project.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    
                    {project.thumbnail && (
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="ml-4 h-16 w-16 object-cover rounded"
                      />
                    )}
                    
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{project.name}</h3>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {project.userName}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Updated {project.updatedAt}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                            <span>{project.elementCount} elements</span>
                            <span>{project.renderCount} renders</span>
                            <span>{(project.storageSize / 1024).toFixed(1)} MB</span>
                            <span>{project.collaborators} collaborators</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            project.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'draft'
                              ? 'bg-gray-100 text-gray-800'
                              : project.status === 'archived'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {project.status}
                          </span>
                          
                          <div className="relative">
                            <button
                              onClick={() => setShowActionMenu(showActionMenu === project.id ? null : project.id)}
                              className="p-2 hover:bg-gray-100 rounded-full"
                            >
                              <MoreVertical className="h-5 w-5 text-gray-400" />
                            </button>
                            
                            {showActionMenu === project.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                <div className="py-1">
                                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Project
                                  </button>
                                  <button
                                    onClick={() => deleteProject(project.id)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Project
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects?.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center rounded-t-lg">
                    <Folder className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 truncate">{project.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{project.userName}</p>
                
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{project.elementCount} elements</span>
                  <span className={`px-2 py-1 rounded-full ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
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
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Modern Kitchen Design',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2 hours ago',
    elementCount: 45,
    renderCount: 12,
    storageSize: 256,
    collaborators: 3,
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Minimalist Kitchen',
    userId: '2',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    status: 'draft',
    createdAt: '2024-02-20',
    updatedAt: '1 day ago',
    elementCount: 32,
    renderCount: 5,
    storageSize: 128,
    collaborators: 1,
    thumbnail: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop'
  }
];

export default AdminProjectsPage;