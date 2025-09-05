'use client'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { BedDouble, Bath, Ruler } from 'lucide-react'

interface ListingProps {
    listings: any[]
}

function Listing({ listings }: ListingProps) {
    if (!listings || listings.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No listings found</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Available Properties ({listings.length})</h2>

            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listings.map((listing) => (
                    <div key={listing.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Listing Image */}
                        {listing.listingimages?.length > 0 && (
                            <div className="relative h-48 w-full">
                                <Image
                                    src={listing.listingimages[0].url}
                                    alt={listing.title || 'Property image'}
                                    fill
                                    className="object-cover"
                                    unoptimized={true}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.onerror = null
                                        target.src = '/placeholder-property.jpg'
                                    }}
                                />


                            </div>
                        )}
                        {/* Listing Details */}
                        <div className="flex mt-2 flex-col gap-2">
                            <h2 className="font-bold text-xl"> {listing.price ? `$${listing.price.toLocaleString()}` : 'N/A'}</h2>
                            <h2 className="flex gap-2 text-sm text-gray-400">
                                <MapPin className="h-4 w-4" />
                                {listing.address}</h2>
                            <div className="flex gap-2 items-center">
                                <h2 className="flex gap-2 text-sm bg-slate-200
                                rounded-md p-2 w-full text-gray-500 justify-center">
                                    <BedDouble className='h-4 w-4' />
                                    {listing?.bedroom}
                                </h2>
                                <h2 className="flex gap-2 text-sm bg-slate-200
                                rounded-md p-2 w-full text-gray-500 justify-center">
                                    <Bath className='h-4 w-4' />
                                    {listing?.bathroom}
                                </h2>
                                <h2 className="flex gap-2 text-sm bg-slate-200
                                rounded-md p-2 w-full text-gray-500 justify-center">
                                    <Ruler className='h-4 w-4' />
                                    {listing?.area}
                                </h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Listing