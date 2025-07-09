import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Grid,
  List,
  Calendar,
  Clock,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Share2,
  Copy
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'in-progress' | 'completed';
  budget: number;
  estimatedCost: number;
  completionPercentage: number;
  collaborators: number;
}

const ProjectsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects', searchTerm, filterStatus, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      params.append('sort', `${sortBy},desc`);
      params.append('size', '20');
      
      const response = await axios.get(`/projects?${params.toString()}`);
      return response.data.data;
    }
  });

  const projects = projectsData?.content || [];

  const duplicateProject = async (projectId: string) => {
    try {
      await axios.post(`/projects/${projectId}/duplicate`);
      // Refetch projects
      window.location.reload();
    } catch (error) {
      console.error('Failed to duplicate project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/projects/${projectId}`);
        // Refetch projects
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const shareProject = (projectId: string) => {
    // Copy share link to clipboard
    const shareUrl = `${window.location.origin}/app/shared/${projectId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and organize all your kitchen designs in one place
            </p>
          </div>
          <Link
            to="/app/designer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="updatedAt">Last Modified</option>
              <option value="createdAt">Date Created</option>
              <option value="name">Name</option>
              <option value="budget">Budget</option>
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

      {/* Projects Display */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          <div className="mt-6">
            <Link
              to="/app/designer"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project: Project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all relative group"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={project.thumbnail || `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop`}
                  alt={project.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === project.id ? null : project.id)}
                      className="p-1 bg-white rounded-md text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {showDropdown === project.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <Link
                            to={`/app/designer/${project.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                          <Link
                            to={`/app/designer/${project.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                          <button
                            onClick={() => duplicateProject(project.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => shareProject(project.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {project.description || 'No description'}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    project.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'in-progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {projects.map((project: Project) => (
              <li key={project.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={project.thumbnail || `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop`}
                        alt={project.name}
                      />
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {project.name}
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>${project.budget.toLocaleString()} budget</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center sm:mt-0">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex items-center space-x-2">
                    <Link
                      to={`/app/designer/${project.id}`}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/app/designer/${project.id}`}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;