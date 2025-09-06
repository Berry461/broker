"use client"
import React from 'react'
import { MapPin } from 'lucide-react'
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete'

interface Coordinates {
    lat: number;
    lng: number;
}

interface GoogleAddressSearchProps {
    selectedAddress: (value: string | null) => void;
    setCoordinates: (value: Coordinates) => void;
}

interface PlaceResult {
    label: string;
    value: {
        place_id: string;
        // Add other properties you expect from the place object
    };
}

const GoogleAddressSearch = ({ selectedAddress, setCoordinates }: GoogleAddressSearchProps) => {
    const handlePlaceSelect = async (place: PlaceResult | null) => {
        try {
            if (!place) {
                selectedAddress(null);
                setCoordinates({ lat: 0, lng: 0 });
                return;
            }

            // Enhanced logging of the place object
            console.group('Google Places Selection');
            console.log('Full Place Object:', place);
            console.log('Place Label:', place.label);
            console.log('Place Value:', place.value);
            console.groupEnd();

            selectedAddress(place.label);

            if (place.value?.place_id) {
                const results = await geocodeByAddress(place.label);

                // Enhanced logging of geocode results
                console.group('Geocode Results');
                console.log('Full Geocode Results:', results);
                console.log('Primary Result:', results[0]);
                console.groupEnd();

                const { lat, lng } = await getLatLng(results[0]);
                setCoordinates({ lat, lng });

                // Log coordinates with prototype
                const coordObj = { lat, lng };
                console.log('Coordinates with Prototype:', coordObj);
            }
        } catch (error) {
            console.error('Error geocoding address:', error);
            selectedAddress(null);
            setCoordinates({ lat: 0, lng: 0 });
        }
    };

    return (
        <div className="flex items-center w-full">
            <MapPin className='h-10 w-10 p-2 rounded-l-lg text-indigo-600 bg-purple-200' />
            <GooglePlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
                selectProps={{
                    placeholder: 'Enter Property Address',
                    isClearable: true,
                    className: 'w-full',
                    onChange: handlePlaceSelect,
                    instanceId: "google-address-search",
                    styles: {
                        control: (provided) => ({
                            ...provided,
                            border: 'none',
                            boxShadow: 'none',
                            borderRadius: '0 0.5rem 0.5rem 0',
                            height: '44px'
                        }),
                        input: (provided) => ({
                            ...provided,
                            /*padding: '0.5rem',*/
                        }),
                    },
                }}
                autocompletionRequest={{

                }}
            />
        </div>
    );
};

export default GoogleAddressSearch;

