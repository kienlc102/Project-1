const db = require('../db');

exports.getAllCheckouts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM checkout');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCheckout = async (req, res) => {
  try {
    const { userId, time } = req.body;
    const [result] = await db.query(
      'INSERT INTO checkout (userId, time) VALUES (?, ?)',
      [userId, time]
    );
    res.json({ CheckoutId: result.insertId, userId, time });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
