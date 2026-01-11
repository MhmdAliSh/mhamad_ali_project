const pool = require("../db");

async function getMenus(req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, description FROM menus ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getMenuItems(req, res, next) {
  try {
    const menuId = Number(req.params.menuId);
    const [rows] = await pool.query(
      "SELECT id, name, description, price, image_url FROM menu_items WHERE menu_id = ? AND is_active = 1 ORDER BY id",
      [menuId]
    );
    const items = rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      image: row.image_url,
    }));
    res.json(items);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMenus, getMenuItems };
