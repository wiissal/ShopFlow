'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${search}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #0d0d1a;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 0 40px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: Inter, sans-serif;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .nav-logo-box {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: #00d084;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #1a1a2e;
          font-size: 18px;
        }
        .nav-logo-text {
          color: white;
          font-size: 18px;
          font-weight: 700;
        }
        .nav-search {
          display: flex;
          align-items: center;
          background: #16213e;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          overflow: hidden;
          width: 320px;
          transition: all 0.3s ease;
        }
        .nav-search:focus-within {
          border-color: #00d084;
          box-shadow: 0 0 0 3px rgba(0,208,132,0.1);
        }
        .nav-search input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          padding: 10px 16px;
          font-size: 14px;
          width: 100%;
        }
        .nav-search input::placeholder { color: rgba(255,255,255,0.3); }
        .nav-search button {
          background: #00d084;
          border: none;
          padding: 10px 16px;
          cursor: pointer;
          color: #1a1a2e;
          font-weight: 600;
          font-size: 14px;
          transition: opacity 0.2s;
        }
        .nav-search button:hover { opacity: 0.85; }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .nav-link {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #00d084; }
        .cart-btn {
          position: relative;
          background: #16213e;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 8px 14px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .cart-btn:hover {
          border-color: #00d084;
          color: #00d084;
        }
        .cart-badge {
          position: absolute;
          top: -6px; right: -6px;
          background: #00d084;
          color: #1a1a2e;
          width: 18px; height: 18px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logout-btn {
          background: rgba(255,71,87,0.1);
          border: 1px solid rgba(255,71,87,0.3);
          border-radius: 10px;
          padding: 8px 16px;
          color: #ff4757;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        .logout-btn:hover {
          background: rgba(255,71,87,0.2);
        }
        .login-btn-nav {
          background: #00d084;
          border: none;
          border-radius: 10px;
          padding: 8px 20px;
          color: #1a1a2e;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .login-btn-nav:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }
      `}</style>

      <nav className="navbar">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          <div className="nav-logo-box">S</div>
          <span className="nav-logo-text">ShopFlow</span>
        </Link>

        {/* Search */}
        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        {/* Links */}
        <div className="nav-links">
          <Link href="/products" className="nav-link">Products</Link>

          {user && (
            <Link href="/orders" className="nav-link">My Orders</Link>
          )}

          {user?.role === 'admin' && (
            <Link href="/admin" className="nav-link" style={{ color: '#f6c90e' }}>
              Admin ⚡
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" className="cart-btn">
            🛒 Cart
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>

          {/* Auth */}
          {user ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link href="/login" className="login-btn-nav">
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}