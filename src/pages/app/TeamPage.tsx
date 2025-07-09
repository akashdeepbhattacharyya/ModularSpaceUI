import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Settings,
  Trash2,
  Edit,
  X,
  Clock,
  Crown,
  UserCheck,
  UserX,
  Send
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  lastActive: string;
  projectsAccess: number;
}

interface InviteFormData {
  email: string;
  role: string;
  message?: string;
}

const TeamPage: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<InviteFormData>();

  const { data: teamMembers, isLoading, refetch } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      // Mock data for now
      return mockTeamMembers;
    }
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: InviteFormData) => {
      const response = await axios.post('/team/invite', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Invitation sent successfully!');
      setShowInviteModal(false);
      reset();
      refetch();
    },
    onError: () => {
      toast.error('Failed to send invitation');
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: string }) => {
      const response = await axios.put(`/team/members/${memberId}/role`, { role });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Role updated successfully');
      setEditingMember(null);
      refetch();
    }
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const response = await axios.delete(`/team/members/${memberId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Team member removed');
      refetch();
    }
  });

  const onInviteSubmit = (data: InviteFormData) => {
    inviteMutation.mutate(data);
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      owner: { color: 'bg-purple-100 text-purple-800', icon: Crown },
      admin: { color: 'bg-blue-100 text-blue-800', icon: Shield },
      editor: { color: 'bg-green-100 text-green-800', icon: Edit },
      viewer: { color: 'bg-gray-100 text-gray-800', icon: Users }
    };
    
    const badge = badges[role as keyof typeof badges] || badges.viewer;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800', icon: UserCheck },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: UserX }
    };
    
    const badge = badges[status as keyof typeof badges] || badges.inactive;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const activeMembers = teamMembers?.filter(m => m.status === 'active').length || 0;
  const pendingInvites = teamMembers?.filter(m => m.status === 'pending').length || 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your team members and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Members
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {activeMembers}
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
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Invites
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pendingInvites}
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
                    Team Limit
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {activeMembers + pendingInvites} / 10
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {isLoading ? (
            <li className="px-6 py-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </li>
          ) : teamMembers?.length === 0 ? (
            <li className="px-6 py-4 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by inviting a team member.</p>
            </li>
          ) : (
            teamMembers?.map((member) => (
              <motion.li
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-6 py-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={member.avatar}
                      alt={member.name}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                      <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                        <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Last active {member.lastActive}</span>
                        <span>•</span>
                        <span>{member.projectsAccess} projects</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(member.status)}
                      {editingMember === member.id ? (
                        <select
                          className="text-sm border-gray-300 rounded-md"
                          defaultValue={member.role}
                          onChange={(e) => {
                            updateRoleMutation.mutate({ memberId: member.id, role: e.target.value });
                          }}
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        getRoleBadge(member.role)
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {member.role !== 'owner' && (
                        <>
                          {editingMember === member.id ? (
                            <button
                              onClick={() => setEditingMember(null)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingMember(member.id)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <Settings className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to remove this team member?')) {
                                removeMemberMutation.mutate(member.id);
                              }
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.li>
            ))
          )}
        </ul>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Invite Team Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onInviteSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="colleague@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  {...register('role', { required: 'Role is required' })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="">Select a role</option>
                  <option value="viewer">Viewer - Can view projects</option>
                  <option value="editor">Editor - Can edit projects</option>
                  <option value="admin">Admin - Can manage team</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Personal message (optional)
                </label>
                <textarea
                  {...register('message')}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Hey! I'd like to invite you to collaborate on our kitchen designs..."
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteMutation.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {inviteMutation.isPending ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Mock data
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff',
    role: 'owner',
    status: 'active',
    joinedAt: '2024-01-01',
    lastActive: '2 hours ago',
    projectsAccess: 25
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=8B5CF6&color=fff',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-02-15',
    lastActive: '1 day ago',
    projectsAccess: 18
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=10B981&color=fff',
    role: 'editor',
    status: 'pending',
    joinedAt: '2024-06-01',
    lastActive: 'Never',
    projectsAccess: 0
  }
];

export default TeamPage;