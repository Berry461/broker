'use client'
import React, { useMemo, useState } from 'react'
import { MarkerF, InfoWindowF } from '@react-google-maps/api'
// 👇 Import without curly braces (Default Import)
import MarkerListingItem from './MarkerListingItem'

interface MarkerItemProps {
  position: {
    lat: number;
    lng: number;
  };
  listing: any;
}

export default function MarkerItem({ position, listing }: MarkerItemProps) {
  const [selected, setSelected] = useState(false)
  
  const mapPinIcon = useMemo(() => {
    if (typeof window !== 'undefined' && window.google) {
      return {
        url: '/map-pin.jpeg',
        scaledSize: new window.google.maps.Size(50, 50),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(25, 50), 
      }
    }
    return undefined
  }, [])

  return (
    <>
      <MarkerF 
        position={position}
        icon={mapPinIcon}
        onClick={() => setSelected(true)}
      />

      {selected && (
        <InfoWindowF 
          position={position}
          onCloseClick={() => setSelected(false)}
          options={{
            pixelOffset: new window.google.maps.Size(0, -50),
            disableAutoPan: false 
          }}
        >
          {/* Wrapper div to ensure content renders */}
          <div className="min-w-[240px]"> 
             <MarkerListingItem listing={listing} />
          </div>
        </InfoWindowF>
      )}
    </>
  )
}