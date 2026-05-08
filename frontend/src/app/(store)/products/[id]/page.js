'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/store/Navbar';
import { productsAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, ArrowLeft, Package, Shield, Truck, RotateCcw } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    productsAPI.getById(id).then((res) => {
      if (res.success) {
        setProduct(res.data.product);
        // fetch related by same category
        productsAPI.getAll({ limit: 4, category_id: res.data.product.category_id }).then((r) => {
          if (r.success) {
            setRelated(r.data.products.filter((p) => p.id !== res.data.product.id).slice(0, 4));
          }
        });
      }
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stockStatus = product?.stock === 0 ? 'out' : product?.stock < 5 ? 'low' : 'in';

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #071f2e; font-family: Inter, sans-serif; }

        .page { padding: 40px 60px 80px; max-width: 1400px; margin: 0 auto; }

        /* breadcrumb */
        .breadcrumb {
          display: flex; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.35); font-size: 13px; margin-bottom: 32px;
        }
        .breadcrumb a { color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; }
        .breadcrumb a:hover { color: #1a8fa0; }
        .breadcrumb span { color: white; }

        /* main product section */
        .product-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 80px;
          align-items: start;
        }

        /* image side */
        .product-image-wrap {
          border-radius: 24px;
          overflow: hidden;
          background: #0a2535;
          border: 1px solid rgba(26,143,160,0.15);
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .product-image-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .product-image-wrap .no-img {
          font-size: 80px;
        }

        /* info side */
        .product-info { display: flex; flex-direction: column; gap: 24px; }
        .product-cat {
          color: #1a8fa0; font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1.5px;
        }
        .product-name {
          color: white; font-size: 36px; font-weight: 800;
          line-height: 1.15; letter-spacing: -1px;
        }
        .product-price-row {
          display: flex; align-items: baseline; gap: 8px;
        }
        .product-price {
          color: white; font-size: 40px; font-weight: 900;
        }
        .product-price-currency {
          color: #1a8fa0; font-size: 16px; font-weight: 600;
        }
        .stock-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 600;
        }
        .stock-badge .dot {
          width: 6px; height: 6px; border-radius: 50%;
        }
        .in-stock { background: rgba(26,143,160,0.1); color: #1a8fa0; }
        .in-stock .dot { background: #1a8fa0; }
        .low-stock { background: rgba(246,201,14,0.1); color: #f6c90e; }
        .low-stock .dot { background: #f6c90e; }
        .out-stock { background: rgba(255,71,87,0.1); color: #ff4757; }
        .out-stock .dot { background: #ff4757; }

        .divider {
          height: 1px; background: rgba(26,143,160,0.12);
        }

        .product-desc {
          color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.8;
        }

        /* quantity */
        .qty-label {
          color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;
        }
        .qty-wrap {
          display: flex; align-items: center; gap: 0;
          background: #0a2535;
          border: 1px solid rgba(26,143,160,0.2);
          border-radius: 12px;
          overflow: hidden;
          width: fit-content;
        }
        .qty-btn {
          width: 44px; height: 44px;
          background: transparent; border: none;
          color: white; font-size: 20px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
          font-family: Inter, sans-serif;
        }
        .qty-btn:hover { background: rgba(26,143,160,0.1); }
        .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .qty-num {
          width: 52px; text-align: center;
          color: white; font-size: 16px; font-weight: 700;
          border-left: 1px solid rgba(26,143,160,0.15);
          border-right: 1px solid rgba(26,143,160,0.15);
          padding: 10px 0;
        }

        /* add to cart */
        .add-btn {
          width: 100%;
          padding: 16px;
          background: #1a8fa0;
          border: none;
          border-radius: 14px;
          color: #071f2e;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          letter-spacing: 0.3px;
          font-family: Inter, sans-serif;
        }
        .add-btn:hover { background: #0e6b7a; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(26,143,160,0.4); }
        .add-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .add-btn.added { background: #0e6b7a; }

        .view-cart-btn {
          width: 100%;
          padding: 14px;
          background: transparent;
          border: 1px solid rgba(26,143,160,0.3);
          border-radius: 14px;
          color: #1a8fa0;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: Inter, sans-serif;
        }
        .view-cart-btn:hover { background: rgba(26,143,160,0.08); border-color: #1a8fa0; }

        /* trust badges */
        .trust-badges {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .trust-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          background: #0a2535;
          border: 1px solid rgba(26,143,160,0.1);
          border-radius: 12px;
          text-align: center;
        }
        .trust-icon { color: #1a8fa0; }
        .trust-title { color: white; font-size: 12px; font-weight: 700; }
        .trust-sub { color: rgba(255,255,255,0.35); font-size: 11px; }

        /* related products */
        .related { margin-top: 80px; }
        .related-title {
          color: white; font-size: 24px; font-weight: 800;
          letter-spacing: -0.5px; margin-bottom: 6px;
        }
        .related-sub {
          color: rgba(255,255,255,0.35); font-size: 14px; margin-bottom: 28px;
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .related-card {
          background: #0a2535;
          border: 1px solid rgba(26,143,160,0.08);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.3s;
        }
        .related-card:hover {
          border-color: rgba(26,143,160,0.35);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
        }
        .related-img {
          width: 100%; height: 180px;
          background: #0e3a4a; overflow: hidden;
        }
        .related-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .related-card:hover .related-img img { transform: scale(1.05); }
        .related-info { padding: 14px; }
        .related-name { color: white; font-size: 14px; font-weight: 600; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .related-price { color: #1a8fa0; font-size: 16px; font-weight: 800; }

        /* skeleton */
        .skeleton-page { padding: 40px 60px; }
        .skeleton-box {
          background: #0a2535;
          border-radius: 16px;
          animation: shimmer 1.5s ease infinite;
        }
        @keyframes shimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        /* footer */
        .footer {
          background: #0a2535;
          border-top: 1px solid rgba(26,143,160,0.1);
          padding: 30px 60px;
          text-align: center;
          color: rgba(255,255,255,0.3);
          font-size: 14px;
        }
      `}</style>

      <Navbar />

      {loading ? (
        <div className="skeleton-page">
          <div className="skeleton-box" style={{ height: '32px', width: '200px', marginBottom: '32px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            <div className="skeleton-box" style={{ height: '500px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="skeleton-box" style={{ height: '24px', width: '120px' }} />
              <div className="skeleton-box" style={{ height: '48px' }} />
              <div className="skeleton-box" style={{ height: '56px', width: '160px' }} />
              <div className="skeleton-box" style={{ height: '100px' }} />
              <div className="skeleton-box" style={{ height: '56px' }} />
            </div>
          </div>
        </div>
      ) : !product ? (
        <div style={{ textAlign: 'center', padding: '120px 60px', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
          <div style={{ fontSize: '20px', color: 'white', fontWeight: '700', marginBottom: '8px' }}>Product not found</div>
          <Link href="/products" style={{ color: '#1a8fa0' }}>← Back to products</Link>
        </div>
      ) : (
        <div className="page">
          {/* breadcrumb */}
          <div className="breadcrumb">
            <a href="/">Home</a> <span>›</span>
            <a href="/products">Products</a> <span>›</span>
            {product.category_name && <><a href={`/products?category=${product.category_name.toLowerCase()}`}>{product.category_name}</a> <span>›</span></>}
            <span>{product.name}</span>
          </div>

          {/* main */}
          <div className="product-main">
            {/* image */}
            <div className="product-image-wrap">
              {product.image
                ? <img src={product.image} alt={product.name} />
                : <div className="no-img">📦</div>
              }
            </div>

            {/* info */}
            <div className="product-info">
              <div className="product-cat">{product.category_name || 'Electronics'}</div>
              <h1 className="product-name">{product.name}</h1>

              <div className="product-price-row">
                <div className="product-price">${product.price}</div>
                <div className="product-price-currency">USD</div>
              </div>

              <div>
                <span className={`stock-badge ${stockStatus === 'out' ? 'out-stock' : stockStatus === 'low' ? 'low-stock' : 'in-stock'}`}>
                  <span className="dot" />
                  {stockStatus === 'out' ? 'Out of Stock' : stockStatus === 'low' ? `Only ${product.stock} left` : 'In Stock'}
                </span>
              </div>

              <div className="divider" />

              <p className="product-desc">{product.description}</p>

              <div className="divider" />

              {/* quantity */}
              {product.stock > 0 && (
                <div>
                  <div className="qty-label">Quantity</div>
                  <div className="qty-wrap">
                    <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                    <div className="qty-num">{quantity}</div>
                    <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</button>
                  </div>
                </div>
              )}

              {/* buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  className={`add-btn ${added ? 'added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart size={20} />
                  {added ? '✓ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <Link href="/cart" className="view-cart-btn">
                  View Cart
                </Link>
              </div>

              {/* trust badges */}
              <div className="trust-badges">
                <div className="trust-item">
                  <Truck size={22} className="trust-icon" />
                  <div className="trust-title">Free Shipping</div>
                  <div className="trust-sub">On orders over $99</div>
                </div>
                <div className="trust-item">
                  <RotateCcw size={22} className="trust-icon" />
                  <div className="trust-title">Free Returns</div>
                  <div className="trust-sub">30-day return policy</div>
                </div>
                <div className="trust-item">
                  <Shield size={22} className="trust-icon" />
                  <div className="trust-title">2 Year Warranty</div>
                  <div className="trust-sub">Full coverage</div>
                </div>
              </div>
            </div>
          </div>

          {/* related products */}
          {related.length > 0 && (
            <div className="related">
              <div className="related-title">Related Products</div>
              <div className="related-sub">You might also like these</div>
              <div className="related-grid">
                {related.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`} className="related-card">
                    <div className="related-img">
                      {p.image ? <img src={p.image} alt={p.name} /> : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '40px' }}>📦</span>}
                    </div>
                    <div className="related-info">
                      <div className="product-cat">{p.category_name}</div>
                      <div className="related-name">{p.name}</div>
                      <div className="related-price">${p.price}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <footer className="footer">
        © 2026 ShopFlow. Built with passion in Morocco 🇲🇦
      </footer>
    </>
  );
}