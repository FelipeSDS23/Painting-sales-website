const express = require('express')
const router = express.Router()
const AdminController = require("../controllers/AdminController")

router.get('/management', AdminController.showMainManagementPage)
router.get('/login', AdminController.login)
router.post('/login', AdminController.makeAdministratorLogin)

module.exports = router