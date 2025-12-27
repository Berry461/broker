'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { MapPin, BedDouble, Bath, Ruler, ChevronLeft, ChevronRight, Share2, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button' // Adjust path to your UI folder

// 1. Internal Component: The Image Slider
const ImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
        No Images Available
      </div>
    )
  }

  return (
    <div className="relative group w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
      {/* Main Image */}
      <Image
        src={images[currentIndex]}
        alt="Property Image"
        fill
        className="object-cover transition-transform duration-500 hover:scale-105"
        unoptimized={true}
      />

      {/* Left Arrow - Only show if multiple images */}
      {images.length > 1 && (
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Right Arrow */}
      {images.length > 1 && (
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                currentIndex === index ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 2. Main Page Component
function ViewListing({ params }: { params: { id: string } }) {
  
  // ⚠️ TODO: Fetch your listing data here using params.id (from Supabase)
  // For now, I am using a Mock Object so you can see the UI immediately.
  const listing = {
    id: params?.id || '1',
    title: 'Modern Luxury Villa with Pool',
    price: 850000,
    address: '123 Palm Springs Ave, California, USA',
    description: 'Experience luxury living in this stunning modern villa. Featuring a spacious open-plan living area, state-of-the-art kitchen, and a private backyard oasis with a heated pool. Perfect for families or entertaining guests. Located in a quiet neighborhood close to schools and parks.',
    bedroom: 4,
    bathroom: 3,
    area: 2500,
    // Combine your image sources into one array for the slider
    images: [
      '/placeholder-house-1.jpg', // Replace with listing.listingimages[].url
      '/placeholder-house-2.jpg',
      '/placeholder-house-3.jpg'
    ]
  }

  // Helper to safely get images from your real data structure
  // const images = listing.listingimages?.map((img: any) => img.url) || listing.image_urls || [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{listing.title}</h1>
                <div className="flex items-center gap-2 text-gray-500 mt-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <p className="text-lg">{listing.address}</p>
                </div>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" size="icon"><Share2 className="h-5 w-5" /></Button>
                <Button variant="outline" size="icon"><Heart className="h-5 w-5" /></Button>
            </div>
        </div>

        {/* 2. Image Slider Section (Takes the whole width) */}
        <ImageSlider images={listing.images} />

        {/* 3. Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Description & Details (Takes 2/3 space) */}
            <div className="md:col-span-2 space-y-6">
                
                {/* Key Stats Bar */}
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                         <div className="p-2 bg-white rounded-full shadow-sm">
                            <BedDouble className="h-6 w-6 text-blue-600" />
                         </div>
                         <div>
                            <p className="text-xs text-gray-500">Bedrooms</p>
                            <p className="font-bold">{listing.bedroom} Beds</p>
                         </div>
                    </div>
                    <div className="h-8 w-[1px] bg-gray-200"></div> {/* Divider */}
                    <div className="flex items-center gap-2">
                         <div className="p-2 bg-white rounded-full shadow-sm">
                            <Bath className="h-6 w-6 text-blue-600" />
                         </div>
                         <div>
                            <p className="text-xs text-gray-500">Bathrooms</p>
                            <p className="font-bold">{listing.bathroom} Baths</p>
                         </div>
                    </div>
                    <div className="h-8 w-[1px] bg-gray-200"></div> {/* Divider */}
                    <div className="flex items-center gap-2">
                         <div className="p-2 bg-white rounded-full shadow-sm">
                            <Ruler className="h-6 w-6 text-blue-600" />
                         </div>
                         <div>
                            <p className="text-xs text-gray-500">Area</p>
                            <p className="font-bold">{listing.area} Sq ft</p>
                         </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h2 className="text-2xl font-semibold mb-3">About this property</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        {listing.description}
                    </p>
                </div>
                
                {/* Map Placeholder or Extra Features could go here */}
            </div>

            {/* Right Column: Price & Agent Card (Sticky Sidebar) */}
            <div className="md:col-span-1">
                <div className="bg-white border rounded-xl p-6 shadow-lg sticky top-8">
                    <p className="text-gray-500 mb-1">Price</p>
                    <h2 className="text-4xl font-bold text-blue-600 mb-6">
                        ${listing.price.toLocaleString()}
                    </h2>

                    <div className="flex flex-col gap-3">
                        <Button className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700">
                            Book a Viewing
                        </Button>
                        <Button variant="outline" className="w-full text-lg py-6">
                            Contact Agent
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default ViewListing