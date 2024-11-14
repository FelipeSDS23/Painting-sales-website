const express = require('express')
const router = express.Router()
const PaintingsController = require("../controllers/PaintingsController")

router.get('/dashboard', PaintingsController.showAllPaintings)

module.exports = router