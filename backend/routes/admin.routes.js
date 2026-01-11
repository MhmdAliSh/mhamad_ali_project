const express = require("express");
const {
  createItem,
  updateItem,
  deleteItem,
  listItems,
} = require("../controllers/admin.controller");
const router = express.Router();

router.get("/items", listItems);
router.post("/items", createItem);
router.patch("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);

module.exports = router;
