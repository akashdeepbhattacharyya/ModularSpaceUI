import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Provider } from 'react-redux';
import store from './store/store';

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Lazy load layouts
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const AuthLayout = lazy(() => import('./layouts/AuthLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// Lazy load public pages
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const PricingPage = lazy(() => import('./pages/public/PricingPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const FeaturesPage = lazy(() => import('./pages/public/FeaturesPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));

// Lazy load auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const OAuthCallback = lazy(() => import('./pages/auth/OAuthCallback'));

// Lazy load app pages
const DashboardPage = lazy(() => import('./pages/app/DashboardPage'));
const ProjectsPage = lazy(() => import('./pages/app/ProjectsPage'));
const DesignerPage = lazy(() => import('./pages/app/DesignerPage'));
const ProfilePage = lazy(() => import('./pages/app/ProfilePage'));
const BillingPage = lazy(() => import('./pages/app/BillingPage'));
const TemplatesPage = lazy(() => import('./pages/app/TemplatesPage'));
const AnalyticsPage = lazy(() => import('./pages/app/AnalyticsPage'));
const TeamPage = lazy(() => import('./pages/app/TeamPage'));
const MarketplacePage = lazy(() => import('./pages/app/MarketplacePage'));
const SettingsPage = lazy(() => import('./pages/app/SettingsPage'));
const ApiKeysPage = lazy(() => import('./pages/app/ApiKeysPage'));

// Lazy load admin pages
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminProjectsPage = lazy(() => import('./pages/admin/AdminProjectsPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));

// Lazy load legal pages
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Protected Route Component - not lazy loaded as it's used frequently

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <Toaster position="top-right" />
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<PublicLayout />}>
                    <Route index element={<LandingPage />} />
                    <Route path="pricing" element={<PricingPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="features" element={<FeaturesPage />} />
                    <Route path="contact" element={<ContactPage />} />
                  </Route>

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
              </Suspense>
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </HelmetProvider>
    </Provider>
  );
}

export default App;