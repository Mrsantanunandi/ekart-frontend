import React from 'react'
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrderCard({userOrder}) {
    const navigate = useNavigate();
    return (
        <div className="pr-20 flex flex-col gap-3">
            <div className="w-[768px] max-w-5xl mt-[40px] p-6">

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button onClick={() => navigate(-1)}>
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-2xl font-bold">My Orders</h1>
                </div>

                {/* No Orders */}
                {userOrder.filter(o => o.status === "PAID").length === 0 ? (
                    <p className="text-gray-600 text-xl">
                        No paid orders found
                    </p>
                ) : (

                    <div className="space-y-6">

                        {userOrder
                            .filter(order => order.status === "PAID")
                            .map(order => (

                                <div
                                    key={order.orderId}
                                    className="border-green-500 rounded-2xl p-5 border-2"
                                >

                                    {/* Order Header */}
                                    <div className="flex justify-between items-center mb-3">
                                        <h2 className="text-lg font-semibold">
                                            Order ID:
                                            <span className="text-gray-600 ml-2">
                                                ORDER#{order.orderId}
                                            </span>
                                        </h2>

                                        <span className="px-5 py-2 rounded-full text-sm font-medium bg-green-300 text-green-800">
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* Order Meta */}
                                    <p className="text-gray-700 mb-1">
                                        Total Amount:
                                        <span className="font-bold ml-2">
                                            ₹ {order.totalAmount.toFixed(2)}
                                        </span>
                                    </p>

                                    <p className="text-sm text-gray-500 mb-4">
                                        Ordered On:{" "}
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>

                                    {/* Products */}
                                    <div>
                                        <h3 className="font-medium mb-3">
                                            Products
                                        </h3>

                                        <ul className="space-y-3">
                                            {order.items.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                                                >
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.productName}
                                                        onClick={() => { navigate(`/products/${item.productId}`) }}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />

                                                    <div className="flex-1">
                                                        <p className="font-medium line-clamp-2">
                                                            {item.productName}
                                                        </p>
                                                        <p className="text-sm text-gray-500 line-clamp-2">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    <div className="font-medium text-right">
                                                        ₹ {item.price} × {item.quantity}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
}
