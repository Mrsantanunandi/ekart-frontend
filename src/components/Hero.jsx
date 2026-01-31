import React from 'react'
import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png' // optional image

export default function Hero() {
  return (
    <section className="pt-22.5 bg-[#A8C4EC] text-white min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#06457F] leading-tight">
            Discover the Best Products <br />
            <span className="text-[#262B40]">For Your Lifestyle</span>
          </h1>

          <p className="text-gray-600 text-lg">
            Shop the latest trends with unbeatable prices.  
            Fast delivery • Secure payment • Easy returns.
          </p>

          <div className="flex gap-4">
            <Link
              to="/products"
              className="bg-[#262B40] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#0474C4] transition"
            >
              Shop Now
            </Link>

            <Link
              to="/categories"
              className="border-2 border-[#262B40] text-[#262B40] px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#0474C4] hover:text-white transition"
            >
              Explore
            </Link>
          </div>

          {/* FEATURES */}
          <div className="flex gap-6 pt-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">10k+</h3>
              <p className="text-gray-500 text-sm">Products</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800">5k+</h3>
              <p className="text-gray-500 text-sm">Happy Customers</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800">24/7</h3>
              <p className="text-gray-500 text-sm">Support</p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <img
            src={heroImg}
            alt="Shopping"
            className="w-full max-w-md"
          />
        </div>

      </div>
    </section>
  )
}
