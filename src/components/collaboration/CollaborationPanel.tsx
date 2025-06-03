import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageCircle,
  Video,
  Phone,
  Share2,
  UserPlus,
  Settings,
  X,
  Send,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  MoreVertical,
  Circle,
  CheckCircle,
  Clock,
  AtSign,
  Hash,
  Paperclip,
  Smile
} from 'lucide-react';
import io, { Socket } from 'socket.io-client';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  role: 'owner' | 'editor' | 'viewer';
  cursor?: {
    x: number;
    y: number;
    color: string;
  };
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  edited?: boolean;
  reactions?: { emoji: string; users: string[] }[];
}

interface CollaborationPanelProps {
  projectId: string;
  currentUser: User;
  onUserCursorMove?: (cursor: { x: number; y: number }) => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  projectId,
  currentUser,
  onUserCursorMove
}) => {
  const [activeUsers, setActiveUsers] = useState<User[]>([currentUser]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showUserList, setShowUserList] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // User colors for cursors
  const userColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];

  // Initialize WebSocket connection
  useEffect(() => {
    socketRef.current = io(`${process.env.REACT_APP_WS_URL}/collaboration`, {
      auth: {
        projectId,
        userId: currentUser.id
      }
    });

    const socket = socketRef.current;

    // Socket event handlers
    socket.on('user-joined', (user: User) => {
      setActiveUsers(prev => [...prev, user]);
      addSystemMessage(`${user.name} joined the project`);
    });

    socket.on('user-left', (userId: string) => {
      setActiveUsers(prev => {
        const user = prev.find(u => u.id === userId);
        if (user) {
          addSystemMessage(`${user.name} left the project`);
        }
        return prev.filter(u => u.id !== userId);
      });
    });

    socket.on('user-cursor-move', ({ userId, cursor }: { userId: string; cursor: { x: number; y: number } }) => {
      setActiveUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, cursor: { ...cursor, color: userColors[prev.indexOf(user) % userColors.length] } } : user
      ));
    });

    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user-typing', ({ userId, userName }: { userId: string; userName: string }) => {
      if (userId !== currentUser.id) {
        setIsTyping(prev => [...prev.filter(name => name !== userName), userName]);
      }
    });

    socket.on('user-stop-typing', ({ userId, userName }: { userId: string; userName: string }) => {
      setIsTyping(prev => prev.filter(name => name !== userName));
    });

    // Join project room
    socket.emit('join-project', {
      projectId,
      user: currentUser
    });

    return () => {
      socket.emit('leave-project', { projectId, userId: currentUser.id });
      socket.disconnect();
    };
  }, [projectId, currentUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add system message
  const addSystemMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      userId: 'system',
      userName: 'System',
      userAvatar: '',
      content,
      timestamp: new Date(),
      type: 'system'
    };
    setMessages(prev => [...prev, message]);
  };

  // Send message
  const sendMessage = () => {
    if (!inputMessage.trim() || !socketRef.current) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: inputMessage,
      timestamp: new Date(),
      type: 'text'
    };

    socketRef.current.emit('send-message', {
      projectId,
      message
    });

    setMessages(prev => [...prev, message]);
    setInputMessage('');
    handleStopTyping();
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!socketRef.current) return;

    socketRef.current.emit('typing', {
      projectId,
      userId: currentUser.id,
      userName: currentUser.name
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

const handleStopTyping = () => {
    if (!socketRef.current) return;

    socketRef.current.emit('stop-typing', {
      projectId,
      userId: currentUser.id,
      userName: currentUser.name
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Handle cursor movement
  const handleCursorMove = (e: MouseEvent) => {
    if (!socketRef.current || !onUserCursorMove) return;

    const cursor = {
      x: e.clientX,
      y: e.clientY
    };

    onUserCursorMove(cursor);

    socketRef.current.emit('cursor-move', {
      projectId,
      userId: currentUser.id,
      cursor
    });
  };

  // Invite user
  const inviteUser = () => {
    if (!inviteEmail || !socketRef.current) return;

    socketRef.current.emit('invite-user', {
      projectId,
      email: inviteEmail,
      role: inviteRole,
      invitedBy: currentUser.id
    });

    setShowInviteModal(false);
    setInviteEmail('');
    addSystemMessage(`Invitation sent to ${inviteEmail}`);
  };

  // Start video call
  const startVideoCall = () => {
    console.log('Starting video call...');
    // Implement video call functionality
  };

  // Share screen
  const shareScreen = () => {
    console.log('Sharing screen...');
    // Implement screen sharing functionality
  };

  return (
    <div className="flex h-full bg-white rounded-lg shadow-lg">
      {/* Users Panel */}
      <AnimatePresence>
        {showUserList && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-gray-200 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Collaborators</h3>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Invite user"
                >
                  <UserPlus className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Active Users */}
              <div className="space-y-2">
                {activeUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          user.status === 'online'
                            ? 'bg-green-400'
                            : user.status === 'away'
                            ? 'bg-yellow-400'
                            : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                        {user.id === currentUser.id && ' (You)'}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    {user.cursor && (
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: user.cursor.color }}
                        title="Active cursor"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={startVideoCall}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Video className="h-4 w-4 text-gray-600" />
                  <span>Start Video Call</span>
                </button>
                <button
                  onClick={shareScreen}
                  className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <ScreenShare className="h-4 w-4 text-gray-600" />
                  <span>Share Screen</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Project Chat</h3>
            {isTyping.length > 0 && (
              <span className="text-sm text-gray-500">
                {isTyping.join(', ')} {isTyping.length === 1 ? 'is' : 'are'} typing...
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowUserList(!showUserList)}
              className={`p-2 rounded hover:bg-gray-100 ${
                showUserList ? 'bg-gray-100' : ''
              }`}
              title="Toggle user list"
            >
              <Users className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-2 rounded hover:bg-gray-100"
              title="Toggle chat"
            >
              {showChat ? <X className="h-4 w-4 text-gray-600" /> : <MessageCircle className="h-4 w-4 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.userId === currentUser.id ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'system' ? (
                <div className="w-full text-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {message.content}
                  </span>
                </div>
              ) : (
                <div
                  className={`flex ${
                    message.userId === currentUser.id ? 'flex-row-reverse' : 'flex-row'
                  } items-start space-x-2 max-w-[70%]`}
                >
                  <img
                    src={message.userAvatar}
                    alt={message.userName}
                    className="h-8 w-8 rounded-full flex-shrink-0"
                  />
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.userId === currentUser.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.userId !== currentUser.id && (
                        <p className="text-xs font-medium mb-1 opacity-75">
                          {message.userName}
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {message.edited && (
                        <span className="text-xs text-gray-400">(edited)</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-end space-x-2">
            <button
              onClick={() => {/* Handle file upload */}}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
                rows={1}
              />
            </div>

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Smile className="h-5 w-5" />
            </button>

            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Invite User Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Invite Collaborator
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="editor">Editor - Can make changes</option>
                    <option value="viewer">Viewer - Can only view</option>
                  </select>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    The invited user will receive an email with a link to join this project.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={inviteUser}
                  disabled={!inviteEmail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Invitation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollaborationPanel;