'use client' // Must be a Client Component

import React from 'react';
import GoogleAddressSearch from './GoogleAddressSearch';
import { Button } from './ui/button';
import { Search } from 'lucide-react'; // Importing the Search icon from lucide-react

function HeroBanner() {
  const handleAddressSelect = (address: string | null) => {
    console.log('Selected address:', address);
    // You can add your address handling logic here
  };

  const handleCoordinates = (coords: { lat: number; lng: number }) => {
    console.log('Coordinates:', coords);
    // You can add your coordinates handling logic here
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Find Your Dream Home
        </h1>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <GoogleAddressSearch
                selectedAddress={handleAddressSelect}
                setCoordinates={handleCoordinates}
              />
            </div>
            <Button
              className="whitespace-nowrap h-[42px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;