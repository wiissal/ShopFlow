const pool = require ('../config/database');
const bcrypt = require ('bcryptjs');


const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log('Users table ready');
};

const User = {
  async create ({name, email, password, role='customer'}){
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at`,
    [name, email, hashedPassword, role] );
    return result.rows[0];
  },

  async findByEmail (email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  async findById (id) {
    const result = await pool.query(
   'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
   [id]
    );
    return result.rows[0];
  },

  async comparePassword (plainPassword, hashedPassword) {
    return  bcrypt.compare(plainPassword, hashedPassword);
  } ,
};

module.exports ={User, createUsersTable};