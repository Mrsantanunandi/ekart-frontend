import React, { useEffect, useMemo, useState } from "react";
import axios from "../axiosWithJwt";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "@/redux/productSlice";
import Filter from "@/components/Filter";
import ProductCard from "@/components/ProductCard";

export default function Products() {
  const dispatch = useDispatch();
  const { products } = useSelector(store => store.product);
  const [loading, setLoading] = useState(false);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [sort, setSort] = useState("");

  // 🔹 FETCH PRODUCTS ONCE
  useEffect(() => {
    if (products.length > 0) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "/product/allProducts"
        );
        dispatch(setProduct(res.data.data || [])); // ✅ STORE IN REDUX
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch]);

  // 🔹 FILTER LOGIC
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        p =>
          p.productName?.toLowerCase().includes(s) ||
          p.category?.toLowerCase().includes(s)
      );
    }

    if (category !== "All") list = list.filter(p => p.category === category);
    if (brand !== "All") list = list.filter(p => p.brand === brand);

    list = list.filter(p => {
      const price = Number(p.productPrice);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (sort === "lowToHigh")
      list.sort((a, b) => a.productPrice - b.productPrice);
    if (sort === "highToLow")
      list.sort((a, b) => b.productPrice - a.productPrice);

    return list;
  }, [products, search, category, brand, priceRange, sort]);

  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto flex gap-10">
        <Filter
          allProduct={products}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        <div className="flex-1">
          {loading && <p>Loading products...</p>}

          {!loading && filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No products found 😢
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
