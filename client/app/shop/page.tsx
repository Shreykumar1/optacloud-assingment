"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, MapPin } from "lucide-react";
import {  products } from "../utils/productImages";
import { getCurrentAddress } from "../utils/apis";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import getToken from "../utils/getToken";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Loading from '../utils/Loading'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store'; // Adjust the import path as necessary
import AddressSelector from "./AddressSelector"; 

interface Address {
  data: string;
}

export default function Home() {
  const [loadingPage, setLoadingPage] = useState(true);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  const router = useRouter();
  const user : any= useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        router.push("/login");
      } else {
        setLoadingPage(false);
      }
    } else router.push("/login");
  }, []);

  const { data, error } = useQuery<{ currentAddress: Address }>({
    queryKey: ["address"],
    queryFn: getCurrentAddress,
  });

  useEffect(() => {
    if (error) {
      setShowLocationPopup(true);
      console.error("Error fetching address:", error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setShowLocationPopup(false);
    }
  }, [data]);

  useEffect(() => {
  }, [user]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {loadingPage && <Loading />}
      <header className="bg-purple-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Opta Shop</h1>
          <nav>
            <ul className="flex space-x-6 items-center">
            <li>
                <span className="text-white p-2 border border-white rounded-full">
                    Hello, {user ? user.data.user.name : 'Guest'}
                </span>
              </li>
              <li>
                <Link
                  href="/addresses"
                  className="hover:text-purple-300 flex items-center"
                >
                  <MapPin className="mr-1 h-4 w-4" /> Addresses
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="relative h-[400px] overflow-hidden rounded-lg">
            <img
              src={'/images/hero-banner.png'}
              alt={`Hero Banner`}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 text-white">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[22rem] object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">{product.name}</h3>
                  <p className="text-purple-600 font-bold mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-purple-600 text-white py-4 mt-12 border-t border-purple-300">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Opta Shop. All rights reserved.</p>
        </div>
      </footer>
      {showLocationPopup && (
        <AddressSelector addLocation={false}/>
      )}
    </div>
  );
}
