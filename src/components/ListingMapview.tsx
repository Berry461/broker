'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import Listing from './Listing'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import FilterSection from './FilterSection'
import dynamic from 'next/dynamic'

const supabase = createClient()

// 👇 1. Define the Interface to match your Database
interface ListingLocation {
  id: string;
  coordinates?: {    // Note: checking if it matches your DB column name "cordinates"
    lat: number;
    lng: number;
  };
  price: number;
  title: string;
  address: string;
  [key: string]: any; // Allows other fields to pass through without errors
}

interface ListingMapviewProps {
  type: string
}

// Dynamic import with SSR disabled
const MapContainer = dynamic(
  () => import('./MapContainer'),
  {
    ssr: false,
    loading: () => (
      <div className="hidden md:block w-full h-[500px] bg-gray-50 rounded-xl flex items-center justify-center border">
        <p className="text-gray-400">Loading map component...</p>
      </div>
    )
  }
)

const DynamicGoogleAddressSearch = dynamic(
  () => import('./GoogleAddressSearch'),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 w-full bg-gray-100 rounded-md animate-pulse" />
    )
  }
)

function ListingMapview({ type }: ListingMapviewProps) {
  const [listings, setListings] = useState<any[]>([]) // You can revert to <Listing[]> if you have the type definition
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedAddress, setSearchedAddress] = useState('')
  
  // Filters
  const [filters, setFilters] = useState({
    bedCount: '',
    bathCount: '',
    parkingCount: '',
    homeType: 'All'
  })

  // Map Center State (Default: Fortaleza, Brazil based on your coordinates)
  const [mapCenter, setMapCenter] = useState({
    lat: -3.745,
    lng: -38.523
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('listing')
        .select(`*, listingimages(url, listing_id)`)
        .eq('active', 'true')
        .eq('type', 'Sell')
        .order('id', { ascending: false })

      if (filters.bedCount) {
        const bedMin = parseInt(filters.bedCount)
        if (!isNaN(bedMin)) query = query.gte('bedroom', bedMin.toString())
      }

      if (filters.bathCount) {
        const bathMin = parseInt(filters.bathCount)
        if (!isNaN(bathMin)) query = query.gte('bathroom', bathMin.toString())
      }

      if (filters.parkingCount) {
        const parkMin = parseInt(filters.parkingCount)
        if (!isNaN(parkMin)) query = query.gte('parking', parkMin.toString())
      }

      if (filters.homeType !== 'All') {
        query = query.eq('propertyType', filters.homeType)
      }

      if (searchQuery) {
        query = query.ilike('address', `%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setListings(data || [])
      
      if (searchQuery) {
        setSearchedAddress(searchQuery)
      }
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }, [filters, searchQuery])

  useEffect(() => {
    fetchListings()
  }, [fetchListings, type])

  const handleSearch = async () => {
    await fetchListings()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Filters and Search Bar */}
      <div className="p-4 border-b sticky top-0 bg-white z-20 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap items-center">
          <div className="w-full sm:w-auto flex-grow max-w-md">
            <DynamicGoogleAddressSearch
              selectedAddress={(value: string | null) => setSearchQuery(value ?? '')}
              setCoordinates={(coords) => {
                console.log('New coordinates:', coords);
                setMapCenter(coords); // This updates the MapContainer center
              }}
            />
          </div>

          <FilterSection
            onBedChange={(value) => handleFilterChange('bedCount', value)}
            onBathChange={(value) => handleFilterChange('bathCount', value)}
            onParkingChange={(value) => handleFilterChange('parkingCount', value)}
            onHomeTypeChange={(value) => handleFilterChange('homeType', value)}
          />

          <Button className="flex gap-2" onClick={handleSearch}>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Results Header */}
      {searchedAddress && (
        <div className="container mx-auto px-4 pt-6">
          <h2 className="text-xl font-semibold">
            Showing results for: <span className="text-primary">{searchedAddress}</span>
          </h2>
          {listings.length === 0 && !loading && (
            <p className="text-gray-500 mt-2">No properties found matching this address.</p>
          )}
        </div>
      )}

      {/* Main Content: Split View */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left: Listings Grid */}
          <div className="w-full lg:w-1/2 overflow-y-auto h-[calc(100vh-200px)] no-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-gray-500">Finding best properties...</p>
              </div>
            ) : (
              <Listing listings={listings} />
            )}
          </div>

          {/* Right: Map (Sticky) */}
          <div className="hidden lg:block lg:w-1/2">
            <div className="sticky top-24 h-[calc(100vh-150px)]">
              <MapContainer 
                center={mapCenter}
                listings={listings}
              />
            </div>
          </div>
          
        </div>
      </div>                        
    </div>
  )
}

export default ListingMapview