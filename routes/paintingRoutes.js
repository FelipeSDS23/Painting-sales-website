const express = require('express');
const router = express.Router();
const PaintingsController = require("../controllers/PaintingsController");

// helpers
const { imageUpload } = require("../helpers/image-upload");

router.get('/dashboard', PaintingsController.showAllPaintings);
router.post('/register', imageUpload.single('image'), PaintingsController.paintingRegister);

module.exports = router;