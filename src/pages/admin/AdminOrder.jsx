import axios from "../../axiosWithJwt";
import React, { useEffect, useState } from 'react';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "/allUser-order",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (data.success) {
          setOrders(data.myOrder); // ✅ FIX
        }
      } catch (error) {
        console.error("❌ Failed to fetch admin orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading all orders...
      </div>
    );
  }

  return (
    <div className="p1-[350px] py-20 pr-20 mx-auto px-4">
      <h1 className="text-3x1 font-bold mb-6">Admin All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Products</th>
                <th className="px-6 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, idx) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  {/* Order ID */}
                  <td className="px-4 py-2 border">
                    ORDER#{order.orderId}
                  </td>

                  {/* User */}
                  <td className="px-4 py-2 border">
                    {order.username}
                    <br />
                    <span className="text-xs text-gray-500">
                      {order.email}
                    </span>
                  </td>

                  {/* Products */}
                  <td className="px-4 py-2 border">
                    {order.items.map((p, i) => (
                      <div key={i} className="text-sm">
                        {p.productName} × {p.quantity}
                      </div>
                    ))}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-2 border font-semibold">
                    ₹ {order.totalAmount.toLocaleString("en-IN")}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${order.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : order.status === "PENDING"
                            ? "bg-red-100 text-red-700"
                            : order.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-2 border">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrder;
