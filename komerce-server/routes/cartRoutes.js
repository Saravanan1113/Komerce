const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/cart', cartController.deleteCart);

router
    .route('/')
    .post(cartController.createCart)
    
router
    .route('/:id')
    .get(cartController.getCart)
    .post(cartController.addCartItem)
    .patch(cartController.updateCartItem)
    .delete(cartController.deleteCartItem)

module.exports = router;