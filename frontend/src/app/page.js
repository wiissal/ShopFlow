'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/store/Navbar';
import { productsAPI } from '@/lib/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll({ limit: 8 }).then((res) => {
      if (res.success) setProducts(res.data.products);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a16; font-family: Inter, sans-serif; }

        /* HERO */
        .hero {
          min-height: 75vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          background: #0a0a16;
          padding: 0 80px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: radial-gradient(ellipse at 20% 50%, rgba(0,208,132,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-left {
          z-index: 1;
          animation: fadeInLeft 1s ease forwards;
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,208,132,0.08);
          border: 1px solid rgba(0,208,132,0.25);
          color: #00d084;
          padding: 8px 18px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 28px;
          letter-spacing: 0.3px;
        }
        .hero-badge span {
          width: 6px; height: 6px;
          background: #00d084;
          border-radius: 50%;
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .hero h1 {
          color: white;
          font-size: 68px;
          font-weight: 800;
          line-height: 1.05;
          margin-bottom: 24px;
          letter-spacing: -2px;
        }
        .hero h1 .accent { color: #00d084; }
        .hero h1 .dim { color: rgba(255,255,255,0.4); }
        .hero-desc {
          color: rgba(255,255,255,0.55);
          font-size: 17px;
          line-height: 1.7;
          max-width: 460px;
          margin-bottom: 40px;
        }
        .hero-btns {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 52px;
        }
        .btn-primary {
          background: #00d084;
          color: #0a0a16;
          padding: 15px 34px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 4px 24px rgba(0,208,132,0.35);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 35px rgba(0,208,132,0.5);
        }
        .btn-secondary {
          background: transparent;
          color: rgba(255,255,255,0.8);
          padding: 15px 34px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.15);
          transition: all 0.3s;
        }
        .btn-secondary:hover {
          border-color: #00d084;
          color: #00d084;
        }
        .hero-stats {
          display: flex;
          gap: 36px;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
        }
        .hero-stat-num {
          color: white;
          font-size: 26px;
          font-weight: 800;
        }
        .hero-stat-label {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
        }
        .hero-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          align-self: center;
        }

        /* Hero Right */
        .hero-right {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeInRight 1s ease forwards;
        }
        .hero-image-wrapper {
          position: relative;
          width: 580px;
          height: 420px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06);
          animation: floatUp 6s ease-in-out infinite;
        }
        .hero-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,208,132,0.05) 0%, transparent 60%);
        }

        /* Floating product card */
        .floating-card {
          position: absolute;
          bottom: -20px;
          left: -40px;
          background: rgba(22,33,62,0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          animation: floatUp 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        .floating-card-icon {
          width: 48px; height: 48px;
          background: rgba(0,208,132,0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .floating-card-text { display: flex; flex-direction: column; }
        .floating-card-name {
          color: white;
          font-size: 14px;
          font-weight: 600;
        }
        .floating-card-price {
          color: #00d084;
          font-size: 16px;
          font-weight: 700;
        }

        /* Glow dot */
        .glow-dot {
          position: absolute;
          top: 20px;
          right: -20px;
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(0,208,132,0.3) 0%, transparent 70%);
          border-radius: 50%;
        }

        /* STATS BAR */
        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 0;
          background: #0d0d1a;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .stat-item {
          flex: 1;
          text-align: center;
          padding: 28px 20px;
          border-right: 1px solid rgba(255,255,255,0.05);
          transition: background 0.3s;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: rgba(0,208,132,0.03); }
        .stat-num {
          color: #00d084;
          font-size: 30px;
          font-weight: 800;
          display: block;
        }
        .stat-label {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          margin-top: 4px;
        }

        /* PRODUCTS SECTION */
        .section {
          padding: 80px;
          background: #0a0a16;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }
        .section-tag {
          color: #00d084;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .section-title {
          color: white;
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -1px;
        }
        .view-all {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .view-all:hover { color: #00d084; border-bottom-color: #00d084; }

        /* PRODUCT GRID */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .product-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          overflow: hidden;
          transition: all 0.35s ease;
          text-decoration: none;
          display: block;
          position: relative;
        }
        .product-card:hover {
          transform: translateY(-8px);
          border-color: rgba(0,208,132,0.25);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }
        .product-card:hover .product-overlay { opacity: 1; }
        .product-image-wrap {
          width: 100%;
          height: 200px;
          background: #16213e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 60px;
          position: relative;
          overflow: hidden;
        }
        .product-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-image-wrap img {
          transform: scale(1.05);
        }
        .product-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,208,132,0.08);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .product-info { padding: 18px; }
        .product-cat {
          color: #00d084;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }
        .product-name {
          color: white;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .product-price {
          color: white;
          font-size: 20px;
          font-weight: 800;
        }
        .product-price span {
          color: #00d084;
          font-size: 13px;
          font-weight: 600;
          margin-left: 2px;
        }
        .product-stock {
          color: rgba(255,255,255,0.3);
          font-size: 12px;
        }

        /* BANNER */
        .banner {
          margin: 0 80px 80px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          height: 280px;
          display: flex;
          align-items: center;
        }
        .banner-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(10,10,22,0.95) 0%, rgba(10,10,22,0.6) 60%, transparent 100%);
        }
        .banner-content {
          position: relative;
          z-index: 1;
          padding: 0 60px;
        }
        .banner-tag {
          color: #00d084;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }
        .banner-title {
          color: white;
          font-size: 42px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }

        /* FOOTER */
        .footer {
          background: #0d0d1a;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 40px 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(255,255,255,0.3);
          font-size: 14px;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .footer-logo-box {
          width: 32px; height: 32px;
          background: #00d084;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #0a0a16;
          font-size: 16px;
        }
        .footer-logo-text { color: white; font-weight: 600; font-size: 16px; }
        .loading-state {
          text-align: center;
          padding: 80px;
          color: rgba(255,255,255,0.3);
          font-size: 16px;
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          
          <h1>
            Next Level<br />
            <span className="accent">Electronics</span><br />
            <span className="dim">For You.</span>
          </h1>
          <p className="hero-desc">
            Discover the latest laptops, smartphones, and accessories. Premium quality, unbeatable prices, delivered to your door.
          </p>
          <div className="hero-btns">
            <Link href="/products" className="btn-primary">
              Shop Now →
            </Link>
            <Link href="/register" className="btn-secondary">
              Join Free
            </Link>
          </div>
         
        </div>

        <div className="hero-right">
          <div className="glow-dot" />
          <div className="hero-image-wrapper">
            <img src="/hero-laptop.jpg" alt="Latest Electronics" />
            <div className="hero-image-overlay" />
          </div>
          
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-num">500+</span>
          <div className="stat-label">Products Available</div>
        </div>
        <div className="stat-item">
          <span className="stat-num">10K+</span>
          <div className="stat-label">Happy Customers</div>
        </div>
        <div className="stat-item">
          <span className="stat-num">24/7</span>
          <div className="stat-label">Customer Support</div>
        </div>
        <div className="stat-item">
          <span className="stat-num">Free</span>
          <div className="stat-label">Shipping over $50</div>
        </div>
        <div className="stat-item">
          <span className="stat-num">4.9★</span>
          <div className="stat-label">Customer Rating</div>
        </div>
        
      </div>

      {/* FEATURED PRODUCTS */}
      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-tag"> Featured</div>
            <h2 className="section-title">Latest Products</h2>
          </div>
          <Link href="/products" className="view-all">View All Products →</Link>
        </div>

        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="loading-state">No products yet. Check back soon!</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="product-card">
                <div className="product-image-wrap">
                  {product.image ? (
                    <>
                      <img src={product.image} alt={product.name} />
                      <div className="product-overlay" />
                    </>
                  ) : '📦'}
                </div>
                <div className="product-info">
                  <div className="product-cat">{product.category_name || 'Electronics'}</div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-footer">
                    <div className="product-price">
                      ${product.price}<span>USD</span>
                    </div>
                    <div className="product-stock">{product.stock} left</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* BANNER */}
      <div className="banner">
        <img src="/hero-phone.jpg" alt="iPhone" className="banner-bg" />
        <div className="banner-overlay" />
        <div className="banner-content">
          <div className="banner-tag">✦ New Arrival</div>
          <div className="banner-title">
            The New iPhone<br />is Here.
          </div>
          <Link href="/products" className="btn-primary">
            Shop Now →
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <Link href="/" className="footer-logo">
          <div className="footer-logo-box">S</div>
          <span className="footer-logo-text">ShopFlow</span>
        </Link>
        <span>© 2026 ShopFlow. Built with passion in Morocco 🇲🇦</span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/products" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Products</Link>
          <Link href="/login" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Login</Link>
          <Link href="/register" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Register</Link>
        </div>
      </footer>
    </>
  );
}