import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import "../styles/FarmerDashboard.css";

const FarmerDashboard = () => {
    const { user } = useAuthContext();
    
    // State for products and orders
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    // State for product form
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);

    // Fetch farmer's products
    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products", {
                headers: { Authorization: `Bearer ${user.token}` },
            });
    
            const data = await response.json();
            console.log("Full API Response:", data); // Log full response to debug
    
            if (!Array.isArray(data)) {
                console.error("API response is not an array:", data);
                setProducts([]);  // Avoid .map() error
                return;
            }
    
            console.log("Logged-in Farmer ID:", user._id); // Corrected user ID field
    
            // Filter products for this farmer
            const farmerProducts = data.filter(product => {
                console.log(`Checking product: ${product.name}`);
                console.log(`Product Farmer ID: ${product.farmer?._id}, Logged-in Farmer ID: ${user._id}`);
                return product.farmer?._id === user._id; // Corrected comparison
            });
    
            console.log("Filtered Products:", farmerProducts);
            setProducts(farmerProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        }
    };
    

    // Fetch farmer's orders
    const fetchOrders = async () => {
        if (!user?.token) return;

        try {
            const response = await fetch("http://localhost:5000/api/orders/farmer-orders", {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            const data = await response.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchProducts();
            fetchOrders();
        }
    }, [user?.token]);

    // Handle file input
    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    // Handle form input changes
    const handleChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    // Handle form submission (add/update product)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.token) return;

        const formData = new FormData();
        Object.keys(productData).forEach(key => formData.append(key, productData[key]));
        if (selectedFile) formData.append("image", selectedFile);

        const url = editingProduct 
            ? `http://localhost:5000/api/products/${editingProduct._id}`
            : "http://localhost:5000/api/products";
        const method = editingProduct ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${user.token}` },
                body: formData,
            });

            if (response.ok) {
                alert(`Product ${editingProduct ? "updated" : "added"} successfully!`);
                setProductData({ name: "", description: "", price: "", category: "", stock: "" });
                setSelectedFile(null);
                setEditingProduct(null);
                fetchProducts();
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to save product");
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    // Handle edit product
    const handleEditProduct = (product) => {
        setProductData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
        });
        setEditingProduct(product);
    };

    // Handle delete product
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        if (!user?.token) return;

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${user.token}` },
            });

            if (response.ok) {
                alert("Product deleted successfully!");
                fetchProducts();
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="farmer-dashboard">
            <h2>Farmer Dashboard</h2>

            {/* Add / Update Product Form */}
            <h3>{editingProduct ? "Update Product" : "Add Product"}</h3>
            <form onSubmit={handleSubmit} className="product-form">
                <input type="text" name="name" placeholder="Product Name" value={productData.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={productData.description} onChange={handleChange} required />
                <input type="number" name="price" placeholder="Price" value={productData.price} onChange={handleChange} required />
                <input type="text" name="category" placeholder="Category" value={productData.category} onChange={handleChange} required />
                <input type="number" name="stock" placeholder="Stock" value={productData.stock} onChange={handleChange} required />
                <input type="file" onChange={handleFileChange} />
                <button type="submit" className="btn">{editingProduct ? "Update Product" : "Add Product"}</button>
            </form>

            {/* Product List */}
            <h3>Your Products</h3>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="products-list">
                    {products.map((product) => (
                        <div key={product._id} className="product-card">
                            {product.image && <img src={product.image} alt={product.name} className="product-image" />}
                            <h4>{product.name}</h4>
                            <p>{product.description}</p>
                            <p><strong>Price:</strong> ${product.price}</p>
                            <p><strong>Stock:</strong> {product.stock}</p>
                            <button className="btn edit" onClick={() => handleEditProduct(product)}>Edit</button>
                            <button className="btn delete" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Orders List */}
            <h3>Your Orders</h3>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className="orders-list">
                    {orders.map(order => (
                        <li key={order._id}>
                            Order ID: {order._id} - Status: {order.status}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FarmerDashboard;
