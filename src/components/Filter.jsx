import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export default function Filter({
  allProduct = [],
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  priceRange,
  setPriceRange,
}) {
  const categories = ["All", ...new Set(allProduct.map(p => p.category).filter(Boolean))]
  const brands = ["All", ...new Set(allProduct.map(p => p.brand).filter(Boolean))]

  const [minInput, setMinInput] = useState(priceRange[0])
  const [maxInput, setMaxInput] = useState(priceRange[1])

  useEffect(() => {
    setMinInput(priceRange[0])
    setMaxInput(priceRange[1])
  }, [priceRange])

  return (
    <div className="bg-gray-100 p-4 rounded-md w-64 hidden md:block h-max">

      {/* SEARCH */}
      <Input
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="bg-white mb-4"
      />

      {/* CATEGORY */}
      <h2 className="font-semibold mb-2">Category</h2>
      {categories.map((c, i) => (
        <label key={i} className="flex gap-2 items-center mb-1">
          <input
            type="radio"
            name="category"
            checked={category === c}
            onChange={() => setCategory(c)}
          />
          {c}
        </label>
      ))}

      {/* BRAND */}
      <h2 className="font-semibold mt-4 mb-2">Brand</h2>
      <select
        value={brand}
        onChange={e => setBrand(e.target.value)}
        className="w-full p-2 border rounded bg-white"
      >
        {brands.map((b, i) => (
          <option key={i} value={b}>{b}</option>
        ))}
      </select>

      {/* PRICE BOXES */}
      <h2 className="font-semibold mt-4 mb-2">Price Range</h2>
      <div className="flex gap-2 mb-3">
        <input
          type="number"
          placeholder="Min"
          value={minInput}
          onChange={e => setMinInput(e.target.value)}
          onBlur={() => {
            const value = Math.max(0, Math.min(5000, Number(minInput) || 0))
            setPriceRange([value, priceRange[1]])
          }}
          className="w-20 p-1 border rounded"
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Max"
          value={maxInput}
          onChange={e => setMaxInput(e.target.value)}
          onBlur={() => {
            const value = Math.max(priceRange[0], Math.min(999999, Number(maxInput) || 999999))
            setPriceRange([priceRange[0], value])
          }}
          className="w-24 p-1 border rounded"
        />
      </div>

      {/* LOW PRICE SLIDER */}
      <p className="text-sm mb-1">Min Price</p>
      <input
        type="range"
        min={0}
        max={5000}
        step={50}
        value={priceRange[0]}
        onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
        className="w-full mb-3"
      />

      {/* HIGH PRICE SLIDER */}
      <p className="text-sm mb-1">Max Price</p>
      <input
        type="range"
        min={0}
        max={999999}
        step={100}
        value={priceRange[1]}
        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
        className="w-full mb-2"
      />

      <p className="text-sm text-gray-600 mb-4">
        ₹{priceRange[0]} – ₹{priceRange[1]}
      </p>

      {/* RESET */}
      <Button
        className="bg-pink-600 text-white w-full"
        onClick={() => {
          setSearch("")
          setCategory("All")
          setBrand("All")
          setPriceRange([0, 999999])
        }}
      >
        Reset Filters
      </Button>
    </div>
  )
}
