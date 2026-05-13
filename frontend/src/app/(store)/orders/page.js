'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/store/Navbar';
import { useAuth } from '@/context/AuthContext';
import { ordersAPI } from '@/lib/api';
import { ShoppingBag, MapPin, Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';

const TABS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_STEPS = {
  pending:    1,
  processing: 2,
  shipped:    3,
  delivered:  4,
  cancelled:  0,
};

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#f6c90e', bg: 'rgba(246,201,14,0.1)' },
  processing: { label: 'Processing', color: '#1a8fa0', bg: 'rgba(26,143,160,0.1)' },
  shipped:    { label: 'Shipped',    color: '#7ab3b8', bg: 'rgba(122,179,184,0.1)' },
  delivered:  { label: 'Delivered',  color: '#1a8fa0', bg: 'rgba(26,143,160,0.15)' },
  cancelled:  { label: 'Cancelled',  color: '#ff4757', bg: 'rgba(255,71,87,0.1)' },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    ordersAPI.getMyOrders().then((res) => {
      if (res.success) setOrders(res.data.orders);
      setLoading(false);
    });
  }, [user]);

  const filtered = activeTab === 'All'
    ? orders
    : orders.filter(o => o.status?.toLowerCase() === activeTab.toLowerCase());

  const countByStatus = (s) => orders.filter(o => o.status?.toLowerCase() === s.toLowerCase()).length;

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #071f2e; font-family: Inter, sans-serif; }

        .page {
          padding: 32px 60px 80px;
          max-width: 900px;
          margin: 0 auto;
          min-height: calc(100vh - 200px);
        }

        .page-title {
          color: white; font-size: 28px; font-weight: 800;
          letter-spacing: -0.5px; margin-bottom: 24px;
        }

        /* ── TABS ── */
        .tabs {
          display: flex;
          background: #0a2535;
          border: 1px solid rgba(26,143,160,0.12);
          border-radius: 14px;
          padding: 6px;
          gap: 4px;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .tabs::-webkit-scrollbar { display: none; }
        .tab {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 10px;
          border: none; background: transparent;
          color: rgba(255,255,255,0.45); font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
          font-family: Inter, sans-serif;
        }
        .tab:hover { color: white; background: rgba(26,143,160,0.08); }
        .tab.active { background: #1a8fa0; color: #071f2e; font-weight: 700; }
        .tab-count {
          background: rgba(255,255,255,0.15);
          color: inherit;
          font-size: 11px; font-weight: 700;
          padding: 1px 7px; border-radius: 100px;
        }
        .tab.active .tab-count { background: rgba(7,31,46,0.2); }

        /* ── ORDER CARD ── */
        .order-card {
          background: #0a2535;
          border: 1px solid rgba(26,143,160,0.1);
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .order-card:hover {
          border-color: rgba(26,143,160,0.3);
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        }

        /* order top bar */
        .order-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(26,143,160,0.08);
        }
        .order-id-wrap { display: flex; flex-direction: column; gap: 2px; }
        .order-id { color: white; font-size: 14px; font-weight: 700; }
        .order-id span { color: rgba(255,255,255,0.35); font-weight: 400; }
        .order-date { color: rgba(255,255,255,0.35); font-size: 12px; }
        .order-right { display: flex; align-items: center; gap: 12px; }
        .order-total { color: white; font-size: 18px; font-weight: 800; }
        .status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 100px;
          font-size: 12px; font-weight: 600;
        }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; }

        /* ── PROGRESS BAR ── */
        .progress-wrap {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(26,143,160,0.08);
        }
        .progress-track {
          display: flex; align-items: center; justify-content: space-between;
          position: relative;
        }
        .progress-line {
          position: absolute;
          top: 14px; left: 0; right: 0;
          height: 2px; background: rgba(26,143,160,0.15);
          z-index: 0;
        }
        .progress-line-fill {
          position: absolute;
          top: 14px; left: 0;
          height: 2px; background: #1a8fa0;
          z-index: 1; transition: width 0.5s ease;
        }
        .progress-step {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          position: relative; z-index: 2;
        }
        .step-circle {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; transition: all 0.3s;
        }
        .step-circle.done {
          background: #1a8fa0; color: #071f2e;
          box-shadow: 0 0 0 3px rgba(26,143,160,0.2);
        }
        .step-circle.current {
          background: #071f2e; color: #1a8fa0;
          border: 2px solid #1a8fa0;
          box-shadow: 0 0 0 3px rgba(26,143,160,0.2);
        }
        .step-circle.upcoming {
          background: #071f2e; color: rgba(255,255,255,0.2);
          border: 2px solid rgba(26,143,160,0.2);
        }
        .step-label {
          color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 500;
          white-space: nowrap; text-align: center;
        }
        .step-label.active { color: #1a8fa0; font-weight: 600; }

        /* ── ORDER ITEMS ── */
        .order-items { padding: 0 20px; }
        .order-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(26,143,160,0.06);
        }
        .order-item:last-child { border-bottom: none; }
        .item-img {
          width: 64px; height: 64px; border-radius: 10px;
          overflow: hidden; background: #0e3a4a; flex-shrink: 0;
        }
        .item-img img { width: 100%; height: 100%; object-fit: cover; }
        .item-img .emoji {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center; font-size: 26px;
        }
        .item-info { flex: 1; min-width: 0; }
        .item-name {
          color: white; font-size: 14px; font-weight: 600; margin-bottom: 3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .item-meta { color: rgba(255,255,255,0.35); font-size: 12px; }
        .item-price { color: #1a8fa0; font-size: 15px; font-weight: 800; flex-shrink: 0; }

        /* ── ORDER FOOTER ── */
        .order-bottom {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 20px;
          background: rgba(26,143,160,0.04);
          border-top: 1px solid rgba(26,143,160,0.08);
        }
        .order-address {
          display: flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.35); font-size: 12px;
        }
        .total-label { color: rgba(255,255,255,0.5); font-size: 13px; }
        .total-value { color: white; font-size: 16px; font-weight: 800; margin-left: 8px; }

        /* ── EMPTY ── */
        .empty {
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 16px;
          min-height: calc(100vh - 300px);
        }
        .empty-icon {
          width: 80px; height: 80px;
          background: rgba(26,143,160,0.08);
          border: 1px solid rgba(26,143,160,0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center; color: #1a8fa0;
        }
        .empty-title { color: white; font-size: 20px; font-weight: 800; }
        .empty-sub { color: rgba(255,255,255,0.35); font-size: 14px; }
        .empty-btn {
          background: #1a8fa0; color: #071f2e;
          padding: 12px 28px; border-radius: 12px;
          font-weight: 700; font-size: 14px; text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          transition: all 0.3s;
        }
        .empty-btn:hover { background: #0e6b7a; transform: translateY(-2px); }

        /* ── SKELETON ── */
        .skeleton {
          background: #0a2535; border-radius: 18px; margin-bottom: 16px;
          animation: shimmer 1.5s ease infinite;
        }
        @keyframes shimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        .footer {
          background: #0a2535;
          border-top: 1px solid rgba(26,143,160,0.1);
          padding: 24px 60px;
        }
        .footer-inner {
          display: flex; justify-content: space-between; align-items: center;
          max-width: 1400px; margin: 0 auto;
          color: rgba(255,255,255,0.3); font-size: 13px;
        }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a { color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: #1a8fa0; }
      `}</style>

      <Navbar />

      {loading ? (
        <div style={{ padding: '32px 60px', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ height: '36px', width: '160px', background: '#0a2535', borderRadius: '8px', marginBottom: '24px', animation: 'shimmer 1.5s ease infinite' }} />
          <div style={{ height: '56px', background: '#0a2535', borderRadius: '14px', marginBottom: '24px', animation: 'shimmer 1.5s ease infinite' }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '200px' }} />
          ))}
        </div>
      ) : (
        <div className="page">
          <h1 className="page-title">My Orders</h1>

          {/* ── TABS ── */}
          <div className="tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {tab !== 'All' && countByStatus(tab) > 0 && (
                  <span className="tab-count">{countByStatus(tab)}</span>
                )}
                {tab === 'All' && orders.length > 0 && (
                  <span className="tab-count">{orders.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── ORDERS ── */}
          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><ShoppingBag size={32} /></div>
              <div className="empty-title">No {activeTab === 'All' ? '' : activeTab.toLowerCase()} orders</div>
              <div className="empty-sub">
                {activeTab === 'All' ? "You haven't placed any orders yet" : `No orders with status "${activeTab}"`}
              </div>
              {activeTab === 'All' && <Link href="/products" className="empty-btn">Shop Now →</Link>}
            </div>
          ) : (
            filtered.map((order) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const step = STATUS_STEPS[order.status] || 1;
              const isCancelled = order.status === 'cancelled';
              const steps = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
              const fillWidth = isCancelled ? '0%' : `${((step - 1) / 3) * 100}%`;

              return (
                <div key={order.id} className="order-card">

                  {/* top bar */}
                  <div className="order-topbar">
                    <div className="order-id-wrap">
                      <div className="order-id">Order <span>#</span>{String(order.id).padStart(5, '0')}</div>
                      <div className="order-date">
                        {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="order-right">
                      <span className="status-badge" style={{ background: status.bg, color: status.color }}>
                        <span className="status-dot" style={{ background: status.color }} />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* progress bar */}
                  {!isCancelled && (
                    <div className="progress-wrap">
                      <div className="progress-track">
                        <div className="progress-line" />
                        <div className="progress-line-fill" style={{ width: fillWidth }} />
                        {steps.map((s, i) => {
                          const stepNum = i + 1;
                          const isDone = step > stepNum;
                          const isCurrent = step === stepNum;
                          return (
                            <div key={s} className="progress-step">
                              <div className={`step-circle ${isDone ? 'done' : isCurrent ? 'current' : 'upcoming'}`}>
                                {isDone ? '✓' : stepNum}
                              </div>
                              <span className={`step-label ${isCurrent || isDone ? 'active' : ''}`}>{s}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* items */}
                  <div className="order-items">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <div className="item-img">
                          {item.image
                            ? <img src={item.image} alt={item.product_name} />
                            : <div className="emoji">📦</div>
                          }
                        </div>
                        <div className="item-info">
                          <div className="item-name">{item.product_name || item.name}</div>
                          <div className="item-meta">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</div>
                        </div>
                        <div className="item-price">${(item.quantity * item.price).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  {/* bottom */}
                  <div className="order-bottom">
                    <div className="order-address">
                      <MapPin size={13} />
                      {order.shipping_address || 'No address'}
                    </div>
                    <div>
                      <span className="total-label">Total:</span>
                      <span className="total-value">${Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      <footer className="footer">
        <div className="footer-inner">
          <span>© 2026 ShopFlow. All rights reserved.</span>
          <div className="footer-links">
            <a href="/products">Products</a>
            <a href="/orders">Orders</a>
            <a href="/cart">Cart</a>
          </div>
          <span>Built with passion in Morocco 🇲🇦</span>
        </div>
      </footer>
    </>
  );
}