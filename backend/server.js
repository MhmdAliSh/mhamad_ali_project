require("dotenv").config();
const express = require("express");
const cors = require("cors");

const menuRoutes = require("./routes/menu.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const contactRoutes = require("./routes/contact.routes");
const adminRoutes = require("./routes/admin.routes");
const { errorHandler } = require("./middleware/error");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/menus", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on ${port}`);
});
