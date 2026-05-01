const pool = require("../config/database");
const createOrdersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
      total_amount DECIMAL(10,2) NOT NULL,
      shipping_address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

     CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      quantity INTEGER NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log(" Orders table ready");
};

const Order = {
  async create({ user_id, total_amount, shipping_address }) {
    const result = await pool.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, total_amount, shipping_address],
    );
    return result.rows[0];
  },
  async addItems(order_id, items) {
    const values = items
      .map(
        (item) =>
          `(${order_id}, ${item.product_id}, ${item.quantity}, ${item.price})`,
      )
      .join(",");
    await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ${values}`,
    );
  },
  async findById(id) {
    const order = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);

    const items = await pool.query(
      `SELECT oi.*, p.name as product_name, p.image
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id],
    );
    return {...order.rows[0], items: items.rows}
  },
    async findByUser(user_id) {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    return result.rows;
  },

  async findAll({ status, limit = 10, offset = 0} = {}) {
    let query = `
     SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND o.status = $${params.length}`;
    }

    params.push(limit);
    query += ` ORDER BY o.created_at DESC LIMIT $${params.length}`;

    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    return result.rows;
  },

  async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },

  async getStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders
      FROM orders
    `);
    return result.rows[0];
  },
};

module.exports = { Order, createOrdersTable };

