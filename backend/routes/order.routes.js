const express = require("express");
const { createOrder, trackOrder } = require("../controllers/order.controller");

const router = express.Router();

router.post("/", createOrder);
router.get("/track", trackOrder);

module.exports = router;
