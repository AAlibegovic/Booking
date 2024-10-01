const express = require('express');
const { createPlace, getUserPlaces, getPlaceById, updatePlace, getAllPlaces } = require('../controllers/placeController');

const router = express.Router();

router.post('/places', createPlace);
router.get('/user-places', getUserPlaces);
router.get('/places/:id', getPlaceById);
router.put('/places', updatePlace);
router.get('/places', getAllPlaces);

module.exports = router;
