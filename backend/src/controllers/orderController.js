const { Order } = require("../models/Order");
const { Product } = require("../models/Product");

const orderController = {
  async create(req, res) {
    try {
      const { items, shipping_address } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Order must have at least one item ",
        });
      }

      let total_amount = 0;
      const ordersItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product_id);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product ${item.product_id} not found`,
          });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product ${product.name}`,
          });
        }
        total_amount += product.price * item.quantity;
        ordersItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
        });
      }
      const order = await Order.create({
        user_id: req.user.id,
        total_amount,
        shipping_address,
      });

      await Order.addItems(order.id, ordersItems);
      const fullOrder = await Order.findById(order.id);
      res.status(201).json({
        success: true,
        data: fullOrder,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating order",
        error: error.message,
      });
    }
  },

async getMyOrders(req, res) {
    try {
      const orders = await Order.findByUser(req.user.id);
      res.json({
        success: true,
        data: { orders },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  },
  async getById(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
      res.json({
        success: true,
        data: { order },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  },

  async getAll(req, res) {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const orders = await Order.findAll({ status, limit, offset });
      res.json({
        success: true,
        data: { orders },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  },
async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status',
        });
      }
        const order = await Order.updateStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      res.json({
        success: true,
        message: 'Order status updated',
        data: { order },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  },
   async getStats(req, res) {
    try {
      const stats = await Order.getStats();
      res.json({
        success: true,
        data: { stats },
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

module.exports = orderController;

