const db = require('../db');

exports.getAllCheckins = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM checkin');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCheckin = async (req, res) => {
  try {
    const { userId, time } = req.body;
    const [result] = await db.query(
      'INSERT INTO checkin (userId, time) VALUES (?, ?)',
      [userId, time]
    );
    res.json({ CheckinId: result.insertId, userId, time });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

