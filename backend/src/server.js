const express = require ('express');
const cors = require ('cors');
const helmet = require ('helmet');  
const morgan = require ('morgan');
require('dotenv').config();

const app = express();

//middlewares
app.use (cors());
app.use (helmet());
app.use (morgan('dev'));
app.use (express.json());
app.use (express.urlencoded({extended: true}));

//routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to ShopFlow API',
    version: '1.0.0',
  });
});

app.get ('/health', (req,res)=>{
  res.json({
    success: true,
    message: 'Server is running',
  });
});

//404 handler
app.use((req, res) =>{
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PPORT = process.env.PORT || 5000;

app.listen (PPORT, ()=>{
 console.log (`ShopFlow API is running on port ${PPORT}`);
});

module.exports = app;