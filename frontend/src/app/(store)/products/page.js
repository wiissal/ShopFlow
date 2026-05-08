'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/store/Navbar';
import { productsAPI, categoriesAPI } from '@/lib/api';
import { Search, ChevronLeft, ChevronRight, Grid, List, SlidersHorizontal, X } from 'lucide-react';

const CATEGORY_SLUGS = {
  laptops: 'Laptops',
  smartphones: 'Phones',
  accessories: 'Accessories',
  audio: 'Audio',
  gaming: 'Gaming',
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const slug = searchParams.get('category');
    if (slug && categories.length > 0) {
      const slugName = CATEGORY_SLUGS[slug];
      const match = categories.find(c => c.name.toLowerCase() === slugName?.toLowerCase());
      setSelectedCategoryId(match ? String(match.id) : null);
      setSelectedCategoryName(match ? match.name : 'All');
    } else {
      setSelectedCategoryId(null);
      setSelectedCategoryName('All');
    }
  }, [searchParams, categories]);

  useEffect(() => {
    categoriesAPI.getAll().then((res) => {
      if (res.success) setCategories(res.data.categories);
    });
  }, []);

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

  const clearSearch = () => {
    setSearch('');
    setPage(1);
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #071f2e; font-family: Inter, sans-serif; }

        /* ── PAGE HEADER ── */
      
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.35);
          font-size: 13px;
          margin-bottom: 16px;
        }
        .breadcrumb a { color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; }
        .breadcrumb a:hover { color: #1a8fa0; }
        .breadcrumb span { color: white; }
        .page-title {
          color: white;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        /* ── FILTER BAR ── */
        .filter-bar {
          background: #0a2535;
          border-top: 1px solid rgba(26,143,160,0.1);
          border-bottom: 1px solid rgba(26,143,160,0.1);
          padding: 0 60px;
          display: flex;
          align-items: center;
          gap: 12px;
          height: 60px;
          position: sticky;
          top: 148px;
          z-index: 50;
          overflow-x: auto;
        }
        .filter-bar::-webkit-scrollbar { display: none; }
        .filter-label {
          color: rgba(255,255,255,0.4);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .filter-divider {
          width: 1px; height: 20px;
          background: rgba(26,143,160,0.2);
          flex-shrink: 0;
        }
        .cat-chip {
          padding: 6px 16px;
          border-radius: 100px;
          border: 1px solid rgba(26,143,160,0.2);
          background: transparent;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          font-family: Inter, sans-serif;
          flex-shrink: 0;
        }
        .cat-chip:hover { border-color: #1a8fa0; color: white; background: rgba(26,143,160,0.08); }
        .cat-chip.active { background: #1a8fa0; border-color: #1a8fa0; color: #071f2e; font-weight: 700; }

        /* search in filter bar */
        .filter-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #071f2e;
          border: 1px solid rgba(26,143,160,0.2);
          border-radius: 100px;
          padding: 6px 14px;
          transition: all 0.2s;
          flex-shrink: 0;
          min-width: 220px;
        }
        .filter-search:focus-within { border-color: #1a8fa0; box-shadow: 0 0 0 3px rgba(26,143,160,0.1); }
        .filter-search input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 13px;
          font-family: Inter, sans-serif;
          width: 100%;
        }
        .filter-search input::placeholder { color: rgba(255,255,255,0.25); }
        .clear-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); display: flex; padding: 0;
          transition: color 0.2s;
        }
        .clear-btn:hover { color: #ff4757; }

        /* right side of filter bar */
        .filter-bar-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .sort-select {
          background: #071f2e;
          border: 1px solid rgba(26,143,160,0.2);
          border-radius: 100px;
          padding: 6px 14px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          outline: none;
          cursor: pointer;
          font-family: Inter, sans-serif;
          transition: border-color 0.2s;
        }
        .sort-select:focus { border-color: #1a8fa0; }
        .view-toggle {
          display: flex;
          gap: 4px;
          background: #071f2e;
          border: 1px solid rgba(26,143,160,0.2);
          border-radius: 8px;
          padding: 4px;
        }
        .view-btn {
          width: 28px; height: 28px;
          border: none; background: transparent;
          color: rgba(255,255,255,0.4);
          cursor: pointer; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .view-btn.active { background: #1a8fa0; color: #071f2e; }

        /* ── MAIN CONTENT ── */
        .main-content {
          padding: 32px 60px 60px;
          min-height: 70vh;
        }
        .results-info {
          color: rgba(255,255,255,0.35);
          font-size: 13px;
          margin-bottom: 24px;
        }
        .results-info span { color: #1a8fa0; font-weight: 600; }

        /* ── GRID VIEW ── */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 48px;
        }
        .product-card {
          background: #0a2535;
          border: 1px solid rgba(26,143,160,0.08);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          display: block;
          transition: all 0.3s ease;
          position: relative;
        }
        .product-card:hover {
          border-color: rgba(26,143,160,0.4);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          transform: translateY(-4px);
        }
        .product-img-wrap {
          width: 100%;
          height: 220px;
          background: #0e3a4a;
          overflow: hidden;
          position: relative;
        }
        .product-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-img-wrap img { transform: scale(1.08); }
        .cart-hover {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: #1a8fa0;
          color: #071f2e;
          padding: 12px;
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          transform: translateY(100%);
          transition: transform 0.3s ease;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .product-card:hover .cart-hover { transform: translateY(0); }
        .stock-dot {
          position: absolute;
          top: 12px; right: 12px;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
        }
        .in-stock { background: rgba(26,143,160,0.15); color: #1a8fa0; }
        .low-stock { background: rgba(246,201,14,0.15); color: #f6c90e; }
        .out-stock { background: rgba(255,71,87,0.15); color: #ff4757; }
        .product-info { padding: 16px; }
        .product-cat {
          color: #1a8fa0;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .product-name {
          color: white;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
        }
        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .product-price { color: white; font-size: 18px; font-weight: 800; }
        .product-price span { color: rgba(255,255,255,0.3); font-size: 11px; font-weight: 400; margin-left: 2px; }

        /* ── LIST VIEW ── */
        .products-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 48px;
        }
        .product-list-card {
          background: #0a2535;
          border: 1px solid rgba(26,143,160,0.08);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }
        .product-list-card:hover {
          border-color: rgba(26,143,160,0.4);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
          transform: translateX(4px);
        }
        .list-img {
          width: 140px; height: 110px;
          flex-shrink: 0;
          overflow: hidden;
          background: #0e3a4a;
        }
        .list-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .product-list-card:hover .list-img img { transform: scale(1.05); }
        .list-info { padding: 20px 24px; flex: 1; }
        .list-name { color: white; font-size: 16px; font-weight: 700; margin-bottom: 6px; }
        .list-desc { color: rgba(255,255,255,0.4); font-size: 13px; line-height: 1.5; margin-bottom: 12px; }
        .list-footer { display: flex; align-items: center; gap: 16px; }
        .list-price { color: white; font-size: 22px; font-weight: 800; }
        .list-price span { color: rgba(255,255,255,0.3); font-size: 12px; margin-left: 2px; }
        .list-btn {
          background: #1a8fa0;
          color: #071f2e;
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ── SKELETON ── */
        .skeleton {
          background: #0a2535;
          border-radius: 16px;
          height: 300px;
          animation: shimmer 1.5s ease infinite;
        }
        .skeleton-list {
          background: #0a2535;
          border-radius: 16px;
          height: 110px;
          animation: shimmer 1.5s ease infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ── EMPTY ── */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          grid-column: 1 / -1;
        }
        .empty-icon { font-size: 64px; margin-bottom: 16px; }
        .empty-title { color: white; font-size: 20px; font-weight: 700; margin-bottom: 8px; }
        .empty-sub { color: rgba(255,255,255,0.35); font-size: 14px; }

        /* ── PAGINATION ── */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .page-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(26,143,160,0.2);
          background: transparent;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.2s;
          font-family: Inter, sans-serif;
          font-size: 14px;
        }
        .page-btn:hover { border-color: #1a8fa0; color: #1a8fa0; }
        .page-btn.active { background: #1a8fa0; border-color: #1a8fa0; color: #071f2e; font-weight: 700; }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        /* ── FOOTER ── */
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

     

      {/* ── FILTER BAR ── */}
      <div className="filter-bar">
        <span className="filter-label">
          <SlidersHorizontal size={14} /> Filters
        </span>
        <div className="filter-divider" />

        {/* Category chips */}
        <button
          className={`cat-chip ${!selectedCategoryId ? 'active' : ''}`}
          onClick={() => { setSelectedCategoryId(null); setSelectedCategoryName('All'); setPage(1); }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`cat-chip ${selectedCategoryId === String(cat.id) ? 'active' : ''}`}
            onClick={() => { setSelectedCategoryId(String(cat.id)); setSelectedCategoryName(cat.name); setPage(1); }}
          >
            {cat.name}
          </button>
        ))}

        <div className="filter-divider" />

        {/* Search */}
        <form onSubmit={handleSearch}>
          <div className="filter-search">
            <Search size={14} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button type="button" className="clear-btn" onClick={clearSearch}>
                <X size={13} />
              </button>
            )}
          </div>
        </form>

        {/* Right side */}
        <div className="filter-bar-right">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={14} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="main-content">
        <p className="results-info">
          Showing <span>{pagination?.total || 0} products</span>
          {selectedCategoryName !== 'All' && <> in <span>{selectedCategoryName}</span></>}
          {search && <> matching <span>"{search}"</span></>}
        </p>

        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="products-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" />)
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <div className="empty-title">No products found</div>
                <div className="empty-sub">Try adjusting your search or filters</div>
              </div>
            ) : (
              products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="product-card">
                  <div className="product-img-wrap">
                    {product.image
                      ? <img src={product.image} alt={product.name} />
                      : <span style={{ fontSize: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>📦</span>
                    }
                    <div className="cart-hover">View Product →</div>
                    <span className={`stock-dot ${product.stock === 0 ? 'out-stock' : product.stock < 5 ? 'low-stock' : 'in-stock'}`}>
                      {product.stock === 0 ? 'Out of Stock' : product.stock < 5 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>
                  <div className="product-info">
                    <div className="product-cat">{product.category_name || 'Electronics'}</div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-footer">
                      <div className="product-price">${product.price}<span>USD</span></div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="products-list">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-list" />)
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <div className="empty-title">No products found</div>
                <div className="empty-sub">Try adjusting your search or filters</div>
              </div>
            ) : (
              products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="product-list-card">
                  <div className="list-img">
                    {product.image
                      ? <img src={product.image} alt={product.name} />
                      : <span style={{ fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>📦</span>
                    }
                  </div>
                  <div className="list-info">
                    <div className="product-cat">{product.category_name || 'Electronics'}</div>
                    <div className="list-name">{product.name}</div>
                    <div className="list-desc">{product.description?.slice(0, 80)}...</div>
                    <div className="list-footer">
                      <div className="list-price">${product.price}<span>USD</span></div>
                      <span className={`stock-dot ${product.stock === 0 ? 'out-stock' : product.stock < 5 ? 'low-stock' : 'in-stock'}`}>
                        {product.stock === 0 ? 'Out of Stock' : product.stock < 5 ? 'Low Stock' : 'In Stock'}
                      </span>
                      <span className="list-btn">View →</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* PAGINATION */}
        {pagination && pagination.pages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
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
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <footer className="footer">
        © 2026 ShopFlow. Built with passion in Morocco 🇲🇦
      </footer>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ background: '#071f2e', minHeight: '100vh' }} />}>
      <ProductsContent />
    </Suspense>
  );
}