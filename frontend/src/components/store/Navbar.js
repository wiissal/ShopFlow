"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, LogOut, User, Package } from "lucide-react";
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
        .main-nav {
          background: #0a2535;
          border-bottom: 1px solid rgba(26,143,160,0.15);
          padding: 0 60px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
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
        .nav-center {
          display: flex;
          align-items: center;
          gap: 4px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
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
          white-space: nowrap;
        }
        .nav-link:hover {
          color: white;
          background: rgba(26,143,160,0.08);
        }
        .nav-link.active {
          color: #1a8fa0;
          background: rgba(26,143,160,0.1);
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px;
          background: #1a8fa0;
          border-radius: 50%;
        }
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
        .nav-btn-primary:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }
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
      `}</style>

      <nav className="main-nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-box">S</div>
          <span className="nav-logo-text">ShopFlow</span>
        </Link>

        <div className="nav-center">
          <Link href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Home
          </Link>
          <Link href="/products?category=laptops" className="nav-link">Laptops</Link>
          <Link href="/products?category=smartphones" className="nav-link">Phones</Link>
          <Link href="/products?category=accessories" className="nav-link">Accessories</Link>
          <Link href="/products?category=audio" className="nav-link">Audio</Link>
          <Link href="/products?category=gaming" className="nav-link">Gaming</Link>
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
    </>
  );
}