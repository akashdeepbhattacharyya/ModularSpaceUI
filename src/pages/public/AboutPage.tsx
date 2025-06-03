import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  Lightbulb,
  Award,
  Globe,
  Heart,
  Rocket,
  Shield,
  ChevronRight
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Active Users', value: '50,000+' },
    { label: 'Designs Created', value: '1M+' },
    { label: 'Countries', value: '120+' },
    { label: 'Team Members', value: '45+' },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We push the boundaries of what\'s possible in design technology.',
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Every feature we build starts with understanding user needs.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your designs and data are protected with enterprise-grade security.',
    },
    {
      icon: Heart,
      title: 'Passion for Design',
      description: 'We believe great design should be accessible to everyone.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'Former architect with 15 years of experience in residential design.',
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'AI researcher and engineer, previously at Google and OpenAI.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      bio: 'Award-winning designer with expertise in 3D visualization.',
    },
    {
      name: 'David Kim',
      role: 'Head of Engineering',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      bio: 'Full-stack developer with a passion for building scalable systems.',
    },
  ];

  const milestones = [
    { year: '2021', event: 'ModularSpace founded in San Francisco' },
    { year: '2022', event: 'Launched AI-powered photo analysis' },
    { year: '2023', event: 'Reached 10,000 active users' },
    { year: '2024', event: 'Series A funding and team expansion' },
    { year: '2025', event: '50,000+ users and enterprise launch' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Reimagining Kitchen Design for Everyone
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to democratize interior design by making professional-grade tools 
              accessible, intuitive, and powered by cutting-edge AI technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600">{stat.value}</div>
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  ModularSpace was born from a simple observation: designing a kitchen shouldn't 
                  require years of training or expensive software.
                </p>
                <p>
                  In 2021, our founders—an architect and an AI researcher—joined forces to create 
                  a platform that would make professional kitchen design accessible to everyone. 
                  What started as a weekend project quickly grew into a mission to transform the 
                  entire industry.
                </p>
                <p>
                  Today, we're proud to empower over 50,000 homeowners, designers, and contractors 
                  with tools that were once reserved for large architectural firms.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  to="/auth/register"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Join our journey <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl">
                <Rocket className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium">Growing 200% YoY</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              The talented people behind ModularSpace
            </p>
          </div>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <img
                  className="mx-auto h-40 w-40 rounded-full object-cover"
                  src={member.image}
                  alt={member.name}
                />
                <h3 className="mt-6 text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-blue-600">{member.role}</p>
                <p className="mt-2 text-sm text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">
              Key milestones in the ModularSpace story
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300"></div>
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="text-blue-600 font-bold mb-2">{milestone.year}</div>
                    <p className="text-gray-700">{milestone.event}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Us in Shaping the Future of Design
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Whether you're a homeowner, designer, or just passionate about great design, 
            there's a place for you in the ModularSpace community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/register"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-100 transition-colors"
            >
              Start Designing
            </Link>
            <Link
              to="/careers"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;