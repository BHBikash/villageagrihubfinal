import { useEffect, useState } from "react";
import { fetchMyOrders } from "../services/orderService";
import "../styles/BuyerOrders.css"; // Keep CSS for styling

const BASE_URL = "http://localhost:5000"; // Adjust this to match your backend URL

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const token = user?.token;

      if (!token) {
        alert("Please log in to view orders.");
        return;
      }

      try {
        const data = await fetchMyOrders(token);
        console.log("Fetched Orders:", JSON.stringify(data, null, 2)); // Debug API response
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    getOrders();
  }, []);

  return (
    <div className="buyer-orders">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => {
            if (!order.products || order.products.length === 0) {
              return (
                <div key={order._id} className="order-card">
                  <h3>Order ID: {order._id}</h3>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                  <p><strong>No product details available</strong></p>
                </div>
              );
            }

            // Extract product details safely
            const product = order.products[0]?.product || {};
            const quantity = order.products[0]?.quantity || 0;

            // Correct image path with Base URL
            let productImage = product.image
              ? `${BASE_URL}/${product.image.replace(/\\/g, "/")}`
              : "placeholder.jpg";

            console.log("Final Image URL:", productImage); // Debugging

            return (
              <div key={order._id} className="order-card">
                <img src={productImage} alt={product.name || "Unknown Product"} className="product-image" />
                <h3>{product.name || "Unknown Product"}</h3>
                <p>Price: ${product.price ?? "N/A"}</p>
                <p>Quantity: {quantity}</p>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                <p><strong>Status:</strong> <span className="status">{order.status}</span></p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;
