import { ShoppingCart } from "lucide-react"
import { Button } from "./ui/Button"
import { Skeleton } from "./ui/skeleton"
import axios from "../axiosWithJwt";
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setCart } from "@/redux/productSlice"
import { useNavigate } from "react-router-dom"

export default function ProductCard({ product, loading }) {
    const { productImg, productName, productPrice, id } = product || {}
    const token = localStorage.getItem("token")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const addToCart = async (productId) => {
        try {
            const headers = token
                ? { Authorization: `Bearer ${token}` }
                : {}

            const res = await axios.post(
                `${import.meta.env.VITE_URL}/cart/add/${productId}`,
                {},
                { headers }
            )

            if (res.data?.success) {
                toast.success("Product added to Cart")

                const res1 = await axios.get(
                    `${import.meta.env.VITE_URL}/cart/cartDetails`,
                    { headers }
                )

                dispatch(setCart(res1.data.cart))
            }

        } catch (error) {
            console.error(error)

            // ✅ redirect ONLY when user is not logged in
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                toast.error("Please login first")
                navigate("/login")
            } else {
                toast.error("Something went wrong")
            }
        }
    }

    return (
        <div className="w-48 shadow-lg rounded-lg overflow-hidden h-max">

            {/* IMAGE */}
            <div className="w-full h-44 overflow-hidden rounded-t-lg">
                {loading ? (
                    <Skeleton className="w-full h-44 rounded-t-lg" />
                ) : (
                    <img
                        onClick={() => navigate(`/products/${id}`)}
                        src={productImg?.[0]?.url}
                        alt={productName}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                    />
                )}
            </div>

            {/* PRODUCT INFO */}
            {loading ? (
                <div className="px-2 space-y-2 my-2">
                    <Skeleton className="w-50 h-4" />
                    <Skeleton className="w-25 h-4" />
                    <Skeleton className="w-37.5 h-8" />
                </div>
            ) : (
                <div className="px-2 space-y-1">
                    <h1 className="font-semibold h-12 line-clamp-2">
                        {productName}
                    </h1>
                    <h2 className="font-bold">₹{productPrice}</h2>
                    <Button
                        className="bg-pink-600 mb-3 w-full cursor-pointer"
                        onClick={() => addToCart(id)}
                    >
                        <ShoppingCart className="mr-2" />
                        Add to Cart
                    </Button>
                </div>
            )}
        </div>
    )
}
