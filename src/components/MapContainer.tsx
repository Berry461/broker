'use client'
import { GoogleMap } from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import MarkerItem  from './MarkerItem'

// 👇 1. UPDATE THE INTERFACE to match your JSON column
interface ListingLocation {
  id: string;
  coordinates?: {    // Note: checking if it matches your DB column name "cordinates"
    lat: number;
    lng: number;
  }; 
}

interface MapContainerProps {
  center: {
    lat: number;
    lng: number;
  };
  listings: ListingLocation[]; 
}

const MapContainer = ({ center, listings }: MapContainerProps) => {
  const [apiReady, setApiReady] = useState(false)

  useEffect(() => {
    if (window.google && window.google.maps) {
      setApiReady(true)
    } else {
      const timer = setInterval(() => {
        if (window.google && window.google.maps) {
          setApiReady(true)
          clearInterval(timer)
        }
      }, 100)
      return () => clearInterval(timer)
    }
  }, [])

  if (!apiReady) return <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>

  return (
    <div className="w-full h-full">
      <GoogleMap
        mapContainerClassName="w-full h-full rounded-xl overflow-hidden"
        center={center}
        zoom={12}
        options={{ disableDefaultUI: false, zoomControl: true }}
      >
        {listings.map((listing) => {
          // 👇 2. UPDATE THE CHECK
          // We check if the 'cordinates' object exists inside the listing
          if (listing.coordinates && listing.coordinates.lat && listing.coordinates.lng) {
            return (
              <MarkerItem 
                key={listing.id}
                listing={listing}
                // 👇 3. UPDATE THE ACCESS PATH
                position={{ 
                  lat: listing.coordinates.lat, 
                  lng: listing.coordinates.lng 
                }} 
              />
            )
          }
          return null
        })}
      </GoogleMap>
    </div>
  )
}

export default MapContainer