"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, LogOut, User, Package, Search, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?search=${search}`);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path) => pathname === path;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        font-family: Inter, sans-serif;

        /* ── BAR 1 — TOP INFO ── */
        .top-bar {
          background: #071f2e;
          border-bottom: 1px solid rgba(26,143,160,0.1);
          padding: 0 60px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: Inter, sans-serif;
        }
        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 16px;
          color: rgba(255,255,255,0.45);
          font-size: 12px;
        }
        .top-bar-left a {
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: color 0.2s;
        }
        .top-bar-left a:hover { color: #1a8fa0; }
        .top-bar-divider {
          width: 1px; height: 12px;
          background: rgba(255,255,255,0.1);
        }
        .top-bar-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.5);
          font-size: 12px;
          white-space: nowrap;
        }
        .top-bar-center span { color: #1a8fa0; font-weight: 600; }
        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 16px;
          color: rgba(255,255,255,0.45);
          font-size: 12px;
        }
        .top-bar-right a {
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .top-bar-right a:hover { color: #1a8fa0; }

        /* ── BAR 2 — MAIN NAV ── */
        .main-nav {
          background: #0a2535;
          border-bottom: 1px solid rgba(26,143,160,0.12);
          padding: 0 60px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
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
          flex-shrink: 0;
        }
        .nav-logo-box {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: #1a8fa0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #071f2e;
          font-size: 18px;
        }
        .nav-logo-text {
          color: white;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        /* Search bar */
        .nav-search {
          flex: 1;
          max-width: 560px;
          display: flex;
          align-items: center;
        }
        .search-form {
          width: 100%;
          display: flex;
          align-items: center;
          background: #071f2e;
          border: 1px solid rgba(26,143,160,0.2);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .search-form:focus-within {
          border-color: #1a8fa0;
          box-shadow: 0 0 0 3px rgba(26,143,160,0.1);
        }
        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 10px 16px;
          color: white;
          font-size: 14px;
          font-family: Inter, sans-serif;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.25); }
        .search-btn {
          background: #1a8fa0;
          border: none;
          padding: 10px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #071f2e;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .search-btn:hover { background: #0e6b7a; }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .nav-icon-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid rgba(26,143,160,0.2);
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
          border-color: #1a8fa0;
          color: white;
          background: rgba(26,143,160,0.08);
        }
        .cart-badge {
          position: absolute;
          top: -5px; right: -5px;
          background: #1a8fa0;
          color: #071f2e;
          width: 18px; height: 18px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-btn-primary {
          background: #1a8fa0;
          border: none;
          border-radius: 10px;
          padding: 9px 20px;
          color: #071f2e;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          font-family: Inter, sans-serif;
        }
        .nav-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .nav-btn-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,71,87,0.08);
          border: 1px solid rgba(255,71,87,0.2);
          border-radius: 10px;
          padding: 9px 14px;
          color: #ff4757;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: Inter, sans-serif;
        }
        .nav-btn-logout:hover { background: rgba(255,71,87,0.15); }
        .admin-badge {
          background: rgba(26,143,160,0.1);
          border: 1px solid rgba(26,143,160,0.25);
          border-radius: 10px;
          padding: 9px 14px;
          color: #7ab3b8;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .admin-badge:hover { background: rgba(26,143,160,0.18); }

        /* ── BAR 3 — CATEGORY LINKS ── */
        .cat-bar {
          background: #0a2535;
          border-bottom: 1px solid rgba(26,143,160,0.12);
          padding: 0 60px;
          height: 42px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: Inter, sans-serif;
          position: sticky;
          top: 70px;
          z-index: 99;
        }
        .cat-link {
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 6px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .cat-link:hover {
          color: white;
          background: rgba(26,143,160,0.08);
        }
        .cat-link.active {
          color: #1a8fa0;
          background: rgba(26,143,160,0.1);
        }
        .cat-link.active::after {
          content: '';
          display: block;
          width: 4px; height: 4px;
          background: #1a8fa0;
          border-radius: 50%;
          margin: 2px auto 0;
        }
      `}</style>

      {/* ── BAR 1 — TOP INFO ── */}
      <div className="top-bar">
        <div className="top-bar-left" style={{ position: 'relative' }}>
          <a href="#">🇲🇦 Morocco / English</a>
          <div className="top-bar-divider" />
          <a href="#">Accessibility</a>
          <div className="top-bar-divider" />
          <a href="#">Find a Store</a>
        </div>

        <div className="top-bar-center">
          LIMITED TIME: <span>FREE SHIPPING & RETURNS</span> ON $99+ PURCHASE. NO CODE REQUIRED.{' '}
          <a href="/products" style={{ color: '#1a8fa0', textDecoration: 'underline' }}>SHOP NOW</a>
        </div>

        <div className="top-bar-right">
          <a href="#"><Phone size={11} /> +212 600 000 000</a>
          <div className="top-bar-divider" style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)' }} />
          <a href="/login"><User size={11} /> {user ? user.name : 'Sign In'}</a>
          <div className="top-bar-divider" style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)' }} />
          <a href="#">Services</a>
          <div className="top-bar-divider" style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)' }} />
          <a href="#">Contact Us</a>
        </div>
      </div>

      {/* ── BAR 2 — MAIN NAV ── */}
      <nav className="main-nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-box">S</div>
          <span className="nav-logo-text">ShopFlow</span>
        </Link>

        <div className="nav-search">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              className="search-input"
              type="text"
              placeholder="Search Product, Code or Brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <Search size={16} />
            </button>
          </form>
        </div>

        <div className="nav-right">
          {user && (
            <Link href="/orders" className="nav-icon-btn">
              <Package size={16} />
            </Link>
          )}

          <Link href="/cart" className="nav-icon-btn">
            <ShoppingCart size={16} />
            Cart
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>

          {user?.role === "admin" && (
            <Link href="/admin" className="admin-badge">⚡ Admin</Link>
          )}

          {user ? (
            <button className="nav-btn-logout" onClick={handleLogout}>
              <LogOut size={15} />
            </button>
          ) : (
            <>
              <Link href="/login" className="nav-icon-btn">
                <User size={15} /> Log in
              </Link>
              <Link href="/register" className="nav-btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── BAR 3 — CATEGORY LINKS ── */}
      <div className="cat-bar">
        <Link href="/" className={`cat-link ${isActive("/") ? "active" : ""}`}>Home</Link>
        <Link href="/products" className={`cat-link ${isActive("/products") ? "active" : ""}`}>Shop</Link>
        <Link href="/products?category=laptops" className="cat-link">Laptops</Link>
        <Link href="/products?category=smartphones" className="cat-link">Phones</Link>
        <Link href="/products?category=accessories" className="cat-link">Accessories</Link>
        <Link href="/products?category=audio" className="cat-link">Audio</Link>
        <Link href="/products?category=gaming" className="cat-link">Gaming</Link>
        <Link href="/products" className="cat-link">New Arrivals</Link>
        <Link href="/products" className="cat-link">Best Sellers</Link>
        {user && <Link href="/orders" className="cat-link">My Orders</Link>}
      </div>
    </>
  );
}