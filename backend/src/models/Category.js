const Pool = require("../config/database");

const createCategoriesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log(" Categories table ready");
};

const Category = {
  async findAll() {
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  },

  async create({ name, description }) {
    const result = await pool.query(
      `INSERT INTO categories (name, description)
       VALUES ($1, $2) RETURNING *`,
      [name, description],
    );
    return result.rows[0];
  },

  async update(id, { name, description }) {
    const result = await pool.query(
      `UPDATE categories SET name = $1, description = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [name, description, id],
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
  },
};

module.exports = {Category, createCategoriesTable};
