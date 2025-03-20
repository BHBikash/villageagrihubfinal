import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/CheckoutPage.css"; 

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://villageagrihub.onrender.com/api/products/${productId}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handlePayment = async () => {
    setLoading(true);

    // ✅ Retrieve token properly
    const token = localStorage.getItem("token");
    console.log("Retrieved Token:", token); // Debugging

    if (!token) {
      console.error("No token found. User is not logged in.");
      alert("You must be logged in to proceed with payment.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://villageagrihub.onrender.com/api/payment/initiate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productId, 
          amount: product.price * quantity, 
          quantity 
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }

    setLoading(false);
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <img src={product.image} alt={product.name} className="checkout-image" />
        <h3>{product.name}</h3>
        <p>Price per unit: ${product.price}</p>
        <p>Category: {product.category}</p>
        <label>Order Quantity:</label>
        <input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <p><strong>Total Price: ${product.price * quantity}</strong></p>
        <button className="checkout-btn" onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
