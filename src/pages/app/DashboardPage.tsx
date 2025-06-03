import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Folder,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  Download,
  Share2,
  Eye,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface ProjectStats {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  totalValue: number;
  hoursWorked: number;
  collaborators: number;
}

interface RecentProject {
  id: string;
  name: string;
  thumbnail: string;
  lastEdited: string;
  status: 'draft' | 'in-progress' | 'completed';
  value: number;
  completionPercentage: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['projectStats'],
    queryFn: async () => {
      const response = await axios.get('/projects/stats');
      return response.data.data as ProjectStats;
    }
  });

  const { data: recentProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['recentProjects'],
    queryFn: async () => {
      const response = await axios.get('/projects?page=0&size=6&sort=updatedAt,desc');
      return response.data.data.content as RecentProject[];
    }
  });

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

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your kitchen designs today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/app/designer"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-blue-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">New Design</p>
              <p className="text-sm text-gray-500 truncate">Start from scratch</p>
            </div>
          </Link>

          <Link
            to="/app/projects"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-blue-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Folder className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">My Projects</p>
              <p className="text-sm text-gray-500 truncate">View all designs</p>
            </div>
          </Link>

          <Link
            to="/app/templates"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-blue-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Download className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Templates</p>
              <p className="text-sm text-gray-500 truncate">Browse designs</p>
            </div>
          </Link>

          <button
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-blue-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Share2 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Upload Photo</p>
              <p className="text-sm text-gray-500 truncate">AI analysis</p>
            </div>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Folder className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Projects
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {statsLoading ? '...' : stats?.totalProjects || 0}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        12%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Hours Saved
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {statsLoading ? '...' : stats?.hoursWorked || 0}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        8%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Collaborators
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {statsLoading ? '...' : stats?.collaborators || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Project Value
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        ${statsLoading ? '...' : (stats?.totalValue || 0).toLocaleString()}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Projects</h2>
          <Link
            to="/app/projects"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {projectsLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects?.map((project) => (
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
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/app/designer/${project.id}`}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/app/designer/${project.id}`}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Updated {project.lastEdited}
                      </p>
                    </div>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      project.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium">{project.completionPercentage}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;