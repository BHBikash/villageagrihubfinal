import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import "../styles/ProductPage.css";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getAllProducts();
        const foundProduct = products.find((p) => p._id === id);
        setProduct(foundProduct);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details">
      <img src={product.image} alt={product.name} className="product-image" />
      <h2>{product.name}</h2>
      <p><strong>Farmer:</strong> {product.farmerName}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
    </div>
  );
};

export default ProductDetailsPage;
