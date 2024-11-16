const express = require('express')
const router = express.Router()
const AdminController = require("../controllers/AdminController")

router.get('/management', AdminController.showMainManagementPage)
router.get('/login', AdminController.login)
router.post('/login', AdminController.loginPost)
router.get('/register', AdminController.register)
router.post('/register', AdminController.registerPost)

module.exports = router