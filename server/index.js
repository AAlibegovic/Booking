const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const app = express();

// Routes
const userRoutes = require('./routes/userRoutes');
const placeRoutes = require('./routes/placeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  credentials: true,
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Uploads directory created');
}

app.get('/test', (req, res) => {
  res.json('test ok');
});

app.use(userRoutes);  // Handles /profile, /register, /login, etc.
app.use(placeRoutes);  // Handles /places, /user-places, etc.
app.use(bookingRoutes);  // Handles /bookings

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
