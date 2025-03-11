import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

// ✅ Fetch all orders (Admin)
export const fetchOrders = async (token) => {
  try {
    console.log("Admin Token:", token); // Debugging
    const response = await axios.get(`${API_URL}/admin/orders`, { // Fixed Admin Orders Path
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// ✅ Update order status (Admin)
export const updateOrderStatus = async (orderId, status, token) => {
  try {
    console.log("Admin Token for update:", token); // Debugging
    const response = await axios.put(
      `${API_URL}/admin/orders/${orderId}/status`, // Fixed Admin Order Update Path
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// ✅ Place an Order (Buyer)
export const placeOrder = async (products, token) => {
  try {
    const response = await axios.post(
      API_URL,
      { products },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

// ✅ Fetch Buyer's Orders (Buyer)
export const fetchMyOrders = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching buyer's orders:", error);
    throw error;
  }
};
