const express = require("express");
const {
  initCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} = require("../controllers/cart.controller");

const router = express.Router();

router.post("/init", initCart);
router.get("/", getCart);
router.post("/items", addItem);
router.patch("/items/:itemId", updateItem);
router.delete("/items/:itemId", removeItem);
router.delete("/", clearCart);

module.exports = router;
