import React, { useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import logo from "../assets/logo.png";
import { Button } from "./ui/Button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { clearCart } from "@/redux/productSlice";
import { jwtDecode } from "jwt-decode";
import { persistor } from "@/redux/store";
import axios from "../axiosWithJwt";
import { setCart } from "@/redux/productSlice";
import DashBoard from "@/pages/DashBoard";

export default function Navbar() {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product) || { cart: { items: [] } };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //If User is Admin Then Show the DashBoard
  const admin = user?.role === 'ADMIN' ? true : false

  // ✅ Logout
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      dispatch(setUser(null));
      dispatch(clearCart());
      await persistor.purge();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  // ✅ Decode token
  const decodedUser = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, [user]);

  // ✅ Fetch cart after login/app load
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("/cart/cartDetails");
        dispatch(setCart(res.data.cart));
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCart();
  }, [user, dispatch]);

  return (
    <header className="fixed w-full z-20 border-b bg-[#0474C4]" >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="eCommerce Logo" className="w-32 h-15 object-contain" />
        </Link>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-6">
          <ul className="flex gap-6 items-center text-lg font-semibold text-[#FEFFFF]">
            <li><Link to="/" className="hover:text-pink-500">Home</Link></li>
            <li><Link to="/products" className="hover:text-pink-500">Products</Link></li>
            {user && decodedUser?.id && (
              <li>
                <Link to={`/profile/${decodedUser.id}`} className="hover:text-pink-500">
                  Hello {user.username}
                </Link>
              </li>
            )}

            {admin && decodedUser?.id && (
              <li>
                <Link to={`/dashboard`} className="hover:text-pink-500">
                  DashBoard
                </Link>
              </li>
            )}
          </ul>

          {/* CART ICON */}
          <Link to="/cart" className="relative ml-4">
            <ShoppingCart className="w-7 h-7 text-gray-800 hover:text-pink-500" />
            <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs rounded-full px-2">
              {cart?.items?.length || 0}
            </span>
          </Link>

          {/* LOGIN / LOGOUT */}
          {user ? (
            <Button onClick={handleLogout} className="bg-white text-black hover:text-white ml-3">
              Logout
            </Button>
          ) : (
            <Button className="ml-3">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
