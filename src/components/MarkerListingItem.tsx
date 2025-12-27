'use client'
import React from 'react'
import Image from 'next/image'
import { MapPin, BedDouble, Bath, Ruler } from 'lucide-react'
import { Button } from './ui/button'

interface MarkerListingItemProps {
  listing: any; 
}

function MarkerListingItem({ listing }: MarkerListingItemProps) {
    if (!listing) return null;

    const firstImageUrl = listing.listingimages?.[0]?.url ||
        listing.image_urls?.[0] ||
        null;

    return (
        <div className="w-60 bg-white rounded-lg overflow-hidden shadow-sm">
            
            {/* Image */}
            <div className="relative h-32 w-full bg-gray-100">
                {firstImageUrl ? (
                    <Image
                        src={firstImageUrl}
                        alt={listing.title || 'Property'}
                        fill
                        className="object-cover"
                        unoptimized={true}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col gap-1">
                <h2 className="font-bold text-base text-black">
                    {listing.price ? `$${listing.price.toLocaleString()}` : 'N/A'}
                </h2>

                <div className="flex gap-1 items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-[150px]">
                        {listing.address || 'Address hidden'}
                    </span>
                </div>

                <div className="flex justify-between items-center mt-2 gap-1 text-[10px] text-gray-600">
                     <span className="bg-slate-100 px-1 py-1 rounded flex items-center gap-1">
                        <BedDouble className="h-3 w-3"/> {listing.bedroom || 0}
                     </span>
                     <span className="bg-slate-100 px-1 py-1 rounded flex items-center gap-1">
                        <Bath className="h-3 w-3"/> {listing.bathroom || 0}
                     </span>
                     <span className="bg-slate-100 px-1 py-1 rounded flex items-center gap-1">
                        <Ruler className="h-3 w-3"/> {listing.area || 0}
                     </span>
                </div>
                <Button>View Details</Button>
            </div>
        </div>
    )
}

export default MarkerListingItem