import { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/orders");
                setOrders(response.data);
            } catch (error) {
                setError("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Admin Orders</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Buyer</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.buyer.name}</td>
                            <td>${order.totalPrice}</td>
                            <td>{order.status}</td>
                            <td>
                                <button onClick={() => console.log("Update order:", order._id)}>Update</button>
                                <button onClick={() => console.log("Delete order:", order._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;
