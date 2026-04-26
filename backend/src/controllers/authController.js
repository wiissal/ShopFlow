const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const authController = {
  async register (req, res){
    try{
      const { name, email, password} = req.body;

      if(!name || !email || !password) {
        return res.status(400).json (
         { success: false,
          message: 'All fields are required',}
        );
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        });
      }

      const user = await User.create({ name, email, password });
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user, token }
      });
    } catch(error) {
      res.status(500).json({
        success: false, 
        message: 'Server error',
        error: error.message,
      });
    }
  },

  async getMe (req, res) {
    try{
      const user = await User.findById(req.user.id);
      res.json({
        success:true,
        data:{ user }
      });
    } catch(error){
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  },
};

module.exports = authController;