"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/store/Navbar";
import { productsAPI } from "@/lib/api";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    productsAPI.getAll({ limit: 20 }).then((res) => {
      if (res.success) {
        const all = res.data.products;
        const seen = new Set();
        const featured = [];
        for (const p of all) {
          if (
            !seen.has(p.category_name) &&
            featured.length < 4 &&
            p.category_name !== "Gaming"
          ) {
            seen.add(p.category_name);
            featured.push(p);
          }
        }
        setProducts(featured);
        const withImages = featured.filter((p) => p.image);
        setFeaturedProducts(withImages.length > 0 ? withImages : featured);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (featuredProducts.length < 2) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setHeroIndex((prev) => (prev + 1) % featuredProducts.length);
        setFading(false);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredProducts]);

  const heroProduct = featuredProducts[heroIndex];

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #071f2e; font-family: Inter, sans-serif; }

        

        .hero {
          position: relative;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          transition: opacity 0.4s ease;
        }
        .hero-bg.fading { opacity: 0; }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(7,31,46,0.15) 0%,
            rgba(7,31,46,0.1) 35%,
            rgba(7,31,46,0.65) 65%,
            rgba(7,31,46,0.95) 100%
          );
        }
        .hero-accent-lines {
          position: absolute;
          left: 80px;
          bottom: 220px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 2;
        }
        .hero-accent-lines span {
          display: block;
          height: 2px;
          background: rgba(255,255,255,0.7);
          border-radius: 2px;
        }
        .hero-accent-lines span:first-child { width: 32px; }
        .hero-accent-lines span:last-child { width: 20px; }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 0 80px 120px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .hero-left h1 {
          color: white;
          font-size: clamp(36px, 5vw, 68px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -2px;
          max-width: 700px;
        }
        .hero-right-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
          padding-bottom: 4px;
        }
        .hero-dots { display: flex; gap: 8px; }
        .hero-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          padding: 0;
        }
        .hero-dot.active {
          background: white;
          width: 24px;
          border-radius: 3px;
        }
        .hero-price-tag {
          position: absolute;
          bottom: 200px;
          right: 80px;
          z-index: 2;
          transition: opacity 0.4s;
        }
        .hero-price-tag.fading { opacity: 0; }
        .hero-price-label {
          color: rgba(255,255,255,0.5);
          font-size: 12px;
          text-align: right;
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .hero-price-value {
          color: #1a8fa0;
          font-size: 32px;
          font-weight: 800;
          text-align: right;
        }
        .btn-primary {
          background: white;
          color: #071f2e;
          padding: 15px 30px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .btn-primary:hover {
          background: #1a8fa0;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(26,143,160,0.4);
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          background: #0a2535;
          border-top: 1px solid rgba(26,143,160,0.1);
          border-bottom: 1px solid rgba(26,143,160,0.1);
        }
        .stat-item {
          flex: 1;
          text-align: center;
          padding: 28px 20px;
          border-right: 1px solid rgba(26,143,160,0.1);
          transition: background 0.3s;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: rgba(26,143,160,0.05); }
        .stat-num { color: #1a8fa0; font-size: 28px; font-weight: 800; display: block; }
        .stat-label { color: rgba(255,255,255,0.4); font-size: 13px; margin-top: 4px; }

        .section { padding: 80px; background: #071f2e; }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }
        .section-tag {
          color: #1a8fa0;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
        }
        .section-title { color: white; font-size: 36px; font-weight: 800; letter-spacing: -1px; }
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
        .view-all:hover { color: #1a8fa0; border-bottom-color: #1a8fa0; }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .product-card {
          background: #0a2535;
          border: 1px solid rgba(26,143,160,0.1);
          border-radius: 18px;
          overflow: hidden;
          transition: all 0.35s ease;
          text-decoration: none;
          display: block;
        }
        .product-card:hover {
          transform: translateY(-8px);
          border-color: rgba(26,143,160,0.4);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }
        .product-image-wrap {
          width: 100%;
          height: 200px;
          background: #0e3a4a;
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
        .product-card:hover .product-image-wrap img { transform: scale(1.05); }
        .product-overlay {
          position: absolute;
          inset: 0;
          background: rgba(26,143,160,0.08);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .product-card:hover .product-overlay { opacity: 1; }
        .product-info { padding: 18px; }
        .product-cat {
          color: #1a8fa0;
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
        .product-footer { display: flex; justify-content: space-between; align-items: center; }
        .product-price { color: white; font-size: 20px; font-weight: 800; }
        .product-price span { color: #1a8fa0; font-size: 13px; font-weight: 600; margin-left: 2px; }
        .product-stock { color: rgba(255,255,255,0.3); font-size: 12px; }

        .banner {
          margin: 0 80px 80px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          height: 320px;
          display: flex;
          align-items: center;
        }
        .banner-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
        }
        .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(7,31,46,0.95) 0%, rgba(7,31,46,0.6) 50%, transparent 100%);
        }
        .banner-content { position: relative; z-index: 1; padding: 0 60px; }
        .banner-tag {
          color: #1a8fa0;
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
        .banner-btn {
          background: #1a8fa0;
          color: #071f2e;
          padding: 15px 30px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }
        .banner-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(26,143,160,0.4);
        }

        .footer {
          background: #0a2535;
          border-top: 1px solid rgba(26,143,160,0.1);
          padding: 40px 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(255,255,255,0.3);
          font-size: 14px;
        }
        .footer-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .footer-logo-box {
          width: 32px; height: 32px;
          background: #1a8fa0;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-weight: bold; color: #071f2e; font-size: 16px;
        }
        .footer-logo-text { color: white; font-weight: 600; font-size: 16px; }
        .loading-state { text-align: center; padding: 80px; color: rgba(255,255,255,0.3); font-size: 16px; }

        /* ── BENTO GRID ── */
.bento { padding: 60px 80px 0; background: #071f2e; }
.bento-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 1fr;
  grid-template-rows: 280px 280px;
  gap: 16px;
}
.bento-card {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  background: #0a2535;
  border: 1px solid rgba(26,143,160,0.1);
  text-decoration: none;
  display: block;
  transition: all 0.3s;
}
.bento-card:hover { transform: scale(1.02); border-color: rgba(26,143,160,0.35); }
.bento-card img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
}
.bento-card.tall { grid-row: span 2; }
.bento-card.wide { grid-column: span 2; }
.bento-label {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(7,31,46,0.9) 0%, transparent 100%);
}
.bento-num {
  color: rgba(255,255,255,0.4);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
}
.bento-title {
  color: white;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.5px;
}
.bento-arrow {
  position: absolute;
  bottom: 20px; right: 20px;
  width: 36px; height: 36px;
  background: white;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #071f2e;
  font-size: 16px;
  font-weight: 700;
}
  /* ── BENTO ANIMATIONS ── */
.bento-card {
  opacity: 0;
  transform: translateY(30px);
  animation: bentofadeUp 0.5s ease forwards;
  transform-style: preserve-3d;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.bento-card:nth-child(1) { animation-delay: 0.05s; }
.bento-card:nth-child(2) { animation-delay: 0.15s; }
.bento-card:nth-child(3) { animation-delay: 0.25s; }
.bento-card:nth-child(4) { animation-delay: 0.35s; }
.bento-card:nth-child(5) { animation-delay: 0.45s; }
@keyframes bentofadeUp {
  to { opacity: 1; transform: translateY(0); }
}
.bento-card:hover {
  transform: perspective(800px) rotateX(-4deg) rotateY(4deg) scale(1.03) !important;
  box-shadow: 0 24px 50px rgba(0,0,0,0.5) !important;
  border-color: rgba(26,143,160,0.5) !important;
}
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section className="hero">
        <img
          src="/hero-headphones.jpg"
          alt="Hero Background"
          className="hero-bg"
        />
        {heroProduct?.image && (
          <img
            key={heroIndex}
            src={heroProduct.image}
            alt=""
            className={`hero-bg${fading ? " fading" : ""}`}
          />
        )}
        <div className="hero-overlay" />
        <div className="hero-accent-lines">
          <span />
          <span />
        </div>

        {heroProduct && (
          <div className={`hero-price-tag${fading ? " fading" : ""}`}>
            <div className="hero-price-label">Starting from</div>
            <div className="hero-price-value">$350</div>
          </div>
        )}

        <div className="hero-content">
          <div className="hero-left">
            <h1>
              Built for people who
              <br />
              rely on their tech.
            </h1>
          </div>
          <div className="hero-right-actions">
            {featuredProducts.length > 1 && (
              <div className="hero-dots">
                {featuredProducts.map((_, i) => (
                  <button
                    key={i}
                    className={`hero-dot${i === heroIndex ? " active" : ""}`}
                    onClick={() => {
                      setFading(true);
                      setTimeout(() => {
                        setHeroIndex(i);
                        setFading(false);
                      }, 400);
                    }}
                  />
                ))}
              </div>
            )}
            <Link href="/products" className="btn-primary">
              Shop Collection ..
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
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

      {/* ── BENTO GRID ── */}
      <div className="bento">
        <div className="bento-grid">
          {/* tall card — headphones */}
          <Link href="/products?category=audio" className="bento-card tall">
            <img
              src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80"
              alt="Audio"
            />
            <div className="bento-label">
              <div className="bento-num">// 01</div>
              <div className="bento-title">
                Premium
                <br />
                Audio
              </div>
            </div>
            <div className="bento-arrow">↗</div>
          </Link>

          {/* top middle — accessories */}
          <Link href="/products?category=accessories" className="bento-card">
            <img
              src="https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=800&q=80"
              alt="Accessories"
            />
            <div className="bento-label">
              <div className="bento-num">// 02</div>
              <div className="bento-title">Accessories</div>
            </div>
            <div className="bento-arrow">↗</div>
          </Link>

          {/* top right — laptops */}
          <Link href="/products?category=laptops" className="bento-card">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
              alt="Laptops"
            />
            <div className="bento-label">
              <div className="bento-num">// 03</div>
              <div className="bento-title">Laptops</div>
            </div>
            <div className="bento-arrow">↗</div>
          </Link>

          {/* bottom middle — airpods */}
          <Link href="/products?category=audio" className="bento-card">
            <img
              src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80"
              alt="Earbuds"
            />
            <div className="bento-label">
              <div className="bento-num">// 04</div>
              <div className="bento-title">
                Sound
                <br />
                Perfection
              </div>
            </div>
            <div className="bento-arrow">↗</div>
          </Link>

          {/* bottom right — phones */}
          <Link href="/products?category=smartphones" className="bento-card">
            <img
              src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"
              alt="Phones"
            />
            <div className="bento-label">
              <div className="bento-num">// 05</div>
              <div className="bento-title">
                New Series
                <br />
                iPhone 15 Pro
              </div>
            </div>
            <div className="bento-arrow">↗</div>
          </Link>
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-tag">Featured</div>
            <h2 className="section-title">Latest Products</h2>
          </div>
          <Link href="/products" className="view-all">
            View All Products →
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="loading-state">No products yet. Check back soon!</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="product-card"
              >
                <div className="product-image-wrap">
                  {product.image ? (
                    <>
                      <img src={product.image} alt={product.name} />
                      <div className="product-overlay" />
                    </>
                  ) : (
                    "📦"
                  )}
                </div>
                <div className="product-info">
                  <div className="product-cat">
                    {product.category_name || "Electronics"}
                  </div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-footer">
                    <div className="product-price">
                      ${product.price}
                      <span>USD</span>
                    </div>
                    <div className="product-stock">{product.stock} left</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── BANNER ── */}
      <div className="banner">
        <img
          src="https://images.unsplash.com/photo-1709859071282-9982d4d7fe81?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="iPhone"
          className="banner-bg"
        />

        <div className="banner-overlay" />
        <div className="banner-content">
          <div className="banner-tag">✦ New Arrival</div>
          <div className="banner-title">
            The New iPhone
            <br />
            is Here.
          </div>
          <Link href="/products" className="banner-btn">
            Shop Now →
          </Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <Link href="/" className="footer-logo">
          <div className="footer-logo-box">S</div>
          <span className="footer-logo-text">ShopFlow</span>
        </Link>
        <span>© 2026 ShopFlow. Built with passion in Morocco 🇲🇦</span>
      </footer>
    </>
  );
}
