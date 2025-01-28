const express = require('express');
const router = express.Router();
const PaintingsController = require("../controllers/PaintingsController");

// helpers
const { imageUpload } = require("../helpers/image-upload");

router.get('/dashboard', PaintingsController.showAllPaintings);

// router.post('/register', imageUpload.single('image'), PaintingsController.paintingRegister);
router.post('/register', imageUpload.array('image'), PaintingsController.paintingRegister);
// router.post('/register', PaintingsController.paintingRegister);

router.post('/delete/:id', PaintingsController.paintingDelete);
router.get('/update/:id', PaintingsController.paintingUpdateGet);
router.post('/update', imageUpload.array('image'), PaintingsController.paintingUpdatePost);
router.get('/details/:id', imageUpload.single('image'), PaintingsController.paintingDetails);
router.get('/cart', PaintingsController.cart);
router.post('/cart', PaintingsController.cartPost);

module.exports = router;