"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, MapPin, ChevronRight } from "lucide-react";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface MapBoxMapProps {
  onClose: () => void;
  coordinates: [number, number];
  onProceed: (coords: [number, number], address: string) => void;
}

export default function MapBoxMap({
  onClose,
  coordinates,
  onProceed,
}: MapBoxMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLng | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const onLoad = () => {
    setMapLoaded(true);
  };

  useEffect(() => {
    if (mapLoaded) {
      setMarkerPosition(new google.maps.LatLng(coordinates[1], coordinates[0]));
    }
  }, [coordinates, mapLoaded]);

  const updateSelectedLocation = async (coords: [number, number]) => {
    setSelectedCoordinates(coords);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords[1]},${coords[0]}&key=${googleMapsApiKey}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      setSelectedAddress(data.results[0].formatted_address);
    }
  };

  // const handleSearchQueryChange = async (query: string) => {
  //   setSearchQuery(query);
  //   if (query) {
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //         query
  //       )}&key=${googleMapsApiKey}`
  //     );
  //     const data = await response.json();
  //     setSuggestions(data.results || []);
  //   } else {
  //     setSuggestions([]);
  //   }
  // };

  const handleSearchQueryChange = async (query: string) => {
    setSearchQuery(query);
    if (query) {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", India")}`
        );
        const data = await response.json();
        
        // Set suggestions based on the response data
        const formattedSuggestions = data.map((location: any) => ({
            formatted_address: location.display_name,
            geometry: {
                location: {
                    lat: parseFloat(location.lat),
                    lng: parseFloat(location.lon),
                },
            },
        }));

        setSuggestions(formattedSuggestions);
    } else {
        setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (location: any) => {
    
    const { geometry } = location;
    const {lng, lat} = geometry.location;
    setSearchQuery(location.formatted_address);
    setSuggestions([]);
    setMarkerPosition(new google.maps.LatLng(lat, lng));
    updateSelectedLocation([lng, lat]);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition(new google.maps.LatLng(latitude, longitude));
          updateSelectedLocation([longitude, latitude]);
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleProceed = () => {
    if (selectedCoordinates) {
      onProceed(selectedCoordinates, selectedAddress);
    }
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        onLoad={onLoad}
        center={{ lat: coordinates[1], lng: coordinates[0] }}
        zoom={6}
        mapContainerClassName="w-full h-full"
      >
        {markerPosition && (
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={(e) => {
              if (e.latLng) {
                updateSelectedLocation([e.latLng.lng(), e.latLng.lat()]);
              }
            }}
          />
        )}
      </GoogleMap>
      <div className="absolute top-4 left-4 right-16 z-10 flex flex-col space-y-2">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            placeholder="Search location..."
            className="flex-grow"
          />
          <Button
            onClick={() => handleSearchQueryChange(searchQuery)}
            variant="outline"
            className="bg-white hover:bg-gray-100"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        {suggestions.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.formatted_address}
              </div>
            ))}
          </div>
        )}
      </div>
      <Button
        onClick={onClose}
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100"
      >
        <X className="h-4 w-4" />
      </Button>
      <Button
        onClick={handleProceed}
        variant="outline"
        size="icon"
        className={`absolute ${
          selectedAddress ? "bottom-[12rem]" : "bottom-28"
        } right-4 z-10 bg-purple-500 hover:bg-purple-600 border-none w-[8rem] text-white`}
      >
        Proceed
      </Button>
      <Button
        onClick={handleLocateMe}
        variant="outline"
        size="icon"
        className={`absolute ${
          selectedAddress ? "bottom-[10rem]" : "bottom-14"
        } right-4 z-10 bg-purple-500 hover:bg-purple-600 border-none w-[8rem] text-white`}
        aria-label="Locate Me"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="29"
          height="29"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-locate-fixed text-white"
        >
          <line x1="2" x2="5" y1="12" y2="12" />
          <line x1="19" x2="22" y1="12" y2="12" />
          <line x1="12" x2="12" y1="2" y2="5" />
          <line x1="12" x2="12" y1="19" y2="22" />
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Locate Me
      </Button>

      {selectedAddress && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
          <div className="flex items-start mb-2">
            <MapPin className="w-5 h-5 mr-2 mt-1 text-red-500" />
            <div>
              <h3 className="font-semibold">Selected Location</h3>
              <p className="text-sm text-gray-600">{selectedAddress}</p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedAddress("");
                setSelectedCoordinates(null);
              }}
            >
              Change
            </Button>
            <Button onClick={handleProceed}>
              Proceed
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </LoadScript>
  );
}
