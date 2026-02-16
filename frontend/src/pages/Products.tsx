import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Products.css";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
}

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.data.products);
    } catch (err: any) {
      setError("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }
    try {
      setLoading(true);
      const response = await productService.search(searchQuery);
      setProducts(response.data.products);
    } catch (err: any) {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    if (!category) {
      fetchProducts();
      return;
    }
    try {
      setLoading(true);
      const response = await productService.getByCategory(category);
      setProducts(response.data.products);
    } catch (err: any) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.delete(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      setError("Failed to delete product");
    }
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products</h1>
        {user && (
          <button
            onClick={() => navigate("/products/new")}
            className="btn-primary"
          >
            Add Product
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="category-filters">
        <button
          className={selectedCategory === "" ? "active" : ""}
          onClick={() => handleCategoryFilter("")}
        >
          All
        </button>
        <button
          className={selectedCategory === "Electronics" ? "active" : ""}
          onClick={() => handleCategoryFilter("Electronics")}
        >
          Electronics
        </button>
        <button
          className={selectedCategory === "General" ? "active" : ""}
          onClick={() => handleCategoryFilter("General")}
        >
          General
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : products.length === 0 ? (
        <div className="no-products">No products found</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <p className="category">Category: {product.category}</p>
              <p className="price">${product.price}</p>
              <p
                className={`stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}
              >
                Stock: {product.stock}
              </p>
              <div className="card-actions">
                <button onClick={() => navigate(`/products/${product.id}`)}>
                  View
                </button>
                {user && (
                  <>
                    <button
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
