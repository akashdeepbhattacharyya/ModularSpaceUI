import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  const navigation = [
    {
      name: 'Product',
      href: '/product',
      dropdown: [
        { name: 'Kitchen Designer', href: '/product/kitchen' },
        { name: 'Bathroom Designer', href: '/product/bathroom' },
        { name: 'Living Room', href: '/product/living' },
        { name: 'Commercial Spaces', href: '/product/commercial' },
      ]
    },
    {
      name: 'Solutions',
      href: '/solutions',
      dropdown: [
        { name: 'For Homeowners', href: '/solutions/homeowners' },
        { name: 'For Designers', href: '/solutions/designers' },
        { name: 'For Contractors', href: '/solutions/contractors' },
        { name: 'For Manufacturers', href: '/solutions/manufacturers' },
      ]
    },
    {
      name: 'Resources',
      href: '/resources',
      dropdown: [
        { name: 'Blog', href: '/blog' },
        { name: 'Design Gallery', href: '/gallery' },
        { name: 'Tutorials', href: '/tutorials' },
        { name: 'Webinars', href: '/webinars' },
        { name: 'API Docs', href: '/api-docs' },
      ]
    },
    { name: 'Pricing', href: '/pricing' },
    {
      name: 'Company',
      href: '/company',
      dropdown: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Partners', href: '/partners' },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">ModularSpace</span>
              </Link>
              
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {navigation.map((item) => (
                  <div key={item.name} className="relative">
                    {item.dropdown ? (
                      <div
                        className="relative"
                        onMouseEnter={() => setActiveDropdown(item.name)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium inline-flex items-center">
                          {item.name}
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </button>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                          >
                            <div className="py-1">
                              {item.dropdown.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/auth/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-4">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/auth/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/auth/register"
                className="block px-3 py-2 text-base font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Free Trial
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-2xl font-bold mb-4">ModularSpace</h3>
              <p className="text-gray-400 text-sm">
                AI-powered design platform for modern spaces.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/product/kitchen" className="text-gray-400 hover:text-white text-sm">Kitchen Designer</Link></li>
                <li><Link to="/product/bathroom" className="text-gray-400 hover:text-white text-sm">Bathroom Designer</Link></li>
                <li><Link to="/marketplace" className="text-gray-400 hover:text-white text-sm">Marketplace</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white text-sm">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-400 hover:text-white text-sm">Blog</Link></li>
                <li><Link to="/tutorials" className="text-gray-400 hover:text-white text-sm">Tutorials</Link></li>
                <li><Link to="/api-docs" className="text-gray-400 hover:text-white text-sm">API Docs</Link></li>
                <li><Link to="/gallery" className="text-gray-400 hover:text-white text-sm">Gallery</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">About</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-white text-sm">Careers</Link></li>
                <li><Link to="/press" className="text-gray-400 hover:text-white text-sm">Press</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white text-sm">Cookies</Link></li>
                <li><Link to="/gdpr" className="text-gray-400 hover:text-white text-sm">GDPR</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 ModularSpace. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;