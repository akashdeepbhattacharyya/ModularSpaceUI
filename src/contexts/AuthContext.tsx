import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  subscriptionTier: string;
  avatar?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook') => void;
  handleOAuthCallback: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get('token');
    const oauthError = urlParams.get('error');

    if (oauthToken) {
      handleOAuthSuccess(oauthToken);
    } else if (oauthError) {
      toast.error(`Login failed: ${oauthError}`);
      navigate('/auth/login');
    } else if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/users/profile');
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSuccess = async (oauthToken: string) => {
    try {
      setToken(oauthToken);
      localStorage.setItem('token', oauthToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${oauthToken}`;
      
      await fetchUser();
      toast.success('Login successful!');
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Navigate to intended page or dashboard
      const from = location.state?.from?.pathname || '/app/dashboard';
      navigate(from);
    } catch (error) {
      toast.error('Failed to complete login');
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { accessToken, userId, firstName, lastName, role, subscriptionTier } = response.data.data;
      
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      setUser({
        id: userId,
        email,
        firstName,
        lastName,
        role,
        subscriptionTier
      });
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await axios.post('/auth/register', data);
      const { accessToken, userId, email, firstName, lastName, role, subscriptionTier } = response.data.data;
      
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      setUser({
        id: userId,
        email,
        firstName,
        lastName,
        role,
        subscriptionTier
      });
      
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const socialLogin = (provider: 'google' | 'facebook') => {
    // Store current location for redirect after OAuth
    localStorage.setItem('oauth_redirect', location.pathname);
    
    // Redirect to OAuth provider
    window.location.href = 'http://localhost:8080/api/v1/oauth2/callback/google'; //`${API_URL}/oauth2/authorization/${provider}`;
  };

  const handleOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (token) {
      await handleOAuthSuccess(token);
    } else if (error) {
      toast.error(`Authentication failed: ${error}`);
      navigate('/auth/login');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('oauth_redirect');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      socialLogin,
      handleOAuthCallback,
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};