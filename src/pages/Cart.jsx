import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { useNavigate } from "react-router-dom";
import axios from "../axiosWithJwt";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";

export default function Cart() {
  const { cart } = useSelector((store) => store.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= UPDATE QUANTITY ================= */
  const handleUpdateQuantity = async (cartItemId, type) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_URL}/cart/update-quantity/${cartItemId}/${type}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Quantity updated");

        const res1 = await axios.get(
          `${import.meta.env.VITE_URL}/cart/cartDetails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(setCart(res1.data.cart));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quantity");
    }
  };

  /* ================= REMOVE ITEM ================= */
  const handleRemoveItem = async (cartItemId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_URL}/cart/remove/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Item removed");

        const res1 = await axios.get(
          `${import.meta.env.VITE_URL}/cart/cartDetails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(setCart(res1.data.cart));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  /* ================= CALCULATIONS ================= */
  const items = cart?.items || [];
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 399 ? 0 : 40;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  /* ================= UI ================= */
  return (
    <div className="pt-20 bg-amber-200 min-h-screen">
      {items.length > 0 ? (
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Shopping Cart
          </h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* CART ITEMS */}
            <div className="flex flex-col gap-4 flex-1">
              {items.map((item) => (
                <Card key={item.id} className="py-2">
                  <CardContent className="p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* LEFT */}
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product?.productImg?.[0]?.url || ""}
                          alt={item.product?.productName}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                        />
                        <div>
                          <h1 className="font-semibold text-sm sm:text-base truncate max-w-[220px] sm:max-w-[280px]">
                            {item.product?.productName}
                          </h1>
                          <p className="text-sm text-gray-600">
                            ₹{item.productPrice}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(item.id, false)
                          }
                        >
                          -
                        </Button>

                        <span className="font-medium">{item.quantity}</span>

                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(item.id, true)
                          }
                        >
                          +
                        </Button>

                        <span className="font-semibold">
                          ₹{item.subTotal}
                        </span>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* SUMMARY */}
            <Card className="w-full lg:w-[380px] h-fit">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <Button className="w-full" onClick={()=>{navigate('/address')}}>Place Order</Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center text-xl mt-40">
          No Cart Items.
        </div>
      )}
    </div>
  );
}
