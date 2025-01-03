const express = require('express');
const router = express.Router();
const AdminController = require("../controllers/AdminController");

// helpers
const checkAuth = require('../helpers/authAdmin').checkAuthAdmin;

router.get('/', checkAuth, AdminController.login);
router.get('/management', checkAuth, AdminController.showMainManagementPage);
router.get('/login', AdminController.login);
router.post('/login', AdminController.loginPost);
router.get('/register', AdminController.register);
router.post('/register', AdminController.registerPost);
router.get('/logout', AdminController.logout);

module.exports = router;