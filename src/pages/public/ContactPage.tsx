import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  Users,
  Building,
  HelpCircle} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  type: string;
}

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

  const contactOptions = [
    {
      icon: Headphones,
      title: 'Sales',
      description: 'Talk to our sales team about pricing and features',
      email: 'sales@modularspace.com',
      phone: '+1 (555) 123-4567',
    },
    {
      icon: MessageSquare,
      title: 'Support',
      description: 'Get help with your account or technical issues',
      email: 'support@modularspace.com',
      responseTime: '< 2 hours',
    },
    {
      icon: Building,
      title: 'Enterprise',
      description: 'Custom solutions for large organizations',
      email: 'enterprise@modularspace.com',
      phone: '+1 (555) 123-4568',
    },
    {
      icon: Users,
      title: 'Partnerships',
      description: 'Explore partnership opportunities',
      email: 'partners@modularspace.com',
    },
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Market Street, Suite 400',
      location: 'San Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      hours: '9:00 AM - 6:00 PM PST',
    },
    {
      city: 'New York',
      address: '456 Broadway, Floor 12',
      location: 'New York, NY 10013',
      phone: '+1 (555) 987-6543',
      hours: '9:00 AM - 6:00 PM EST',
    },
    {
      city: 'London',
      address: '789 Oxford Street',
      location: 'London, W1D 2HG, UK',
      phone: '+44 20 1234 5678',
      hours: '9:00 AM - 6:00 PM GMT',
    },
  ];

  const faqs = [
    {
      question: 'How quickly can I get started?',
      answer: 'You can start designing immediately after signing up. No downloads or installations required.',
    },
    {
      question: 'Do you offer training?',
      answer: 'Yes! We offer free video tutorials, webinars, and personalized training for enterprise customers.',
    },
    {
      question: 'Can I import my existing designs?',
      answer: 'Yes, we support imports from AutoCAD, SketchUp, and other popular design formats.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use bank-level encryption and comply with SOC 2 and GDPR standards.',
    },
  ];

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/contact', data);
      toast.success('Message sent! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {contactOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600 mb-4">
                  <option.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                <div className="space-y-2">
                  <a href={`mailto:${option.email}`} className="text-sm text-blue-600 hover:text-blue-700 block">
                    {option.email}
                  </a>
                  {option.phone && (
                    <a href={`tel:${option.phone}`} className="text-sm text-gray-600 hover:text-gray-700 block">
                      {option.phone}
                    </a>
                  )}
                  {option.responseTime && (
                    <p className="text-xs text-gray-500">Response time: {option.responseTime}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Offices */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <input
                      {...register('firstName', { required: 'First name is required' })}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <input
                      {...register('lastName', { required: 'Last name is required' })}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company (optional)
                    </label>
                    <input
                      {...register('company')}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone (optional)
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    What can we help you with?
                  </label>
                  <select
                    {...register('type', { required: 'Please select a topic' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a topic</option>
                    <option value="sales">Sales inquiry</option>
                    <option value="support">Technical support</option>
                    <option value="partnership">Partnership opportunity</option>
                    <option value="feedback">Product feedback</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    {...register('message', {
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters'
                      }
                    })}
                    rows={6}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Office Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Offices</h2>
              <div className="space-y-6">
                {offices.map((office) => (
                  <div key={office.city} className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{office.city}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                        <div>
                          <p>{office.address}</p>
                          <p>{office.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-2" />
                        <a href={`tel:${office.phone}`} className="hover:text-blue-600">
                          {office.phone}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <p>{office.hours}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick FAQs */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Answers</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start">
                        <HelpCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">{faq.question}</h4>
                          <p className="text-sm text-gray-600">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Chat CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Immediate Help?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is available 24/7 via live chat
          </p>
          <button className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-100 transition-colors">
            <MessageSquare className="h-6 w-6 mr-2" />
            Start Live Chat
          </button>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;