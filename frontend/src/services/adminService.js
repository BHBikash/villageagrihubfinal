const API_URL = "http://localhost:5000/api/orders";

// Fetch all orders (Admin Only)
export const fetchAllOrders = async (token) => {
    const response = await fetch(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }

    return await response.json();
};

// Update order status (Admin Only)
export const updateOrderStatus = async (orderId, status, token) => {
    const response = await fetch(`${API_URL}/update-status/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error("Failed to update order status");
    }

    return await response.json();
};
