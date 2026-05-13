'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/store/Navbar';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersAPI } from '@/lib/api';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, count } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [showAddress, setShowAddress] = useState(false);

  const shipping = total >= 99 ? 0 : 9.99;
  const finalTotal = total + shipping;

  const handleCheckout = async () => {
    if (!user) { router.push('/login'); return; }
    if (!address.trim()) { setShowAddress(true); return; }
    setLoading(true);
    setError('');
    const res = await ordersAPI.create({
      items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      shipping_address: address,
    });
    setLoading(false);
    if (res.success) {
      clearCart();
      router.push('/orders');
    } else {
      setError(res.message || 'Checkout failed');
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #071f2e; font-family: Inter, sans-serif; }

        .page { padding: 10px 60px 80px; max-width: 1400px; margin: 0 auto; }

        .page-title {
          color: white; font-size: 28px; font-weight: 800;
          letter-spacing: -0.5px; margin-bottom: 8px;
        }
        .page-sub {
          color: rgba(255,255,255,0.35); font-size: 14px; margin-bottom: 32px;
        }
        .page-sub span { color: #1a8fa0; font-weight: 600; }

        /* ── LAYOUT ── */
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 28px;
          align-items: start;
        }

        /* ── CART ITEMS ── */
        .cart-items { display: flex; flex-direction: column; gap: 12px; }

        .cart-item {
          background: #0a2535;
          border: 1px solid rgba(26,143,160,0.1);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: border-color 0.2s;
        }
        .cart-item:hover { border-color: rgba(26,143,160,0.25); }

        .item-img {
          width: 90px; height: 90px;
          border-radius: 12px;
          overflow: hidden;
          background: #0e3a4a;
          flex-shrink: 0;
        }
        .item-img img { width: 100%; height: 100%; object-fit: cover; }
        .item-img .no-img {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 32px;
        }

        .item-info { flex: 1; min-width: 0; }
        .item-cat {
          color: #1a8fa0; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;
        }
        .item-name {
          color: white; font-size: 15px; font-weight: 700;
          margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .item-price {
          color: rgba(255,255,255,0.45); font-size: 13px;
        }
        .item-price span { color: #1a8fa0; font-weight: 600; }

        .item-controls {
          display: flex; align-items: center; gap: 16px; flex-shrink: 0;
        }
        .qty-wrap {
          display: flex; align-items: center;
          background: #071f2e;
          border: 1px solid rgba(26,143,160,0.2);
          border-radius: 10px; overflow: hidden;
        }
        .qty-btn {
          width: 36px; height: 36px;
          background: transparent; border: none;
          color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .qty-btn:hover { background: rgba(26,143,160,0.1); }
        .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .qty-num {
          width: 40px; text-align: center;
          color: white; font-size: 14px; font-weight: 700;
          border-left: 1px solid rgba(26,143,160,0.15);
          border-right: 1px solid rgba(26,143,160,0.15);
          padding: 6px 0;
        }

        .item-total {
          color: white; font-size: 18px; font-weight: 800;
          min-width: 80px; text-align: right;
        }

        .remove-btn {
          background: rgba(255,71,87,0.08);
          border: 1px solid rgba(255,71,87,0.2);
          border-radius: 8px;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #ff4757;
          transition: all 0.2s;
        }
        .remove-btn:hover { background: rgba(255,71,87,0.2); }

        /* ── ORDER SUMMARY ── */
        .summary {
          background: #0a2535;
          border: 1px solid rgba(26,143,160,0.12);
          border-radius: 20px;
          padding: 24px;
          position: sticky;
          top: 160px;
        }
        .summary-title {
          color: white; font-size: 18px; font-weight: 800;
          margin-bottom: 20px; letter-spacing: -0.3px;
        }
        .summary-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 12px;
        }
        .summary-label { color: rgba(255,255,255,0.45); font-size: 14px; }
        .summary-value { color: white; font-size: 14px; font-weight: 600; }
        .summary-value.free { color: #1a8fa0; }
        .summary-divider { height: 1px; background: rgba(26,143,160,0.12); margin: 16px 0; }
        .summary-total-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px;
        }
        .summary-total-label { color: white; font-size: 16px; font-weight: 700; }
        .summary-total-value { color: white; font-size: 24px; font-weight: 900; }

        /* shipping notice */
        .shipping-notice {
          background: rgba(26,143,160,0.08);
          border: 1px solid rgba(26,143,160,0.2);
          border-radius: 10px;
          padding: 10px 14px;
          color: rgba(255,255,255,0.6);
          font-size: 12px;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .shipping-notice span { color: #1a8fa0; font-weight: 600; }

        /* address input */
        .address-wrap { margin-bottom: 14px; }
        .address-label {
          color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
        }
        .address-input {
          width: 100%;
          background: #071f2e;
          border: 1px solid rgba(26,143,160,0.2);
          border-radius: 10px;
          padding: 10px 14px;
          color: white; font-size: 13px;
          outline: none; font-family: Inter, sans-serif;
          transition: border-color 0.2s;
          resize: none;
        }
        .address-input:focus { border-color: #1a8fa0; box-shadow: 0 0 0 3px rgba(26,143,160,0.1); }
        .address-input::placeholder { color: rgba(255,255,255,0.2); }

        .checkout-btn {
          width: 100%; padding: 15px;
          background: #1a8fa0; border: none; border-radius: 12px;
          color: #071f2e; font-size: 15px; font-weight: 800;
          cursor: pointer; transition: all 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: Inter, sans-serif; letter-spacing: 0.3px;
        }
        .checkout-btn:hover { background: #0e6b7a; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(26,143,160,0.4); }
        .checkout-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .continue-btn {
          width: 100%; padding: 12px;
          background: transparent;
          border: 1px solid rgba(26,143,160,0.2);
          border-radius: 12px;
          color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s; margin-top: 10px;
          text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          font-family: Inter, sans-serif;
        }
        .continue-btn:hover { border-color: #1a8fa0; color: #1a8fa0; }

        .error-msg {
          background: rgba(255,71,87,0.1);
          border: 1px solid rgba(255,71,87,0.3);
          border-radius: 10px; padding: 10px 14px;
          color: #ff4757; font-size: 13px; margin-bottom: 14px;
        }

        /* ── EMPTY STATE ── */
        .empty {
          text-align: center; padding: 100px 60px;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
        }
        .empty-icon {
          width: 80px; height: 80px;
          background: rgba(26,143,160,0.08);
          border: 1px solid rgba(26,143,160,0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #1a8fa0;
        }
        .empty-title { color: white; font-size: 22px; font-weight: 800; }
        .empty-sub { color: rgba(255,255,255,0.35); font-size: 14px; }
        .empty-btn {
          background: #1a8fa0; color: #071f2e;
          padding: 13px 32px; border-radius: 12px;
          font-weight: 700; font-size: 14px; text-decoration: none;
          transition: all 0.3s; display: inline-flex; align-items: center; gap: 8px;
        }
        .empty-btn:hover { background: #0e6b7a; transform: translateY(-2px); }

        .footer {
          background: #0a2535;
          border-top: 1px solid rgba(26,143,160,0.1);
          padding: 24px 60px; text-align: center;
          color: rgba(255,255,255,0.3); font-size: 14px;
        }
      `}</style>

      <Navbar />

      {items.length === 0 ? (
        <div className= "empty" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="empty-icon"><ShoppingBag size={32} /></div>
          <div className="empty-title">Your cart is empty</div>
          <div className="empty-sub">Looks like you haven't added anything yet</div>
          <Link href="/products" className="empty-btn">
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="page">
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-sub">
            You have <span>{count} {count === 1 ? 'item' : 'items'}</span> in your cart
          </p>

          <div className="cart-layout">
            {/* ── ITEMS ── */}
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-img">
                    {item.image
                      ? <img src={item.image} alt={item.name} />
                      : <div className="no-img">📦</div>
                    }
                  </div>

                  <div className="item-info">
                    <div className="item-cat">{item.category_name || 'Electronics'}</div>
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">
                      <span>${item.price}</span> USD each
                    </div>
                  </div>

                  <div className="item-controls">
                    <div className="qty-wrap">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <Minus size={14} />
                      </button>
                      <div className="qty-num">{item.quantity}</div>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── SUMMARY ── */}
            <div className="summary">
              <div className="summary-title">Order Summary</div>

              <div className="summary-row">
                <span className="summary-label">Subtotal ({count} items)</span>
                <span className="summary-value">${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className={`summary-value ${shipping === 0 ? 'free' : ''}`}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {shipping > 0 && (
                <div className="shipping-notice">
                  <Tag size={13} />
                  Add <span>${(99 - total).toFixed(2)} more</span> for free shipping!
                </div>
              )}

              <div className="summary-divider" />

              <div className="summary-total-row">
                <span className="summary-total-label">Total</span>
                <span className="summary-total-value">${finalTotal.toFixed(2)}</span>
              </div>

              {error && <div className="error-msg">{error}</div>}

              {(showAddress || user) && (
                <div className="address-wrap">
                  <div className="address-label">Shipping Address</div>
                  <textarea
                    className="address-input"
                    rows={3}
                    placeholder="Enter your full shipping address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Processing...' : (
                  <>{user ? 'Place Order' : 'Login to Checkout'} <ArrowRight size={16} /></>
                )}
              </button>

              <Link href="/products" className="continue-btn">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
    <span>© 2026 ShopFlow. All rights reserved.</span>
    <div style={{ display: 'flex', gap: '24px' }}>
      <a href="/products" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px' }}>Products</a>
      <a href="/orders" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px' }}>Orders</a>
      <a href="/cart" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '13px' }}>Cart</a>
    </div>
    <span>Built with passion in Morocco 🇲🇦</span>
  </div>
</footer>
    </>
  );
}