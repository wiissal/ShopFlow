const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes/auth");
const { createUsersTable } = require("./models/User");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const { createCategoriesTable } = require("./models/Category");
const { createProductsTable } = require("./models/Product");
const orderRoutes = require('./routes/orders');
const { createOrdersTable } = require('./models/Order');
const dashboardRoutes = require('./routes/dashboard');

require("dotenv").config();

const app = express();

//middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

//routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ShopFlow API",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});
app.use("/api/auth", authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

//404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await createUsersTable();
  await createCategoriesTable();
  await createProductsTable();
  await createOrdersTable();
  app.listen(PORT, () => {
    console.log(` ShopFlow API running on port ${PORT}`);
  });
};

startServer();

module.exports = app;
