import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import PricingPage from './pages/public/PricingPage';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OAuthCallback from './pages/auth/OAuthCallback';

// App Pages
import DashboardPage from './pages/app/DashboardPage';
import ProjectsPage from './pages/app/ProjectsPage';
import DesignerPage from './pages/app/DesignerPage';
import ProfilePage from './pages/app/ProfilePage';
import BillingPage from './pages/app/BillingPage';
import TemplatesPage from './pages/app/TemplatesPage';
import AnalyticsPage from './pages/app/AnalyticsPage';
import TeamPage from './pages/app/TeamPage';
import MarketplacePage from './pages/app/MarketplacePage';
import SettingsPage from './pages/app/SettingsPage';
import ApiKeysPage from './pages/app/ApiKeysPage';

// Admin Pages
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// Legal Pages
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import HelpPage from './pages/HelpPage';
import BlogPage from './pages/BlogPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Toaster position="top-right" />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="features" element={<FeaturesPage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>

              {/* Legal Routes */}
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/blog" element={<BlogPage />} />

              {/* Auth Routes */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="oauth/callback" element={<OAuthCallback />} />
              </Route>

              {/* Protected App Routes */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/app/dashboard" />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="designer/:projectId?" element={<DesignerPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="marketplace" element={<MarketplacePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="api-keys" element={<ApiKeysPage />} />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminOverviewPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="projects" element={<AdminProjectsPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;