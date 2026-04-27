const { Category } = require("../models/Category");

const categoryController = {
  async getAll(req, res) {
    try {
      const categories = await Category.findAll();
      res.json({
        success: true,
        data: { categories },
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
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      res.json({
        success: true,
        data: { category },
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
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }
      const category = await Category.create({ name, description });
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: { category },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const { name, description } = req.body;
      const category = await Category.update(req.params.id, {
        name,
        description,
      });
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      res.json({
        success: true,
        message: "Category updated successfully",
        data: { category },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  async delete(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      await Category.delete(req.params.id);
      res.json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
};

module.exports = categoryController;
