'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function MegaFooter() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">YourBrand</h3>
            <p className="text-gray-400 mb-6">
              Transforming ideas into powerful digital experiences since 2015.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-3">
              <li><Link href="/products/analytics" className="text-gray-400 hover:text-white transition">Analytics</Link></li>
              <li><Link href="/products/crm" className="text-gray-400 hover:text-white transition">CRM</Link></li>
              <li><Link href="/products/marketing" className="text-gray-400 hover:text-white transition">Marketing</Link></li>
              <li><Link href="/products/enterprise" className="text-gray-400 hover:text-white transition">Enterprise</Link></li>
              <li><Link href="/products/api" className="text-gray-400 hover:text-white transition">API</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Solutions</h4>
            <ul className="space-y-3">
              <li><Link href="/solutions/healthcare" className="text-gray-400 hover:text-white transition">Healthcare</Link></li>
              <li><Link href="/solutions/finance" className="text-gray-400 hover:text-white transition">Finance</Link></li>
              <li><Link href="/solutions/education" className="text-gray-400 hover:text-white transition">Education</Link></li>
              <li><Link href="/solutions/retail" className="text-gray-400 hover:text-white transition">Retail</Link></li>
              <li><Link href="/solutions/government" className="text-gray-400 hover:text-white transition">Government</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/resources/docs" className="text-gray-400 hover:text-white transition">Documentation</Link></li>
              <li><Link href="/resources/tutorials" className="text-gray-400 hover:text-white transition">Tutorials</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
              <li><Link href="/webinars" className="text-gray-400 hover:text-white transition">Webinars</Link></li>
              <li><Link href="/case-studies" className="text-gray-400 hover:text-white transition">Case Studies</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition">Careers</Link></li>
              <li><Link href="/press" className="text-gray-400 hover:text-white transition">Press</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              <li><Link href="/partners" className="text-gray-400 hover:text-white transition">Partners</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-10"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">Cookie Policy</Link>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} YourBrand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}