const pool = require("../db");

const DEFAULT_MENU_ID = 1;

async function ensureDefaultMenu() {
  const [rows] = await pool.query("SELECT id FROM menus WHERE id = ?", [
    DEFAULT_MENU_ID,
  ]);
  if (rows.length === 0) {
    await pool.query(
      "INSERT INTO menus (id, name, description) VALUES (?, ?, ?)",
      [DEFAULT_MENU_ID, "Main Menu", "Default menu"]
    );
  }
}

async function createItem(req, res, next) {
  try {
    const { name, description, price, imageUrl, isActive } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: "name and price required" });
    }
    await ensureDefaultMenu();
    const [result] = await pool.query(
      "INSERT INTO menu_items (menu_id, name, description, price, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      [
        DEFAULT_MENU_ID,
        name,
        description || null,
        price,
        imageUrl || null,
        isActive === undefined ? 1 : isActive ? 1 : 0,
      ]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const itemId = Number(req.params.id);
    const { name, description, price, imageUrl, isActive } = req.body;
    await pool.query(
      "UPDATE menu_items SET name = COALESCE(?, name), description = COALESCE(?, description), price = COALESCE(?, price), image_url = COALESCE(?, image_url), is_active = COALESCE(?, is_active) WHERE id = ?",
      [
        name || null,
        description || null,
        price === undefined ? null : price,
        imageUrl || null,
        isActive === undefined ? null : isActive ? 1 : 0,
        itemId,
      ]
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    const itemId = Number(req.params.id);
    await pool.query("DELETE FROM menu_items WHERE id = ?", [itemId]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function listItems(req, res, next) {
  try {
    await ensureDefaultMenu();
    const [rows] = await pool.query(
      "SELECT id, name, description, price, image_url, is_active FROM menu_items WHERE menu_id = ? ORDER BY id",
      [DEFAULT_MENU_ID]
    );
    res.json(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: Number(row.price),
        imageUrl: row.image_url,
        isActive: row.is_active === 1,
      }))
    );
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createItem,
  updateItem,
  deleteItem,
  listItems,
};
