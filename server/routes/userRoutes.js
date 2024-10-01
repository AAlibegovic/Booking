const express = require('express');
const { registerUser, loginUser, getProfile, logoutUser, uploadByLink, uploadPhotos } = require('../controllers/userController');
const multer = require('multer');

const router = express.Router();
const photosMiddleware = multer({ dest: 'uploads' });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);  // No change, this remains /profile
router.post('/logout', logoutUser);
router.post('/upload-by-link', uploadByLink);
router.post('/upload', photosMiddleware.array('photos', 100), uploadPhotos);

module.exports = router;
