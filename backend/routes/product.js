const express = require('express');
const router = express.Router();

const productController = require('../controllers/product');

const {verifyToken} = require('../middleware/auth');

router.post("/create", verifyToken, productController.create);

module.exports = router;