const { v4: uuidv4 } = require("uuid");
const pool = require("../db");
const { generateOrderCode } = require("../utils/orderCode");

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
    `SELECT ci.menu_item_id AS id, mi.price, ci.qty
     FROM cart_items ci
     JOIN menu_items mi ON mi.id = ci.menu_item_id
     WHERE ci.cart_id = ?`,
    [cartId]
  );
  return rows.map((row) => ({
    id: row.id,
    price: Number(row.price),
    qty: row.qty,
  }));
}

function computeStatus(createdAt) {
  const elapsedSeconds = Math.floor((Date.now() - createdAt.getTime()) / 1000);
  if (elapsedSeconds < 10) return "Order confirmed";
  if (elapsedSeconds < 20) return "Order placed";
  return "Order is being delivered";
}

async function createOrder(req, res, next) {
  try {
    const cartId = getCookieValue(req, "cartId");
    if (!cartId) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const items = await fetchCartItems(cartId);
    if (items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const phone = req.body.phone || "guest";
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    let orderCode = generateOrderCode();
    for (let i = 0; i < 5; i += 1) {
      const [existing] = await pool.query(
        "SELECT id FROM orders WHERE order_code = ?",
        [orderCode]
      );
      if (existing.length === 0) break;
      orderCode = generateOrderCode();
    }

    const orderId = uuidv4();
    const status = "Order confirmed";

    await pool.query(
      "INSERT INTO orders (id, order_code, phone, total, status) VALUES (?, ?, ?, ?, ?)",
      [orderId, orderCode, phone, total, status]
    );

    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, menu_item_id, qty, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.qty, item.price]
      );
    }

    await pool.query(
      "INSERT INTO order_status_events (order_id, status) VALUES (?, ?)",
      [orderId, status]
    );

    await pool.query("DELETE FROM carts WHERE id = ?", [cartId]);
    setCookie(res, "cartId", "", { maxAge: 0 });

    res.json({ orderCode, status, phone });
  } catch (err) {
    next(err);
  }
}

async function trackOrder(req, res, next) {
  try {
    const { orderCode, phone } = req.query;
    if (!orderCode || !phone) {
      return res.status(400).json({ error: "orderCode and phone required" });
    }

    const [rows] = await pool.query(
      "SELECT id, status, created_at FROM orders WHERE order_code = ? AND phone = ?",
      [orderCode, phone]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = rows[0];
    const nextStatus = computeStatus(new Date(order.created_at));

    if (nextStatus !== order.status) {
      await pool.query("UPDATE orders SET status = ? WHERE id = ?", [
        nextStatus,
        order.id,
      ]);
      await pool.query(
        "INSERT INTO order_status_events (order_id, status) VALUES (?, ?)",
        [order.id, nextStatus]
      );
    }

    res.json({
      orderCode,
      status: nextStatus,
      createdAt: order.created_at,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, trackOrder };
