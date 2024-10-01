const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const imageDownloader = require('image-downloader');
const fs = require('fs');
const path = require('path');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

// Register user
async function registerUser(req, res) {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
}

// Login user
async function loginUser(req, res) {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (!userDoc) return res.status(404).json('not found');

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      }
    );
  } else {
    res.status(401).json('pass not ok');
  }
}

// Get user profile
async function getProfile(req, res) {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
}

// Logout user
function logoutUser(req, res) {
  res.cookie('token', '').json(true);
}

// Upload by link
async function uploadByLink(req, res) {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/../uploads/' + newName,
  });
  res.json(newName);
}

// Upload photos
function uploadPhotos(req, res) {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    const fixedPath = newPath.replace(/\\/g, '/');
    uploadedFiles.push(fixedPath.replace('uploads/', ''));
  }
  res.json(uploadedFiles);
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  uploadByLink,
  uploadPhotos
};
