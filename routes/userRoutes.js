const express = require('express');
const router = express.Router();
const UserController = require("../controllers/UserController");

// helpers
// const { imageUpload } = require("../helpers/image-upload");

router.get('/login', UserController.login);
router.get('/register', UserController.register);

module.exports = router;