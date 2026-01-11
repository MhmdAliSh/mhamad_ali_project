const { v4: uuidv4 } = require("uuid");
const pool = require("../db");

function getCookieValue(req, name) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split("=")[1]);
}

function setCookie(res, name, value, options = {}) {
  const attrs = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "SameSite=Lax",
  ];
  if (options.maxAge !== undefined) {
    attrs.push(`Max-Age=${options.maxAge}`);
  }
  res.setHeader("Set-Cookie", attrs.join("; "));
}

async function fetchCartItems(cartId) {
  const [rows] = await pool.query(
    `SELECT ci.menu_item_id AS id, mi.name, mi.description, mi.price, mi.image_url, ci.qty
     FROM cart_items ci
     JOIN menu_items mi ON mi.id = ci.menu_item_id
     WHERE ci.cart_id = ?
     ORDER BY ci.id`,
    [cartId]
  );
  const items = rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    image: row.image_url,
    qty: row.qty,
  }));
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { items, total };
}

async function ensureCart(req, res) {
  let cartId = getCookieValue(req, "cartId");
  if (cartId) {
    const [rows] = await pool.query("SELECT id FROM carts WHERE id = ?", [
      cartId,
    ]);
    if (rows.length > 0) {
      return cartId;
    }
  }

  cartId = uuidv4();
  await pool.query("INSERT INTO carts (id) VALUES (?)", [cartId]);
  setCookie(res, "cartId", cartId);
  return cartId;
}

async function initCart(req, res, next) {
  try {
    const cartId = await ensureCart(req, res);
    const cart = await fetchCartItems(cartId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

async function getCart(req, res, next) {
  try {
    const cartId = getCookieValue(req, "cartId");
    if (!cartId) {
      return res.json({ items: [], total: 0 });
    }
    const [rows] = await pool.query("SELECT id FROM carts WHERE id = ?", [
      cartId,
    ]);
    if (rows.length === 0) {
      setCookie(res, "cartId", "", { maxAge: 0 });
      return res.json({ items: [], total: 0 });
    }
    const cart = await fetchCartItems(cartId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

async function addItem(req, res, next) {
  try {
    const { menuItemId, qty } = req.body;
    if (!menuItemId) {
      return res.status(400).json({ error: "menuItemId required" });
    }

    const cartId = await ensureCart(req, res);

    const [menuRows] = await pool.query(
      "SELECT id FROM menu_items WHERE id = ? AND is_active = 1",
      [menuItemId]
    );
    if (menuRows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const [existing] = await pool.query(
      "SELECT id, qty FROM cart_items WHERE cart_id = ? AND menu_item_id = ?",
      [cartId, menuItemId]
    );

    const addQty = Number(qty) > 0 ? Number(qty) : 1;

    if (existing.length > 0) {
      const newQty = existing[0].qty + addQty;
      await pool.query(
        "UPDATE cart_items SET qty = ? WHERE id = ?",
        [newQty, existing[0].id]
      );
    } else {
      await pool.query(
        "INSERT INTO cart_items (cart_id, menu_item_id, qty) VALUES (?, ?, ?)",
        [cartId, menuItemId, addQty]
      );
    }

    const cart = await fetchCartItems(cartId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const cartId = getCookieValue(req, "cartId");
    if (!cartId) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const [rows] = await pool.query("SELECT id FROM carts WHERE id = ?", [
      cartId,
    ]);
    if (rows.length === 0) {
      setCookie(res, "cartId", "", { maxAge: 0 });
      return res.status(404).json({ error: "Cart not found" });
    }
    const menuItemId = Number(req.params.itemId);
    const qty = Number(req.body.qty);
    if (!menuItemId || Number.isNaN(qty)) {
      return res.status(400).json({ error: "Invalid request" });
    }

    if (qty <= 0) {
      await pool.query(
        "DELETE FROM cart_items WHERE cart_id = ? AND menu_item_id = ?",
        [cartId, menuItemId]
      );
    } else {
      await pool.query(
        "UPDATE cart_items SET qty = ? WHERE cart_id = ? AND menu_item_id = ?",
        [qty, cartId, menuItemId]
      );
    }

    const cart = await fetchCartItems(cartId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const cartId = getCookieValue(req, "cartId");
    if (!cartId) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const [rows] = await pool.query("SELECT id FROM carts WHERE id = ?", [
      cartId,
    ]);
    if (rows.length === 0) {
      setCookie(res, "cartId", "", { maxAge: 0 });
      return res.status(404).json({ error: "Cart not found" });
    }
    const menuItemId = Number(req.params.itemId);
    await pool.query(
      "DELETE FROM cart_items WHERE cart_id = ? AND menu_item_id = ?",
      [cartId, menuItemId]
    );
    const cart = await fetchCartItems(cartId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

async function clearCart(req, res, next) {
  try {
    const cartId = getCookieValue(req, "cartId");
    if (!cartId) {
      return res.json({ items: [], total: 0 });
    }
    await pool.query("DELETE FROM carts WHERE id = ?", [cartId]);
    setCookie(res, "cartId", "", { maxAge: 0 });
    res.json({ items: [], total: 0 });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  initCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
