const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/users');
const checkinRoutes = require('./routes/checkins');
const checkoutRoutes = require('./routes/checkouts');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// API endpoints
app.use('/api/users', userRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/checkouts', checkoutRoutes);

// Root route to avoid "Cannot GET /" when visiting the server in a browser
app.get('/', (req, res) => {
  res.send('Backend API running. Use /api/users, /api/checkins, /api/checkouts');
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
