const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const headers = (auth = false) => {
  const h = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
};

// AUTH
export const authAPI = {
  register: (data) =>
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  login: (data) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  getMe: () =>
    fetch(`${API_URL}/auth/me`, {
      headers: headers(true),
    }).then((r) => r.json()),
};

// PRODUCTS
export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/products?${query}`, {
      headers: headers(),
    }).then((r) => r.json());
  },

  getById: (id) =>
    fetch(`${API_URL}/products/${id}`, {
      headers: headers(),
    }).then((r) => r.json()),

  create: (data) =>
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  update: (id, data) =>
    fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  delete: (id) =>
    fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then((r) => r.json()),
};

// CATEGORIES
export const categoriesAPI = {
  getAll: () =>
    fetch(`${API_URL}/categories`, {
      headers: headers(),
    }).then((r) => r.json()),

  create: (data) =>
    fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  update: (id, data) =>
    fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  delete: (id) =>
    fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: headers(true),
    }).then((r) => r.json()),
};

// ORDERS
export const ordersAPI = {
  create: (data) =>
    fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  getMyOrders: () =>
    fetch(`${API_URL}/orders/my-orders`, {
      headers: headers(true),
    }).then((r) => r.json()),

  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_URL}/orders?${query}`, {
      headers: headers(true),
    }).then((r) => r.json());
  },

  getById: (id) =>
    fetch(`${API_URL}/orders/${id}`, {
      headers: headers(true),
    }).then((r) => r.json()),

  updateStatus: (id, status) =>
    fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify({ status }),
    }).then((r) => r.json()),
};

// DASHBOARD
export const dashboardAPI = {
  getStats: () =>
    fetch(`${API_URL}/dashboard/stats`, {
      headers: headers(true),
    }).then((r) => r.json()),
};