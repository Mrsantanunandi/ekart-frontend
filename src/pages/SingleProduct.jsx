import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../axiosWithJwt";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState("");

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/product/${id}`);
        setProduct(res.data.data);
        setSelectedImg(res.data.data.productImg?.[0]?.url);
      } catch (err) {
        console.error(err);
        toast.error("Product not found");
      }
    };
    fetchProduct();
  }, [id]);

  // Add to cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      // Add product to cart
      const res = await axios.post(
        `/cart/add/${product.id}?qty=${quantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Added to cart");

        // Fetch updated cart safely
        try {
          const cartRes = await axios.get(
            "/cart/cartDetails",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          dispatch(setCart(cartRes.data.cart));
        } catch (cartErr) {
          console.error("Failed to fetch cart:", cartErr);
          if (cartErr.response?.status === 403) {
            toast.error("Session expired. Please login again.");
            localStorage.removeItem("token");
            navigate("/login");
          } else {
            toast.error("Failed to fetch cart");
          }
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Something went wrong while adding to cart");
      }
    }
  };

  if (!product) {
    return (
      <div className="pt-32 text-center text-xl font-semibold">
        ❌ Product not found
      </div>
    );
  }

  return (
    <div className="pt-20 px-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:underline">Home</Link> /{" "}
        <Link to="/products" className="hover:underline">Products</Link> /{" "}
        <span className="font-semibold text-black">{product.productName}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left images */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {product.productImg?.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                onClick={() => setSelectedImg(img.url)}
                className={`w-20 h-20 object-cover rounded cursor-pointer shadow-lg border ${
                  selectedImg === img.url ? "border-black" : "border-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex-1">
            <img
              src={selectedImg}
              className="w-full max-h-[450px] object-contain shadow-2xl rounded-lg"
            />
          </div>
        </div>

        {/* Right details */}
        <div className="space-y-6 p-5">
          <h1 className="text-3xl font-bold">{product.productName}</h1>
          <p className="text-2xl font-bold text-green-600">₹{product.productPrice}</p>
          <p className="text-gray-600 leading-relaxed">{product.productDesc}</p>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>−</Button>
            <span className="text-lg font-semibold">{quantity}</span>
            <Button variant="outline" onClick={() => setQuantity(quantity + 1)}>+</Button>
          </div>

          <Button
            className="bg-pink-600 mb-5 w-max p-5 cursor-pointer"
            onClick={handleAddToCart}
          >
            🛒 Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
