import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => <ProductCard key={product._id} product={product} addToCart={() => {}} />)
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default ProductListPage;
