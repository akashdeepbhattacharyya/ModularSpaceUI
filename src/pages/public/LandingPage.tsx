import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Palette, Box, Clock, Users, Shield, Check, Play } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-1.5 border border-transparent text-xs font-medium rounded-full text-blue-700 bg-blue-100 mb-4">
              🎉 New: AI-Powered Kitchen Design Assistant
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Design Your Dream Kitchen
              <span className="text-blue-600"> with AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform any photo into a stunning 3D kitchen design. Powered by advanced AI,
              real-time collaboration, and photorealistic rendering.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/auth/register"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-md">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>

          {/* Hero Image/3D Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-1">
              <div className="bg-white rounded-xl p-8 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop"
                  alt="Kitchen Designer Interface"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">1M+</div>
              <div className="text-sm text-gray-600">Designs Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Design Like a Pro
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features that make kitchen design effortless and fun
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Design your dream kitchen in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-xl p-8 ${
                  plan.featured
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-gray-50'
                }`}
              >
                {plan.featured && (
                  <div className="text-sm font-semibold text-center mb-4 uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className={`text-4xl font-bold mb-4 ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                  ${plan.price}
                  <span className={`text-lg font-normal ${plan.featured ? 'text-blue-100' : 'text-gray-600'}`}>
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className={`h-5 w-5 mr-2 mt-0.5 ${plan.featured ? 'text-white' : 'text-green-500'}`} />
                      <span className={plan.featured ? 'text-white' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/auth/register"
                  className={`block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.featured
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Kitchen?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of homeowners and professionals designing with ModularSpace
          </p>
          <Link
            to="/auth/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg shadow-lg"
          >
            Start Your Free Trial <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: <Sparkles className="h-6 w-6 text-blue-600" />,
    title: "AI-Powered Design",
    description: "Upload a photo and watch AI transform it into a 3D kitchen design in seconds."
  },
  {
    icon: <Palette className="h-6 w-6 text-blue-600" />,
    title: "Real-time Material Swapping",
    description: "Change cabinets, countertops, and finishes instantly with one click."
  },
  {
    icon: <Box className="h-6 w-6 text-blue-600" />,
    title: "3D & AR Visualization",
    description: "Walk through your design in 3D or see it in your actual space with AR."
  },
  {
    icon: <Clock className="h-6 w-6 text-blue-600" />,
    title: "Instant Cost Estimation",
    description: "Get real-time pricing from verified vendors as you design."
  },
  {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    title: "Collaborate in Real-time",
    description: "Work with designers, contractors, and family members simultaneously."
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-600" />,
    title: "Professional Grade",
    description: "Industry-standard tools trusted by thousands of professionals."
  }
];

const steps = [
  {
    title: "Upload Your Space",
    description: "Take a photo of your kitchen or start with our templates"
  },
  {
    title: "Design with AI",
    description: "Our AI helps you create the perfect layout and choose materials"
  },
  {
    title: "Share & Order",
    description: "Get quotes, collaborate with pros, and order directly"
  }
];

const pricingPlans = [
  {
    name: "Free",
    price: 0,
    features: [
      "1 active project",
      "Basic 2D design tools",
      "Limited material library",
      "Community support"
    ]
  },
  {
    name: "Home",
    price: 29,
    featured: true,
    features: [
      "Unlimited projects",
      "AI photo analysis",
      "Full material library",
      "4K rendering",
      "Priority support"
    ]
  },
  {
    name: "Pro",
    price: 99,
    features: [
      "Everything in Home",
      "Team collaboration",
      "White-label options",
      "API access",
      "Dedicated support"
    ]
  }
];

export default LandingPage;