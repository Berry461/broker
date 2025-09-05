'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Listing from './Listing'
import GoogleAddressSearch from './GoogleAddressSearch'
import { Button } from './ui/button'
import { Filter, Search } from 'lucide-react'
import FilterSection from './FilterSection'
import dynamic from 'next/dynamic'

const supabase = createClient()

interface Listing {
    id: string
    title?: string
    price?: number
    address: string
    bedroom?: number
    bathroom?: number
    area?: string
    active: boolean
    type: string
    listingimages?: { url: string; listing_id: string }[]
}

interface ListingMapviewProps {
    type: string
}

// Dynamic import with SSR disabled for map component
const MapContainer = dynamic(
    () => import('./MapContainer'),
    {
        ssr: false,
        loading: () => (
            <div className="hidden md:block w-full lg:w-1/2 xl:w-1/2">
                <div className="h-[calc(100vh-2rem)] bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500">Loading map...</p>
                </div>
            </div>
        )
    }
)

const DynamicGoogleAddressSearch = dynamic(
    () => import('./GoogleAddressSearch'),
    {
        ssr: false,
        loading: () => (
            <input
                placeholder="Loading address search..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
        )
    }
)

function ListingMapview({ type }: ListingMapviewProps) {
    const [listings, setListings] = useState<Listing[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchedAddress, setSearchedAddress] = useState('')
    const [filters, setFilters] = useState({
        bedCount: '',
        bathCount: '',
        parkingCount: '',
        homeType: 'All'
    })
    const [mapCenter, setMapCenter] = useState({
        lat: -3.745,  // Default coordinates
        lng: -38.523
    });

    const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }))
    }

    const fetchListings = async () => {
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
                if (!isNaN(bedMin)) {
                    query = query.gte('bedroom', bedMin.toString())
                }
            }

            if (filters.bathCount) {
                const bathMin = parseInt(filters.bathCount)
                if (!isNaN(bathMin)) {
                    query = query.gte('bathroom', bathMin.toString())
                }
            }

            if (filters.parkingCount) {
                const parkMin = parseInt(filters.parkingCount)
                if (!isNaN(parkMin)) {
                    query = query.gte('parking', parkMin.toString())
                }
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
    }

    useEffect(() => {
        fetchListings()
    }, [type])

    const handleSearch = async () => {
        await fetchListings()
    }

    return (
        <div>
            <div className="p-3 flex flex-col gap-6 sm:flex-row sm:flex-wrap">
                <DynamicGoogleAddressSearch
                    selectedAddress={(value: string | null) => setSearchQuery(value ?? '')}
                    setCoordinates={(coords) => {
                        console.log('New coordinates:', coords);
                        setMapCenter(coords); // Update the map center state
                    }}
                />

                <FilterSection
                    onBedChange={(value) => handleFilterChange('bedCount', value)}
                    onBathChange={(value) => handleFilterChange('bathCount', value)}
                    onParkingChange={(value) => handleFilterChange('parkingCount', value)}
                    onHomeTypeChange={(value) => handleFilterChange('homeType', value)}
                />

                <Button className="flex gap-2 self-start" onClick={handleSearch}>
                    <Search className="h-4 w-4" />
                    Search
                </Button>
            </div>

            {searchedAddress && (
                <div className="container mx-auto px-4 pt-4">
                    <h2 className="text-lg font-semibold">
                        Showing results for: <span className="text-blue-600">{searchedAddress}</span>
                    </h2>
                    {listings.length === 0 && !loading && (
                        <p className="text-gray-500 mt-2">No properties found matching this address</p>
                    )}
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Listings Column - Takes full width on mobile, 1/2 on lg screens, and 1/2 on xl */}
                    <div className="w-full lg:w-1/2 xl:w-1/2">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <p>Loading listings...</p>
                            </div>
                        ) : (
                            <Listing listings={listings} />
                        )}
                    </div>

                    {/* Map Column - Hidden on mobile, takes 1/2 width on lg and xl screens */}
                    <div className="hidden lg:block lg:w-1/2 xl:w-1/2">
                        <div className="sticky top-4 h-[calc(100vh-2rem)]">
                            <MapContainer center={mapCenter} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingMapview