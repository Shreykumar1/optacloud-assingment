import { Button } from "@/components/ui/button";
import {  Footprints } from "lucide-react";
import Link from "next/link";

export default function SimpleLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Footprints className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">Opta Shop</span>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Discover Our Shoe Shop
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Your ultimate destination for stylish and comfortable footwear. Enjoy swift delivery, a wide variety, and unbeatable prices.
        </p>
        <div className="mt-5 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-8 md:max-w-3xl">
          <h2 className="text-3xl font-semibold text-white">Why Choose Our Shoe Shop?</h2>
          <ul className="list-disc list-inside mt-3">
            <li>Extensive selection of shoes for every occasion</li>
            <li>Exceptional customer service</li>
            <li>Secure and easy checkout process</li>
          </ul>
        </div>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link href="/shop">
              <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="text-center text-sm text-gray-400">
          © 2024 Opta Shop. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
