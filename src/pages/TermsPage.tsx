import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, FileText, Scale, AlertCircle } from 'lucide-react';

const TermsPage: React.FC = () => {
  const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'services', title: '2. Description of Services' },
    { id: 'account', title: '3. Account Registration' },
    { id: 'usage', title: '4. Acceptable Use' },
    { id: 'intellectual', title: '5. Intellectual Property' },
    { id: 'payment', title: '6. Payment Terms' },
    { id: 'privacy', title: '7. Privacy Policy' },
    { id: 'termination', title: '8. Termination' },
    { id: 'disclaimer', title: '9. Disclaimer of Warranties' },
    { id: 'limitation', title: '10. Limitation of Liability' },
    { id: 'changes', title: '11. Changes to Terms' },
    { id: 'contact', title: '12. Contact Information' },
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
            <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mt-4 text-lg text-gray-600">
              Last updated: January 15, 2024
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Alert Box */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  By using ModularSpace, you agree to these terms. Please read them carefully.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <section id="acceptance">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using ModularSpace ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-600">
                These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and ModularSpace, Inc. ("Company", "we", "us", or "our"), concerning your access to and use of the ModularSpace platform.
              </p>
            </section>

            <section id="services">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Services</h2>
              <p className="text-gray-600 mb-4">
                ModularSpace provides an AI-enhanced design platform for creating modular kitchen designs. Our services include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>2D and 3D kitchen design tools</li>
                <li>AI-powered layout optimization and recommendations</li>
                <li>Real-time collaboration features</li>
                <li>Photorealistic rendering capabilities</li>
                <li>Material and vendor marketplace</li>
                <li>Project management tools</li>
                <li>Cost estimation and budgeting features</li>
              </ul>
            </section>

            <section id="account">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
              <p className="text-gray-600 mb-4">
                To use certain features of the Service, you must register for an account. When you register for an account, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security and confidentiality of your login credentials</li>
                <li>Accept all risks of unauthorized access to your account</li>
                <li>Immediately notify us of any unauthorized use of your account</li>
              </ul>
              <p className="text-gray-600 mt-4">
                You must be at least 18 years old to use this Service. By agreeing to these Terms, you represent and warrant that you are at least 18 years of age.
              </p>
            </section>

            <section id="usage">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-600 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Upload or transmit viruses or malicious code</li>
                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Collect or harvest any personally identifiable information</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Engage in any activity that could damage, disable, or impair the Service</li>
              </ul>
            </section>

            <section id="intellectual">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of ModularSpace, Inc. and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
              <p className="text-gray-600">
                You retain ownership of any content you create using the Service. However, by using the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute your content in connection with the Service.
              </p>
            </section>

            <section id="payment">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment Terms</h2>
              <p className="text-gray-600 mb-4">
                Certain features of the Service require payment. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Service. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date.
              </p>
              <p className="text-gray-600">
                Subscription fees are billed in advance on a monthly or annual basis and are non-refundable. We reserve the right to change our prices at any time. Any price changes will take effect at the start of the next billing cycle.
              </p>
            </section>

            <section id="privacy">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy Policy</h2>
              <p className="text-gray-600">
                Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices. By using the Service, you consent to our collection, use, and disclosure of your information as described in our Privacy Policy.
              </p>
            </section>

            <section id="termination">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
              <p className="text-gray-600 mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="text-gray-600">
                If you wish to terminate your account, you may simply discontinue using the Service or contact us at support@modularspace.com.
              </p>
            </section>

            <section id="disclaimer">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-gray-600">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. NEITHER THE COMPANY NOR ANY PERSON ASSOCIATED WITH THE COMPANY MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICE.
              </p>
            </section>

            <section id="limitation">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-600">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE COMPANY, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICE.
              </p>
            </section>

            <section id="changes">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-600">
                <p className="font-semibold">ModularSpace, Inc.</p>
                <p>123 Design Street, Suite 100</p>
                <p>San Francisco, CA 94105</p>
                <p>Email: legal@modularspace.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/privacy"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FileText className="h-5 w-5 mr-2" />
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;