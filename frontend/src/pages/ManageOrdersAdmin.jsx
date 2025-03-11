import React, { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus } from "../services/orderService";

const ManageOrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null); // Track which order is updating

  const token = localStorage.getItem("token"); // Fetch token from local storage

  useEffect(() => {
    if (!token) {
      setError("Unauthorized: Admin token missing");
      return;
    }
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Fetching orders...");
      const data = await fetchOrders(token);
      console.log("Orders fetched:", data);
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      console.log(`Updating order ${orderId} to ${newStatus}...`);
      await updateOrderStatus(orderId, newStatus, token);
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard - Manage Orders</h2>

      {loading && <p className="text-blue-500">Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Buyer</th>
              <th className="p-2 text-left">Products</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-2">{order._id}</td>
                <td className="p-2">{order.buyer.name} ({order.buyer.email})</td>
                <td className="p-2">
                  {order.products.map((p) => (
                    <div key={p.product._id}>
                      {p.product.name} (x{p.quantity})
                    </div>
                  ))}
                </td>
                <td className="p-2">${order.totalAmount}</td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border p-1 rounded"
                    disabled={updating === order._id} // Disable dropdown while updating
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  {updating === order._id && (
                    <span className="ml-2 text-blue-500">Updating...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrdersAdmin;
