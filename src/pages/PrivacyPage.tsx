import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, Eye, Shield, Database, Globe, Users, Mail, AlertCircle } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const sections = [
    { id: 'overview', title: '1. Overview', icon: Eye },
    { id: 'information', title: '2. Information We Collect', icon: Database },
    { id: 'usage', title: '3. How We Use Your Information', icon: Users },
    { id: 'sharing', title: '4. Information Sharing', icon: Globe },
    { id: 'security', title: '5. Data Security', icon: Shield },
    { id: 'cookies', title: '6. Cookies and Tracking', icon: Eye },
    { id: 'rights', title: '7. Your Rights', icon: Lock },
    { id: 'children', title: '8. Children\'s Privacy', icon: Users },
    { id: 'changes', title: '9. Changes to Privacy Policy', icon: AlertCircle },
    { id: 'contact', title: '10. Contact Us', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <Lock className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="mt-4 text-lg text-gray-600">
              Last updated: January 15, 2024
            </p>
            <p className="mt-2 text-gray-600">
              Your privacy is important to us at ModularSpace
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <section.icon className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700 hover:text-blue-600">{section.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* GDPR Compliance Badge */}
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
            <div className="flex">
              <Shield className="h-5 w-5 text-green-400 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <strong>GDPR Compliant:</strong> We are committed to protecting your data and respecting your privacy rights under GDPR and other privacy regulations.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <section id="overview">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="h-6 w-6 text-blue-600 mr-3" />
                1. Overview
              </h2>
              <p className="text-gray-600 mb-4">
                This Privacy Policy describes how ModularSpace, Inc. ("we", "us", or "our") collects, uses, and shares your personal information when you use our AI-enhanced kitchen design platform ("Service").
              </p>
              <p className="text-gray-600">
                We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This policy outlines our practices concerning the collection, use, and disclosure of your information.
              </p>
            </section>

            <section id="information">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="h-6 w-6 text-blue-600 mr-3" />
                2. Information We Collect
              </h2>
              
              <h3 className="text-lg font-medium text-gray-800 mb-3">Information You Provide</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
                <li><strong>Account Information:</strong> Name, email address, password, phone number</li>
                <li><strong>Profile Information:</strong> Business details, preferences, avatar</li>
                <li><strong>Project Data:</strong> Kitchen designs, measurements, material selections</li>
                <li><strong>Payment Information:</strong> Billing address, payment method (processed by secure third-party providers)</li>
                <li><strong>Communications:</strong> Messages, feedback, support requests</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">Information Collected Automatically</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
                <li><strong>Usage Data:</strong> Features used, time spent, interaction patterns</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
                <li><strong>Log Data:</strong> Access times, pages viewed, errors encountered</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mb-3">Information from Third Parties</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>OAuth providers (Google, Facebook) when you sign in using their services</li>
                <li>Analytics providers to help us understand usage patterns</li>
                <li>Customer support tools to improve our service</li>
              </ul>
            </section>

            <section id="usage">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                3. How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and send transaction notifications</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Personalize your experience and provide customized content</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent or illegal activities</li>
                <li>Develop new features and services</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section id="sharing">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="h-6 w-6 text-blue-600 mr-3" />
                4. Information Sharing
              </h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>With Your Consent:</strong> When you explicitly agree to sharing</li>
                <li><strong>Service Providers:</strong> With trusted third parties who assist in operating our Service</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                <li><strong>Aggregated Data:</strong> Non-identifiable aggregated data for analytics</li>
              </ul>
            </section>

            <section id="security">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-6 w-6 text-blue-600 mr-3" />
                5. Data Security
              </h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
                <li>Regular backups and disaster recovery plans</li>
              </ul>
            </section>

            <section id="cookies">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="h-6 w-6 text-blue-600 mr-3" />
                6. Cookies and Tracking
              </h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
                <li>Keep you logged in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use our Service</li>
                <li>Deliver personalized content</li>
                <li>Improve our Service performance</li>
              </ul>
              <p className="text-gray-600">
                You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our Service.
              </p>
            </section>

            <section id="rights">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="h-6 w-6 text-blue-600 mr-3" />
                7. Your Rights
              </h2>
              <p className="text-gray-600 mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your data</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
                <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-600 mt-4">
                To exercise these rights, please contact us at privacy@modularspace.com.
              </p>
            </section>

            <section id="children">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                8. Children's Privacy
              </h2>
              <p className="text-gray-600">
                Our Service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section id="changes">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-6 w-6 text-blue-600 mr-3" />
                9. Changes to Privacy Policy
              </h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. For material changes, we will provide notice through the Service or by email.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="h-6 w-6 text-blue-600 mr-3" />
                10. Contact Us
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="font-semibold text-gray-800">Data Protection Officer</p>
                  <p className="text-gray-600">ModularSpace, Inc.</p>
                  <p className="text-gray-600">123 Design Street, Suite 100</p>
                  <p className="text-gray-600">San Francisco, CA 94105</p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Email:</strong> privacy@modularspace.com
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>EU Representative:</strong> ModularSpace EU Ltd.<br />
                    Dublin, Ireland<br />
                    eu-privacy@modularspace.com
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/terms"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Terms of Service
            </Link>
            <Link
              to="/app/settings"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Manage Privacy Settings
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;