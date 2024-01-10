const express = require('express');
const productController = require('./../controllers/productController');
// const isAuth = require('../middleware/is-auth')

const router = express.Router();

// router.post('/createProduct',productController.createProduct)
router
    .route('/')
    .get(productController.getAllProducts)
    .post(productController.uploadProductPhoto, productController.createProduct)

router
    .route('/:id')
    .get(productController.getProduct)
    .post(productController.uploadProductPhoto, productController.updateProduct)
    .patch(productController.updateProduct)

module.exports = router;