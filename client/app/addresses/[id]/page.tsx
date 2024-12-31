"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "@googlemaps/js-api-loader";
import { useRouter, useParams, notFound } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, MapPin, Search, Star } from "lucide-react";
import { getAddressDetails, updateAddress, deleteAddress } from "../../utils/apis";
import Loading from "../../utils/Loading";
import Notification from "@/app/utils/notification";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  version: "weekly",
});

interface AddressDetailsData {
  addressDetails: {
    address: string;
    houseDetails: string;
    street: string;
    addressType: string;
    coordinates: [number, number];
    favorite: boolean;
  };
}

interface UpdateAddressData {
  address: string;
  houseDetails: string;
  street: string;
  addressType: string;
  coordinates: [number, number] | null;
  favorite: boolean;
}

export default function AddressDetails() {
  const [address, setAddress] = useState("");
  const [houseDetails, setHouseDetails] = useState("");
  const [street, setStreet] = useState("");
  const [addressType, setAddressType] = useState("home");
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [favorite, setIsFavorite] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState<React.ReactNode | undefined>(
    undefined
  );
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const queryClient = useQueryClient();

  const { data, status } = useQuery<{ data: AddressDetailsData }>({
    queryKey: ["addressDetails", id],
    queryFn: () => getAddressDetails(id),
  });

  useEffect(() => {
    if (data?.data?.addressDetails) {
      const details = data.data.addressDetails;
      setAddress(details.address);
      setHouseDetails(details.houseDetails);
      setStreet(details.street);
      setAddressType(details.addressType);
      setCoordinates(details.coordinates);
      setIsFavorite(details.favorite);
    }
  }, [data]);
  

  const mutation = useMutation({
    mutationFn: (newData: UpdateAddressData) => updateAddress(id, newData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addressDetails", id as string],
      });
      setNotification(
        <Notification status="success" message="address updated successfully" />
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addressDetails", id] });
      setNotification(
        <Notification status="success" message="Address deleted successfully" />
      );
      setTimeout(() => {
        router.push("/addresses");
      }, 5000);
    },
    onError: () => {
      setNotification(
        <Notification status="error" message="Failed to delete address" />
      );
    },
  });

  const handleAddressDelete = () => {
    deleteMutation.mutate();
  };

  const handleMapSearch = (query: string) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        query
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (isTyping) {
          setSuggestions(data.results);
        }
      });
  };

  const handleSuggestionClick = (suggestion: any) => {
    const coordinates = suggestion.geometry.location;
    setCoordinates([coordinates.lng(), coordinates.lat()]);
    setAddress(suggestion.formatted_address);
    mapRef.current?.setCenter(coordinates);
    markerRef.current?.setPosition(coordinates);
    setSuggestions([]);
    setIsTyping(false);
  };

  useEffect(() => {
    loader.load().then(() => {
      if (mapContainerRef.current && coordinates) {
        const map = new google.maps.Map(mapContainerRef.current, {
          center: { lat: coordinates[1], lng: coordinates[0] },
          zoom: 12,
        });

        const marker = new google.maps.Marker({
          position: { lat: coordinates[1], lng: coordinates[0] },
          map: map,
          draggable: true,
        });

        marker.addListener("dragend", (event: { latLng: { toJSON: () => { lat: any; lng: any; }; }; }) => {
          const { lat, lng } = event.latLng.toJSON();
          setCoordinates([lng, lat]);
          handleMapSearch(`${lng},${lat}`);
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results.length > 0) {
                setAddress(data.results[0].formatted_address);
              }
            });
        });

        map.addListener("click", (event: { latLng: { toJSON: () => { lat: any; lng: any; }; }; }) => {
          const { lat, lng } = event.latLng.toJSON();
          setCoordinates([lng, lat]);
          marker.setPosition({ lat, lng });
          setSuggestions([]);
          setIsTyping(false);
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results.length > 0) {
                setAddress(data.results[0].formatted_address);
              }
            });
        });
      }
    });
  }, [coordinates]);

  const handleAddressUpdate = () => {
    mutation.mutate({
      address,
      houseDetails,
      street,
      addressType,
      coordinates,
      favorite,
    });
    setNotification(
      <Notification status="success" message="address updated successfully" />
    );
    setTimeout(() => {
      router.push("/addresses");
    }, 5000);
  };

  const toggleFavorite = () => setIsFavorite(!favorite);

  if (status === "pending") return <Loading />;
  if (status === "error") notFound();

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900">
      {notification}
      <Card className="w-full max-w-4xl mx-auto bg-gray-800 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-purple-600 flex items-center">
            <button
                onClick={() => router.push("/addresses")}
                className="rounded-full p-2 mr-2 text-white hover:bg-purple-500 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-6 w-6 " />
              </button>
              Address Details
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAddress(e.target.value);
                  setIsTyping(true);
                  handleMapSearch(e.target.value);
                }}
                placeholder="Search for an address"
                className="flex-grow"
              />
              <Button
                onClick={() => handleMapSearch(address)}
                variant="outline"
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                <Search className="w-4 h-4 mr-2" /> Search
              </Button>  
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-56 overflow-auto">
                {suggestions.map((suggestion: any) => (
                  <li
                    key={suggestion.place_id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.formatted_address}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            ref={mapContainerRef}
            className="w-full h-80 rounded-lg overflow-hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={street}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStreet(e.target.value)
              }
              placeholder="Street name"
              className="flex-grow"
            />
            <Select
              value={addressType}
              onValueChange={(value: string) => setAddressType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Address type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            type="text"
            value={houseDetails}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setHouseDetails(e.target.value)
            }
            placeholder="House details (e.g. flat, apartment)"
            className="flex-grow"
          />
        </CardContent>
        <CardFooter className="flex justify-between gap-5 flex-col md:flex-row">
          <Button
            onClick={toggleFavorite}
            variant={favorite ? "default" : "outline"}
            className={`flex items-center ${
              favorite ? "bg-yellow-500 hover:bg-yellow-400" : ""
            }`}
          >
            <Star
              className={`w-4 h-4 mr-2 ${favorite ? "fill-current" : ""}`}
            />
            {favorite ? "Favorite" : "Add to Favorites"}
          </Button>
          <div className="flex justify-between mt-13 gap-10">
          <Button
            onClick={handleAddressDelete}
            variant="outline"
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete Address
          </Button>
          <Button
            onClick={handleAddressUpdate}
            className="bg-gray-900 text-white hover:bg-green-700"
          >
            Update Address
          </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
