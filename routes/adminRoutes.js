const express = require('express');
const router = express.Router();

// Controllers
const AdminController = require("../controllers/AdminController");

// Helpers
const checkAuth = require('../helpers/authAdmin').checkAuthAdmin;

// Routes
router.get('/', checkAuth, AdminController.login);
router.get('/management', checkAuth, AdminController.showMainManagementPage);
router.get('/login', AdminController.login);
router.post('/login', AdminController.loginPost);
router.get('/register', AdminController.register);
router.post('/register', AdminController.registerPost);
router.get('/logout', AdminController.logout);

module.exports = router;