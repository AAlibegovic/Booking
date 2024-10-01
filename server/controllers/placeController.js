const Place = require('../models/Place');
const jwt = require('jsonwebtoken');
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

// Create a new place
async function createPlace(req, res) {
  const { token } = req.cookies;
  const {
    title, address, addedPhotos, description, price, perks, extraInfo, checkIn, checkOut, maxGuests,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id, title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price,
    });
    res.json(placeDoc);
  });
}

// Get user's places
async function getUserPlaces(req, res) {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
}

// Get a place by ID
async function getPlaceById(req, res) {
  const { id } = req.params;
  res.json(await Place.findById(id));
}

// Update place
async function updatePlace(req, res) {
  const { token } = req.cookies;
  const {
    id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
}

// Get all places
async function getAllPlaces(req, res) {
  res.json(await Place.find());
}

module.exports = {
  createPlace,
  getUserPlaces,
  getPlaceById,
  updatePlace,
  getAllPlaces
};
