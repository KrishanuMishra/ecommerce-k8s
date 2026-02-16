import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../services/api";
import "../styles/ProductDetail.css";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
}

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getById(parseInt(id));
        setProduct(response.data.product);
      } catch (err: any) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <h1>{product.name}</h1>
        <p className="description">{product.description}</p>
        <div className="product-info">
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Price:</strong> ${product.price}
          </p>
          <p>
            <strong>Stock:</strong> {product.stock} units
          </p>
          <p>
            <strong>Added:</strong>{" "}
            {new Date(product.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};
