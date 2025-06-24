import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Loader,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Paperclip,
  Image,
  FileText,
  HelpCircle,
  Lightbulb,
  Settings
} from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
  suggestions?: string[];
  actions?: {
    label: string;
    action: () => void;
  }[];
}

interface AIChatProps {
  projectId?: string;
  context?: any;
  onSuggestionApply?: (suggestion: any) => void;
  setShowAIChat: (show: boolean) => void;
}

const AIChat: React.FC<AIChatProps> = ({
  projectId,
  context,
  onSuggestionApply,
  setShowAIChat
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI design assistant. I can help you with kitchen layouts, suggest optimizations, and answer questions about your design. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        'Optimize my kitchen layout',
        'Suggest cabinet configurations',
        'Help with material selection',
        'Check building codes'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick prompts
  const quickPrompts = [
    { icon: Lightbulb, text: 'Give me design ideas', prompt: 'Can you suggest some modern kitchen design ideas?' },
    { icon: Settings, text: 'Optimize layout', prompt: 'Can you help optimize my current kitchen layout for better workflow?' },
    { icon: HelpCircle, text: 'Material advice', prompt: 'What materials would you recommend for countertops in a busy family kitchen?' },
  ];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call AI API
      const response = await axios.post('/ai/chat', {
        message: content,
        projectId,
        context,
        history: messages.slice(-10) // Send last 10 messages for context
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        suggestions: response.data.suggestions,
        actions: response.data.actions?.map((action: any) => ({
          label: action.label,
          action: () => {
            if (onSuggestionApply) {
              onSuggestionApply(action.data);
            }
          }
        }))
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/ai/analyze-image', formData);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `I've uploaded an image: ${file.name}`,
        timestamp: new Date(),
        attachments: [{
          type: 'image',
          url: URL.createObjectURL(file),
          name: file.name
        }]
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.analysis,
        timestamp: new Date(),
        suggestions: response.data.suggestions
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed ${
        isExpanded ? 'inset-4' : 'bottom-4 right-4 w-96 h-[600px]'
      } bg-white rounded-lg shadow-2xl flex flex-col z-50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Design Assistant</h3>
            <p className="text-xs text-blue-100">Powered by ModularSpace AI</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/20 rounded transition-colors"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setShowAIChat(false)}
            className="p-2 hover:bg-white/20 rounded transition-colors"
          >
            <X className="h-4 w-4" />
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
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-[80%]`}>
              <div className={`p-2 rounded-full ${
                message.role === 'user' ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Sparkles className="h-4 w-4 text-gray-700" />
                )}
              </div>
              
              <div>
                <div className={`rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Attachments */}
                  {message.attachments && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-white/20 rounded">
                          {attachment.type === 'image' ? (
                            <>
                              <Image className="h-4 w-4" />
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="h-20 w-20 object-cover rounded"
                              />
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4" />
                              <span className="text-xs">{attachment.name}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Actions */}
                {message.actions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors flex items-center"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-gray-200 rounded-full">
              <Sparkles className="h-4 w-4 text-gray-700" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader className="h-4 w-4 animate-spin text-gray-600" />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick prompts:</p>
          <div className="space-y-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => sendMessage(prompt.prompt)}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <prompt.icon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-end space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            
            <AnimatePresence>
              {showUploadMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg p-2 min-w-[150px]"
                >
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center space-x-2 p-2 rounded hover:bg-gray-50 text-sm"
                  >
                    <Image className="h-4 w-4" />
                    <span>Upload Image</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask me anything about your kitchen design..."
            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
            rows={1}
          />
          
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI suggestions are for reference only. Always verify with professionals.
        </p>
      </div>
    </motion.div>
  );
};

export default AIChat;