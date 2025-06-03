import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  X,
  Download,
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  Package,
  Zap,
  Star,
  Users,
  Shield,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    projects: number;
    renders: number;
    storage: number;
    teamMembers: number;
  };
  popular?: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl: string;
}

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await axios.get('/billing/subscription');
      return response.data.data;
    }
  });

  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: async () => {
      const response = await axios.get('/billing/usage');
      return response.data.data;
    }
  });

  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await axios.get('/billing/invoices');
      return response.data.data as Invoice[];
    }
  });

  const upgradeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await axios.post('/billing/upgrade', { planId });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Subscription upgraded successfully!');
      setShowUpgradeModal(false);
    },
    onError: () => {
      toast.error('Failed to upgrade subscription');
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/billing/cancel');
      return response.data;
    },
    onSuccess: () => {
      toast.success('Subscription cancelled');
    },
    onError: () => {
      toast.error('Failed to cancel subscription');
    }
  });

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        '1 active project',
        'Basic 2D design tools',
        'Limited material library',
        'Community support',
        'Watermarked exports'
      ],
      limits: {
        projects: 1,
        renders: 5,
        storage: 1,
        teamMembers: 1
      }
    },
    {
      id: 'home',
      name: 'Home',
      price: selectedInterval === 'month' ? 29 : 24,
      interval: selectedInterval,
      features: [
        'Unlimited projects',
        'AI photo analysis',
        'Full material library',
        '4K rendering',
        'Priority support',
        'No watermarks',
        'Cost estimation',
        '30-day version history'
      ],
      limits: {
        projects: -1,
        renders: 100,
        storage: 50,
        teamMembers: 3
      },
      popular: true
    },
    {
      id: 'pro',
      name: 'Professional',
      price: selectedInterval === 'month' ? 99 : 79,
      interval: selectedInterval,
      features: [
        'Everything in Home',
        'Team collaboration',
        'White-label options',
        'API access',
        'Advanced AI features',
        'Unlimited renders',
        'Custom materials',
        'Dedicated support'
      ],
      limits: {
        projects: -1,
        renders: -1,
        storage: 500,
        teamMembers: 10
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: -1,
      interval: selectedInterval,
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Custom integrations',
        'SLA guarantee',
        'Training sessions',
        'Account manager',
        'Custom contract',
        'Volume discounts'
      ],
      limits: {
        projects: -1,
        renders: -1,
        storage: -1,
        teamMembers: -1
      }
    }
  ];

  const currentPlan = plans.find(p => p.id === subscription?.planId) || plans[0];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your subscription, billing, and invoices
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Current Plan</h2>
            <div className="flex items-center mt-2">
              <span className="text-3xl font-bold text-gray-900">{currentPlan.name}</span>
              {currentPlan.popular && (
                <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Most Popular
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Current billing</p>
            <p className="text-2xl font-bold text-gray-900">
              ${currentPlan.price > 0 ? currentPlan.price : '0'}
              {currentPlan.price > 0 && <span className="text-base font-normal text-gray-500">/{currentPlan.interval}</span>}
            </p>
            {subscription?.nextBillingDate && (
              <p className="text-sm text-gray-500 mt-1">
                Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Projects</span>
              <Package className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold text-gray-900">
                {usage?.projects || 0}
              </span>
              {currentPlan.limits.projects > 0 && (
                <span className="text-sm text-gray-500">/{currentPlan.limits.projects}</span>
              )}
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: currentPlan.limits.projects > 0
                      ? `${Math.min((usage?.projects || 0) / currentPlan.limits.projects * 100, 100)}%`
                      : '0%'
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Renders</span>
              <Zap className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold text-gray-900">
                {usage?.renders || 0}
              </span>
              {currentPlan.limits.renders > 0 && (
                <span className="text-sm text-gray-500">/{currentPlan.limits.renders}</span>
              )}
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: currentPlan.limits.renders > 0
                      ? `${Math.min((usage?.renders || 0) / currentPlan.limits.renders * 100, 100)}%`
                      : '0%'
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Storage</span>
              <Shield className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold text-gray-900">
                {usage?.storage || 0}
              </span>
              {currentPlan.limits.storage > 0 && (
                <span className="text-sm text-gray-500">/{currentPlan.limits.storage} GB</span>
              )}
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: currentPlan.limits.storage > 0
                      ? `${Math.min((usage?.storage || 0) / currentPlan.limits.storage * 100, 100)}%`
                      : '0%'
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Team Members</span>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold text-gray-900">
                {usage?.teamMembers || 1}
              </span>
              {currentPlan.limits.teamMembers > 0 && (
                <span className="text-sm text-gray-500">/{currentPlan.limits.teamMembers}</span>
              )}
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: currentPlan.limits.teamMembers > 0
                      ? `${Math.min((usage?.teamMembers || 1) / currentPlan.limits.teamMembers * 100, 100)}%`
                      : '0%'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade Plan
          </button>
          {currentPlan.id !== 'free' && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel your subscription?')) {
                  cancelMutation.mutate();
                }
              }}
              className="text-sm text-red-600 hover:text-red-500"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-gray-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/24</p>
            </div>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-500">
            Update
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Billing History</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {invoices?.map((invoice) => (
            <li key={invoice.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                    invoice.status === 'paid' ? 'bg-green-100' : invoice.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {invoice.status === 'paid' ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : invoice.status === 'pending' ? (
                      <Calendar className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(invoice.invoiceUrl, '_blank')}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center mb-8">
                <span className={`mr-3 text-sm ${selectedInterval === 'month' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setSelectedInterval(selectedInterval === 'month' ? 'year' : 'month')}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      selectedInterval === 'year' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`ml-3 text-sm ${selectedInterval === 'year' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  Yearly
                  <span className="ml-1 text-green-600 font-medium">Save 20%</span>
                </span>
              </div>

              {/* Plans */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-lg border-2 p-6 ${
                      plan.popular
                        ? 'border-blue-600 shadow-lg'
                        : 'border-gray-200'
                    } ${plan.id === currentPlan.id ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                      <div className="mt-4">
                        {plan.price >= 0 ? (
                          <>
                            <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                            <span className="text-base font-medium text-gray-500">/{plan.interval}</span>
                          </>
                        ) : (
                          <span className="text-2xl font-medium text-gray-900">Contact Sales</span>
                        )}
                      </div>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="ml-2 text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        if (plan.id === 'enterprise') {
                          window.location.href = '/contact';
                        } else if (plan.id !== currentPlan.id) {
                          setSelectedPlan(plan);
                          upgradeMutation.mutate(plan.id);
                        }
                      }}
                      disabled={plan.id === currentPlan.id || upgradeMutation.isPending}
                      className={`mt-8 w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        plan.id === currentPlan.id
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-800 text-white hover:bg-gray-900'
                      }`}
                    >
                      {plan.id === currentPlan.id
                        ? 'Current Plan'
                        : plan.id === 'enterprise'
                        ? 'Contact Sales'
                        : upgradeMutation.isPending && selectedPlan?.id === plan.id
                        ? 'Upgrading...'
                        : 'Upgrade'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;