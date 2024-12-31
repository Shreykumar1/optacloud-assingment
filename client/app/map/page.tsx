// pages/map.js
'use client'
import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
  height: "400px",
  width: "800px"
};

const center = {
  lat: -3.745, // Replace with your desired latitude
  lng: -38.523 // Replace with your desired longitude
};

const Map = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY as string}>   
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      >
        {/* Additional components like markers can go here */}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;