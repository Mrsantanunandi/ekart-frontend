import axios from "../axiosWithJwt";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderCard from "@/components/OrderCard";

export default function MyOrder() {

    const [userOrder, setUserOrder] = useState([]);

    // ================= FETCH USER ORDERS =================
    const getUserOrder = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `${import.meta.env.VITE_URL}/my-order`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                setUserOrder(res.data.myOrder);
                toast.success("Orders fetched successfully");
            } else {
                toast.error("Failed to fetch orders");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        getUserOrder();
    }, []);

    // ================= UI =================
    return (
        <>
        <OrderCard userOrder={userOrder}/>
        </>
    );
}
