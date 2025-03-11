import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    navigate(`/checkout?productId=${product._id}&price=${product.price}`);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <button className="place-order-btn" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default ProductCard;
