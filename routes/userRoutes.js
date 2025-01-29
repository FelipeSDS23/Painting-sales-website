const express = require('express');
const router = express.Router();

// Controllers
const UserController = require("../controllers/UserController");

// Routes
router.get('/login', UserController.login);
router.post('/login', UserController.loginPost);
router.get('/register', UserController.register);
router.post('/register', UserController.registerPost);
router.get('/logout', UserController.logout);
router.get('/termos', UserController.termosDeUso);

module.exports = router;