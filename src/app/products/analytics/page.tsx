/*import ListingMapview from '@/components/ListingMapview'
import React from 'react'

function page() {
    return (
        <div className="px-10 p-10 mt-30">
            <ListingMapview type='SELL' />
        </div>
    )
}

export default page*/

import ListingMapview from '@/components/ListingMapview'

export default function Page() {
    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-8">Property Listings</h1>
            <ListingMapview type="SELL" />
        </div>
    )
}