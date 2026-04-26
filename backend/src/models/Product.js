const pool = require('../config/database');

const createProductsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      stock INTEGER DEFAULT 0,
      image VARCHAR(500),
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log('✅ Products table ready');
};

const Product = {
  async findAll({ category_id, search, limit = 10, offset = 0 } = {}) {
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      params.push(category_id);
      query += ` AND p.category_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND p.name ILIKE $${params.length}`;
    }

    params.push(limit);
    query += ` ORDER BY p.created_at DESC LIMIT $${params.length}`;

    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create({ name, description, price, stock, image, category_id }) {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, image, category_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, price, stock, image, category_id]
    );
    return result.rows[0];
  },

  async update(id, { name, description, price, stock, image, category_id }) {
    const result = await pool.query(
      `UPDATE products 
       SET name=$1, description=$2, price=$3, stock=$4, image=$5, category_id=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [name, description, price, stock, image, category_id, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
  },

  async count({ category_id, search } = {}) {
    let query = 'SELECT COUNT(*) FROM products WHERE 1=1';
    const params = [];

    if (category_id) {
      params.push(category_id);
      query += ` AND category_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND name ILIKE $${params.length}`;
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  },
};

module.exports = { Product, createProductsTable };