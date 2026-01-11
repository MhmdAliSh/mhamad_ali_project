const express = require("express");
const { getMenus, getMenuItems } = require("../controllers/menu.controller");

const router = express.Router();

router.get("/", getMenus);
router.get("/:menuId/items", getMenuItems);

module.exports = router;
