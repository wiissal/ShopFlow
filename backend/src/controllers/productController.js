const { product, Product } = require("../models/Product");

const productController = {
  async getAll(req, res) {
    try {
      const { category_id, search, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const products = await Product.findAll({
        category_id,
        search,
        limit,
        offset,
      });
      const total = await Product.count({ category_id, search });
      res.json({
        success: true,
        data: {
          products,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  async getById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      res.json({
        success: true,
        data: { product },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

 async create(req, res) {
    try {
      const { name, description, price, stock, image, category_id } = req.body;

      if (!name || !price) {
        return res.status(400).json({
          success: false,
          message: 'Name and price are required',
        });
      }

      const product = await Product.create({
        name, description, price, stock, image, category_id,
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const { name, description, price, stock, image, category_id } = req.body;

      const existing = await Product.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      const product = await Product.update(req.params.id, {
        name: name || existing.name,
        description: description || existing.description,
        price: price || existing.price,
        stock: stock !== undefined ? stock : existing.stock,
        image: image || existing.image,
        category_id: category_id || existing.category_id,
      });

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  },

  async delete(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      await Product.delete(req.params.id);
      res.json({
        success: true,
        message: 'Product deleted successfully',
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

module.exports = productController;
