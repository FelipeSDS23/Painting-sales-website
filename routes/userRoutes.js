const express = require('express');
const router = express.Router();
const UserController = require("../controllers/UserController");

// helpers
// const { imageUpload } = require("../helpers/image-upload");

router.get('/login', UserController.login);
router.post('/login', UserController.loginPost);
router.get('/register', UserController.register);
router.post('/register', UserController.registerPost);
router.get('/logout', UserController.logout);

module.exports = router;