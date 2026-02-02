import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import {
  addAddresses,
  deletedAddress,
  setSelectedAddress,
  clearCart,
} from "@/redux/productSlice";
import { Trash2 } from "lucide-react";
import axios from "../axiosWithJwt";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const dispatch = useDispatch();

  // ✅ Ensure addresses is always an array
  const { addresses = [], selectedAddress = null, cart = { items: [], totalPrice: 0 } } =
    useSelector((store) => store.product);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [showForm, setShowForm] = useState(!addresses.length);

  // ===== Update showForm if addresses change =====
  useEffect(() => {
    setShowForm(addresses.length === 0);
  }, [addresses]);

  // ===== ORDER CALCULATION =====
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 399 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error("Please fill at least Name, Phone, and Address");
      return;
    }

    dispatch(addAddresses(formData));
    setShowForm(false);

    setFormData({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
  };

  const navigate=useNavigate()
  // ===== RAZORPAY =====
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    if (!cart?.items?.length) {
      toast.error("Your cart is empty!");
      return;
    }


    if (selectedAddress === null || !addresses[selectedAddress]) {
      toast.error("Please select a valid address");
      return;
    }

    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    try {
      // 🔹 CREATE ORDER
      const orderRes = await axios.post(
        "/payment/create-order",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );


      const razorpayOrder = orderRes.data.order;
      if (
        !razorpayOrder ||
        !razorpayOrder.id ||
        !razorpayOrder.amount ||
        !razorpayOrder.currency
      ) {
        toast.error("Invalid Razorpay order response");
        return;
      }
      //console.log("RazorpayOrder", razorpayOrder)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "EKART",
        description: "Order Payment",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            // 🔹 VERIFY PAYMENT
            const verifyRes = await axios.post(
              "/payment/verify",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.status === 200) {
              toast.success("Payment successful 🎉");
              dispatch(clearCart());
              navigate('/orders')
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: addresses[selectedAddress].fullName || "",
          email: addresses[selectedAddress].email || "",
          contact: addresses[selectedAddress].phone || "",
        },

        theme: { color: "#ec4899" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        toast.error(response?.error?.description || "Payment failed");
      });

      rzp.open();
    } catch (error) {
      toast.error("Unable to initiate payment");
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-2 gap-20 p-10">
      {/* ================= LEFT SIDE ================= */}
      <div className="space-y-4 p-6 bg-white rounded-lg shadow">
        {showForm ? (
          <>
            <div>
              <Label>Full Name</Label>
              <Input name="fullName"  placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} />
            </div>

            <div>
              <Label>Phone</Label>
              <Input name="phone" value={formData.phone} placeholder="10-digit mobile number" onChange={handleChange} />
            </div>

            <div>
              <Label>Email</Label>
              <Input name="email" value={formData.email} placeholder="example@email.com" onChange={handleChange} />
            </div>

            <div>
              <Label>Address</Label>
              <Input name="address" value={formData.address} placeholder="House no, Street, Area" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Label>City</Label>
              <Input name="city" value={formData.city} placeholder="City" onChange={handleChange} />
              <Label>State</Label>
              <Input name="state" value={formData.state} placeholder="State" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Label>PinCode</Label>
              <Input name="zipCode" value={formData.zipCode} placeholder="6-digit PIN code" onChange={handleChange} />
              <Label>Country</Label>
              <Input name="country" value={formData.country} placeholder="India" onChange={handleChange} />
            </div>

            <Button onClick={handleSave} className="w-full bg-blue-900">
              Save & Continue
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Saved Addresses</h2>

            {Array.isArray(addresses) &&
              addresses.map((addr, index) => (
                <div
                  key={index}
                  className={`border p-4 rounded-md ${selectedAddress === index ? "border-pink-600 bg-pink-50" : "border-gray-300"
                    }`}
                >
                  <p className="font-medium">{addr.fullName}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.email}</p>
                  <p>
                    {addr.address}, {addr.city}, {addr.state}, {addr.zipCode}, {addr.country}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => dispatch(setSelectedAddress(index))}>
                      Select
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500"
                      onClick={() => dispatch(deletedAddress(index))}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}

            <Button variant="outline" onClick={() => setShowForm(true)}>
              + Add New Address
            </Button>

            <Button
              disabled={selectedAddress === null || !cart?.items?.length}
              onClick={handlePayment}
              className="bg-pink-700"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <Card className="w-[400px] h-fit">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal ({cart?.items?.length || 0} items)</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax (5%)</span>
            <span>₹{tax}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Address;
