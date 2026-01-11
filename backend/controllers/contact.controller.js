const pool = require("../db");

async function submitContact(req, res, next) {
  try {
    const { name, email, phone, message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "message required" });
    }
    await pool.query(
      "INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)",
      [name || null, email || null, phone || null, message]
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitContact };
