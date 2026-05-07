'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/store/Navbar';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORY_SLUGS = {
  laptops: 'Laptops',
  smartphones: 'Smartphones',
  accessories: 'Accessories',
  audio: 'Audio',
  gaming: 'Gaming',
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Match URL slug to category id
  useEffect(() => {
    const slug = searchParams.get('category');
    if (slug && categories.length > 0) {
      const slugName = CATEGORY_SLUGS[slug];
      const match = categories.find(
        (c) => c.name.toLowerCase() === slugName?.toLowerCase()
      );
      setSelectedCategoryId(match ? String(match.id) : null);
    } else {
      setSelectedCategoryId(null);
    }
  }, [searchParams, categories]);

  // Load categories
  useEffect(() => {
    categoriesAPI.getAll().then((res) => {
      if (res.success) setCategories(res.data.categories);
    });
  }, []);

  // Load products
  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (selectedCategoryId) params.category_id = selectedCategoryId;

    productsAPI.getAll(params).then((res) => {
      if (res.success) {
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      }
      setLoading(false);
    });
  }, [page, search, selectedCategoryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a16; font-family: Inter, sans-serif; }
        .page-header {
          background: linear-gradient(135deg, #0d0d1a 0%, #16213e 100%);
          padding: 48px 80px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .page-title {
          color: white;
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 8px;
        }
        .page-subtitle {
          color: rgba(255,255,255,0.4);
          font-size: 15px;
        }
        .page-subtitle span { color: #00d084; font-weight: 600; }
        .content {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 32px;
          padding: 40px 80px;
          min-height: 70vh;
        }
        .sidebar-section { margin-bottom: 32px; }
        .sidebar-title {
          color: rgba(255,255,255,0.4);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #16213e;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 10px 14px;
          transition: all 0.3s;
        }
        .search-box:focus-within {
          border-color: #00d084;
          box-shadow: 0 0 0 3px rgba(0,208,132,0.1);
        }
        .search-box input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 14px;
          width: 100%;
          font-family: Inter, sans-serif;
        }
        .search-box input::placeholder { color: rgba(255,255,255,0.25); }
        .search-icon { color: rgba(255,255,255,0.3); flex-shrink: 0; }
        .cat-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cat-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          font-weight: 500;
          background: transparent;
          text-align: left;
          width: 100%;
          font-family: Inter, sans-serif;
        }
        .cat-item:hover {
          background: rgba(255,255,255,0.04);
          color: white;
        }
        .cat-item.active {
          background: rgba(0,208,132,0.08);
          border-color: rgba(0,208,132,0.2);
          color: #00d084;
        }
        .cat-count {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.3);
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .cat-item.active .cat-count {
          background: rgba(0,208,132,0.15);
          color: #00d084;
        }
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .results-count {
          color: rgba(255,255,255,0.4);
          font-size: 14px;
        }
        .results-count span { color: white; font-weight: 600; }
        .sort-select {
          background: #16213e;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 8px 14px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          outline: none;
          cursor: pointer;
          font-family: Inter, sans-serif;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        .product-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          overflow: hidden;
          transition: all 0.35s ease;
          text-decoration: none;
          display: block;
        }
        .product-card:hover {
          transform: translateY(-6px);
          border-color: rgba(0,208,132,0.25);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }
        .product-img {
          width: 100%;
          height: 190px;
          background: #16213e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 56px;
          overflow: hidden;
        }
        .product-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }
        .product-card:hover .product-img img { transform: scale(1.06); }
        .product-info { padding: 16px; }
        .product-cat {
          color: #00d084;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 6px;
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
          color: rgba(255,255,255,0.3);
          font-size: 12px;
          font-weight: 400;
          margin-left: 2px;
        }
        .stock-badge {
          font-size: 12px;
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 500;
        }
        .in-stock { background: rgba(0,208,132,0.1); color: #00d084; }
        .low-stock { background: rgba(246,201,14,0.1); color: #f6c90e; }
        .out-stock { background: rgba(255,71,87,0.1); color: #ff4757; }
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
        }
        .empty-icon { font-size: 56px; margin-bottom: 16px; }
        .empty-text { font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.5); }
        .skeleton {
          background: #16213e;
          border-radius: 18px;
          height: 280px;
          animation: shimmer 1.5s ease infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px 0;
        }
        .page-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.2s;
          font-family: Inter, sans-serif;
          font-size: 14px;
        }
        .page-btn:hover { border-color: #00d084; color: #00d084; }
        .page-btn.active {
          background: #00d084;
          border-color: #00d084;
          color: #0a0a16;
          font-weight: 700;
        }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .footer {
          background: #0d0d1a;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 30px 80px;
          text-align: center;
          color: rgba(255,255,255,0.3);
          font-size: 14px;
        }
      `}</style>

      <Navbar />

      <div className="page-header">
        <h1 className="page-title">
          {searchParams.get('category')
            ? CATEGORY_SLUGS[searchParams.get('category')] || 'Products'
            : 'All Products'}
        </h1>
        <p className="page-subtitle">
          Showing <span>{pagination?.total || 0} products</span> in our store
        </p>
      </div>

      <div className="content">
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Search</div>
            <form onSubmit={handleSearch}>
              <div className="search-box">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
            </form>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Categories</div>
            <div className="cat-list">
              <button
                className={`cat-item ${!selectedCategoryId ? 'active' : ''}`}
                onClick={() => { setSelectedCategoryId(null); setPage(1); }}
              >
                All Products
                <span className="cat-count">{pagination?.total || 0}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`cat-item ${selectedCategoryId === String(cat.id) ? 'active' : ''}`}
                  onClick={() => { setSelectedCategoryId(String(cat.id)); setPage(1); }}
                >
                  {cat.name}
                  <span className="cat-count">0</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main>
          <div className="toolbar">
            <p className="results-count">
              <span>{pagination?.total || 0}</span> products found
            </p>
            <select className="sort-select">
              <option>Latest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="products-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" />
              ))
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <div className="empty-text">No products found</div>
              </div>
            ) : (
              products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="product-card">
                  <div className="product-img">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : '📦'}
                  </div>
                  <div className="product-info">
                    <div className="product-cat">{product.category_name || 'Electronics'}</div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-footer">
                      <div className="product-price">
                        ${product.price}<span>USD</span>
                      </div>
                      <span className={`stock-badge ${product.stock === 0 ? 'out-stock' : product.stock < 5 ? 'low-stock' : 'in-stock'}`}>
                        {product.stock === 0 ? 'Out of Stock' : product.stock < 5 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`page-btn ${page === p ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="page-btn"
                onClick={() => setPage(p => p + 1)}
                disabled={page === pagination.pages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </main>
      </div>

      <footer className="footer">
        © 2026 ShopFlow. Built with passion  in Morocco 🇲🇦
      </footer>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0a0a16', minHeight: '100vh' }} />}>
      <ProductsContent />
    </Suspense>
  );
}