const pool = require('../config/database');

const dashboardController = {
  async getStats(req, res) {
    try {
      const ordersStats = await pool.query(`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
          COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
        FROM orders
      `);

      const productsStats = await pool.query(`
        SELECT 
          COUNT(*) as total_products,
          COUNT(CASE WHEN stock = 0 THEN 1 END) as out_of_stock
        FROM products
      `);

      const usersStats = await pool.query(`
        SELECT COUNT(*) as total_users
        FROM users
        WHERE role = 'customer'
      `);

      const topProducts = await pool.query(`
        SELECT p.name, SUM(oi.quantity) as total_sold, 
               SUM(oi.quantity * oi.price) as revenue
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        GROUP BY p.name
        ORDER BY total_sold DESC
        LIMIT 5
      `);

      const recentOrders = await pool.query(`
        SELECT o.*, u.name as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5
      `);

      const monthlyRevenue = await pool.query(`
        SELECT 
          TO_CHAR(created_at, 'Mon') as month,
          COALESCE(SUM(total_amount), 0) as revenue
        FROM orders
        WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
        ORDER BY DATE_TRUNC('month', created_at)
      `);

      res.json({
        success: true,
        data: {
          orders: ordersStats.rows[0],
          products: productsStats.rows[0],
          users: usersStats.rows[0],
          top_products: topProducts.rows,
          recent_orders: recentOrders.rows,
          monthly_revenue: monthlyRevenue.rows,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  },
};

module.exports = dashboardController;