const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

// Function to get user data from request
async function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        reject(err);
      } else {
        resolve(userData);
      }
    });
  });
}

// Create booking
async function createBooking(req, res) {
  const userData = await getUserDataFromReq(req);
  const {
    place, checkIn, checkOut, numberOfGuests, name, phone, price,
  } = req.body;

  Booking.create({
    place, checkIn, checkOut, numberOfGuests, name, phone, price,
    user: userData.id,
  })
    .then(doc => res.json(doc))
    .catch(err => res.status(500).json({ error: err.message }));
}

// Get bookings for a user
async function getBookings(req, res) {
  const userData = await getUserDataFromReq(req);
  const bookings = await Booking.find({ user: userData.id }).populate('place');
  res.json(bookings);
}

module.exports = {
  createBooking,
  getBookings
};
