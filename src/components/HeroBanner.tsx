'use client';

import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function HeroBanner() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add your search logic here
  };

  return (
    <div className="relative w-full h-96">
      {/* Background Image Only - no extra colored div */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        }}
      ></div>
      
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Content Container - left aligned */}
      <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Dream Home
          </h1>
          <p className="text-xl text-white mb-6">
            Search properties in your ideal location
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="w-full max-w-lg">
            <div className="relative flex items-center shadow-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter an address, neighborhood, city or zip code"
                className="w-full py-4 px-6 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg border-0"
              />
              <button
                type="submit"
                className="absolute right-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Search properties"
              >
                <FiSearch className="h-6 w-6" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}