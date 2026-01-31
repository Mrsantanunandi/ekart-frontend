import axios from "../../axiosWithJwt";
import React, { useEffect } from 'react'
import { useState } from 'react';
import { toast } from 'sonner';
import { CardHeader, CardContent, CardTitle, Card } from '@/components/ui/card';
import { ResponsiveContainer } from 'recharts';
import { Tooltip } from 'recharts';
import { Area } from 'recharts';
import { XAxis,YAxis,AreaChart } from 'recharts';

const AdminSales = () => {
  const [State, setState] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalPaidAmount: 0,
    last30DaysSales: []
  });

  const token = localStorage.getItem("token");
  const adminPanel = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/admin-panel`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (res.data?.success) {
        console.log(res.data.myOrder);
        setState(res.data.myOrder)
        toast.success("Fetch AdminPanel Successfully")
      }
    }
    catch (error) {
      console.log(error)
      toast.error(res?.data?.message || "Failed To Fetch Admin Panel")
    }
  }
  useEffect(() => {
    adminPanel()
  }, [])

  //console.log(State.totalUsers)
  return (
    <div className='p1-[350px] bg-gray-100 py-[60px] pr-20 mx-auto px-4'>
      <div className='p-4 grid gap-6 lg:grid-cols-4'>
        {/* stats card */}
        <Card className="bg-pink-500 text-white shadow text-[20px]">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{State?.totalUsers}</CardContent>
        </Card>

        <Card className="bg-pink-500 text-white shadow text-[20px]">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{State?.totalProducts}</CardContent>
        </Card>

        <Card className="bg-pink-500 text-white shadow text-[20px]">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{State?.totalOrders}</CardContent>
        </Card>

        <Card className="bg-pink-500 text-white shadow text-[20px]">
          <CardHeader>
            <CardTitle>Total Sells</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">₹{State?.totalPaidAmount}</CardContent>
        </Card>


        {/* sales chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={State?.last30DaysSales}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#F472B6" fill='#F472B6' />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminSales
