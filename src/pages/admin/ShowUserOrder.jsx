import OrderCard from '@/components/OrderCard'
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { toast } from "sonner";
import axios from "../../axiosWithJwt";


const ShowUserOrder = () => {
    const params=useParams()
  const [userOrder, setUserOrder] = useState([]);

  const getUserOrder = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
            `/user-order/${params.userId}`,
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

  return (
    <div>
      <OrderCard userOrder={userOrder}/>
    </div>
  )
}

export default ShowUserOrder
