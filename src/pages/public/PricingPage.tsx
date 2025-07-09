import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  Star,
  Shield,
  Zap,
  Users,
  Headphones,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const PricingPage: React.FC = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for trying out ModularSpace',
      price: { monthly: 0, yearly: 0 },
      features: [
        { name: '1 active project', included: true },
        { name: 'Basic 2D design tools', included: true },
        { name: 'Limited material library', included: true },
        { name: '5 renders per month', included: true },
        { name: 'Community support', included: true },
        { name: 'Watermarked exports', included: true },
        { name: 'AI features', included: false },
        { name: 'Collaboration tools', included: false },
        { name: 'API access', included: false },
      ],
      cta: 'Get Started',
      ctaLink: '/auth/register',
      popular: false,
    },
    {
      name: 'Home',
      description: 'For homeowners and DIY enthusiasts',
      price: { monthly: 29, yearly: 290 },
      features: [
        { name: 'Unlimited projects', included: true },
        { name: 'Full 2D & 3D design tools', included: true },
        { name: 'Complete material library', included: true },
        { name: '100 renders per month', included: true },
        { name: 'AI photo analysis', included: true },
        { name: 'Priority support', included: true },
        { name: 'No watermarks', included: true },
        { name: 'Share with 3 collaborators', included: true },
        { name: 'API access', included: false },
      ],
      cta: 'Start Free Trial',
      ctaLink: '/auth/register',
      popular: true,
    },
    {
      name: 'Professional',
      description: 'For designers and contractors',
      price: { monthly: 99, yearly: 990 },
      features: [
        { name: 'Everything in Home', included: true },
        { name: 'Unlimited renders', included: true },
        { name: 'Advanced AI features', included: true },
        { name: 'White-label exports', included: true },
        { name: 'Team collaboration (10 users)', included: true },
        { name: 'API access', included: true },
        { name: 'Custom materials', included: true },
        { name: 'Client presentation mode', included: true },
        { name: 'Dedicated account manager', included: true },
      ],
      cta: 'Start Free Trial',
      ctaLink: '/auth/register',
      popular: false,
    },
    {
      name: 'Enterprise',
      description: 'For large teams and manufacturers',
      price: { monthly: -1, yearly: -1 },
      features: [
        { name: 'Everything in Professional', included: true },
        { name: 'Unlimited team members', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'SLA guarantee', included: true },
        { name: 'On-premise deployment', included: true },
        { name: 'Custom training', included: true },
        { name: 'Volume licensing', included: true },
        { name: 'Priority feature requests', included: true },
        { name: '24/7 phone support', included: true },
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      popular: false,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the credit will be applied to future invoices.',
    },
    {
      question: 'What happens to my projects if I downgrade?',
      answer: 'Your projects remain safe and accessible. However, you may lose access to certain features depending on your new plan. Projects will be read-only if you exceed the project limit.',
    },
    {
      question: 'Do you offer educational discounts?',
      answer: 'Yes! We offer 50% off for students and educators. Contact our support team with proof of enrollment or employment to receive your discount code.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual Enterprise plans.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your design needs. All plans include our core features with no hidden fees.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex items-center justify-center"
          >
            <span className={`mr-3 text-lg ${billingInterval === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingInterval === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 text-lg ${billingInterval === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Save 20%
              </span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl ${
                  plan.popular
                    ? 'bg-white ring-2 ring-blue-600 shadow-xl scale-105 lg:scale-110'
                    : 'bg-white shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                  
                  <div className="mt-6">
                    {plan.price.monthly >= 0 ? (
                      <div className="flex items-baseline">
                        <span className="text-4xl font-extrabold text-gray-900">
                          ${billingInterval === 'monthly' ? plan.price.monthly : Math.round(plan.price.yearly / 12)}
                        </span>
                        <span className="ml-2 text-lg text-gray-500">/month</span>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">Custom Pricing</div>
                    )}
                    {billingInterval === 'yearly' && plan.price.yearly > 0 && (
                      <p className="mt-1 text-sm text-gray-500">
                        ${plan.price.yearly} billed annually
                      </p>
                    )}
                  </div>

                  <Link
                    to={plan.ctaLink}
                    className={`mt-8 block w-full py-3 px-6 rounded-lg text-center font-medium transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={`ml-3 text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Compare Plans</h2>
            <p className="mt-4 text-lg text-gray-600">
              Detailed comparison of all features across plans
            </p>
          </div>

          {/* Comparison table would go here */}
          <div className="text-center text-gray-500">
            <p>Detailed comparison table coming soon...</p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="flex justify-center">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Secure Payments</h3>
              <p className="mt-2 text-sm text-gray-500">256-bit SSL encryption</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Zap className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Instant Access</h3>
              <p className="mt-2 text-sm text-gray-500">Start designing immediately</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">50k+ Users</h3>
              <p className="mt-2 text-sm text-gray-500">Join our growing community</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Headphones className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">24/7 Support</h3>
              <p className="mt-2 text-sm text-gray-500">We're here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-gray-50 rounded-lg"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 rounded-lg"
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Kitchen Design Process?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start your free trial today. No credit card required.
            </p>
            <Link
              to="/auth/register"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-100 transition-colors"
            >
              Start Your Free Trial
            </Link>
            <p className="mt-4 text-sm text-blue-100">
              14-day free trial • Cancel anytime • No credit card required
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;