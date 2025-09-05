"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

type AppUser = User & {
  user_metadata?: {
    avatar_url?: string;
  };
}; // Adjust the import path as necessary
const supabase = createClient();


type NavItem = {
  id: number;
  name: string;
  path?: string;
  subItems?: {
    title: string;
    items: {
      name: string;
      path: string;
      description?: string;
    }[];
  }[];
};

const MegaNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenuId, setOpenSubMenuId] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  //const [user, setUser] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navItems: NavItem[] = [
    {
      id: 1,
      name: 'Buy',
      subItems: [
        {
          title: 'Software Solutions',
          items: [
            { name: 'Analytics Platform', path: '/products/analytics', description: 'Real-time data insights' },
            { name: 'CRM System', path: '/products/crm', description: 'Customer relationship management' },
            { name: 'Marketing Suite', path: '/products/marketing', description: 'Campaign automation tools' },
          ]
        },
        {
          title: 'Services',
          items: [
            { name: 'Implementation', path: '/services/implementation' },
            { name: 'Training', path: '/services/training' },
            { name: '24/7 Support', path: '/services/support' },
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Rent',
      subItems: [
        {
          title: 'By Industry',
          items: [
            { name: 'Healthcare', path: '/solutions/healthcare' },
            { name: 'Finance', path: '/solutions/finance' },
            { name: 'Education', path: '/solutions/education' },
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Sell',
      subItems: [
        {
          title: 'By Industry',
          items: [
            { name: 'Healthcare', path: '/solutions/healthcare' },
            { name: 'Finance', path: '/solutions/finance' },
            { name: 'Education', path: '/solutions/education' },
          ]
        }
      ]
    },
    { id: 4, name: 'Resources', path: '/resources' },
    { id: 5, name: 'Company', path: '/about' },
  ];

  // Add auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Check current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSubMenu = (id: number) => {
    setOpenSubMenuId(openSubMenuId === id ? null : id);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Broker
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                {item.path ? (
                  <Link
                    href={item.path}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleSubMenu(item.id)}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    {item.name}
                    <svg
                      className={`ml-1 h-4 w-4 transition-transform ${openSubMenuId === item.id ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}

                {item.subItems && (openSubMenuId === item.id) && (
                  <div className="absolute left-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4 space-y-6 z-50">
                    {item.subItems.map((subItem, subIndex) => (
                      <div key={subIndex}>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {subItem.title}
                        </h3>
                        <div className="mt-2 space-y-2">
                          {subItem.items.map((subItem, itemIndex) => (
                            <Link
                              key={itemIndex}
                              href={subItem.path}
                              className="group flex items-start p-2 rounded-md hover:bg-gray-50"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                                  {subItem.name}
                                </p>
                                {subItem.description && (
                                  <p className="text-xs text-gray-500">{subItem.description}</p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Post a Property
            </Link>

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <Link href="/account" className="flex items-center">
                <img
                  src={user.user_metadata?.avatar_url || '/default-avatar.png'}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className={`h-6 w-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`h-6 w-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          {navItems.map((item) => (
            <div key={item.id}>
              {item.path ? (
                <Link
                  href={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  onClick={() => toggleSubMenu(item.id)}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex justify-between items-center"
                >
                  {item.name}
                  <svg
                    className={`h-5 w-5 ${openSubMenuId === item.id ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {item.subItems && openSubMenuId === item.id && (
                <div className="pl-4 pt-2 space-y-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <div key={subIndex}>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-3 py-1">
                        {subItem.title}
                      </h3>
                      {subItem.items.map((subItem, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={subItem.path}
                          className="block pl-6 pr-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.name}
                          {subItem.description && (
                            <p className="text-xs text-gray-500">{subItem.description}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 border-t border-gray-200">
            <Link
              href="/register"
              className="block w-full px-4 py-2 mt-2 text-center rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Post a Property
            </Link>
            {loading ? (
              <div className="w-8 h-8 mx-auto rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <Link
                href="/account"
                className="flex justify-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img
                  src={user.user_metadata?.avatar_url || '/default-avatar.png'}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </Link>
            ) : (
              <Link
                href="/login"
                className="block w-full px-4 py-2 text-center rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MegaNavbar;