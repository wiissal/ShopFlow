'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState('');

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

  const isActive = (path) => pathname === path;

  return (
    <>
      <style>{`
        .announcement-bar {
          background: #00d084;
          color: #0a0a16;
          text-align: center;
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .announcement-bar a {
          color: #0a0a16;
          font-weight: 700;
          text-decoration: underline;
          margin-left: 8px;
        }
        .main-nav {
          background: #0d0d1a;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 60px;
          height: 70px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          font-family: Inter, sans-serif;
          position: sticky;
          top: 0;
          z-index: 100;
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
          font-weight: 800;
          color: #0a0a16;
          font-size: 18px;
        }
        .nav-logo-text {
          color: white;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s;
          position: relative;
        }
        .nav-link:hover {
          color: white;
          background: rgba(255,255,255,0.05);
        }
        .nav-link.active {
          color: #00d084;
          background: rgba(0,208,132,0.08);
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px;
          background: #00d084;
          border-radius: 50%;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: flex-end;
        }
        .nav-icon-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 8px 14px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          font-family: Inter, sans-serif;
          position: relative;
        }
        .nav-icon-btn:hover {
          border-color: rgba(255,255,255,0.2);
          color: white;
          background: rgba(255,255,255,0.04);
        }
        .cart-badge {
          position: absolute;
          top: -5px; right: -5px;
          background: #00d084;
          color: #0a0a16;
          width: 18px; height: 18px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-btn-primary {
          background: #00d084;
          border: none;
          border-radius: 10px;
          padding: 9px 20px;
          color: #0a0a16;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          font-family: Inter, sans-serif;
        }
        .nav-btn-primary:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }
        .nav-btn-logout {
          background: rgba(255,71,87,0.08);
          border: 1px solid rgba(255,71,87,0.2);
          border-radius: 10px;
          padding: 9px 16px;
          color: #ff4757;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: Inter, sans-serif;
        }
        .nav-btn-logout:hover { background: rgba(255,71,87,0.15); }
        .admin-badge {
          background: rgba(246,201,14,0.1);
          border: 1px solid rgba(246,201,14,0.2);
          border-radius: 10px;
          padding: 9px 14px;
          color: #f6c90e;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .admin-badge:hover { background: rgba(246,201,14,0.18); }
      `}</style>

     

      {/* Main Nav */}
      <nav className="main-nav">
        {/* Left — Logo */}
        <Link href="/" className="nav-logo">
          <div className="nav-logo-box">S</div>
          <span className="nav-logo-text">ShopFlow</span>
        </Link>

        {/* Center — Links */}
        <div className="nav-links">
          <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link href="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Products</Link>
          <Link href="/products?category=laptops" className="nav-link">Laptops</Link>
          <Link href="/products?category=smartphones" className="nav-link">Phones</Link>
          <Link href="/products?category=gaming" className="nav-link">Gaming</Link>
        </div>

        {/* Right — Actions */}
        <div className="nav-right">

          <Link href="/cart" className="nav-icon-btn">
            🛒
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>

          {user?.role === 'admin' && (
            <Link href="/admin" className="admin-badge">⚡ Admin</Link>
          )}

          {user ? (
            <button className="nav-btn-logout" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link href="/login" className="nav-icon-btn">Log in</Link>
              <Link href="/register" className="nav-btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}