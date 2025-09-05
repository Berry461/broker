'use client'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { useEffect, useState } from 'react'


interface MapContainerProps {
    center: {
        lat: number;
        lng: number;
    };
}

const MapContainer = ({ center }: MapContainerProps) => {
    //const center = { lat: -3.745, lng: -38.523 }
    const [apiReady, setApiReady] = useState(false)

    useEffect(() => {
        // Check if Google Maps API is already loaded by GoogleAddressSearch
        if (window.google && window.google.maps) {
            setApiReady(true)
        } else {
            // Fallback check in case loading is slightly delayed
            const timer = setInterval(() => {
                if (window.google && window.google.maps) {
                    setApiReady(true)
                    clearInterval(timer)
                }
            }, 100)

            return () => clearInterval(timer)
        }
    }, [])

    if (!apiReady) {
        return (
            <div className="h-[400px] w-full flex items-center justify-center bg-gray-100">
                Loading map...
            </div>
        )
    }

    return (
        <div className="w-full h-[500px]">
            <GoogleMap
                mapContainerClassName="w-full h-full"
                center={center}
                zoom={12}
            >
                <Marker position={center} />
                {/* Optional: Show coordinates text */}
                <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
                    Lat: {center.lat.toFixed(4)}, Lng: {center.lng.toFixed(4)}
                </div>
            </GoogleMap>
        </div>
    )
}

export default MapContainer