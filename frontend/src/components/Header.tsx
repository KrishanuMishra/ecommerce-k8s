import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>E-Commerce Store</h1>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            Products
          </Link>

          <div className="auth-section">
            {user ? (
              <>
                <span className="user-name">Hi, {user.fullName}</span>
                {user.role === "ADMIN" && (
                  <Link to="/products/new" className="nav-link btn-small">
                    Add Product
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
