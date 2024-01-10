const mongoose = require('mongoose');

const cartScheema = new mongoose.Schema({
    existingItem: [ {
        product_id: {
            type: String,
        },
        product_sku:{
            type: String,
        },
        product_name: {
            type: String,
        },
        product_price: {
            type: Number,
        },
        product_image:{

        },
        quantity: {
            type: Number,
        },
        inventory: {
            type: Number
        }
    }],  
    total_item: {
        type:Number,
        default: 0
    }, 
    discount_code:{
        type: String,
        default: '',
    },
    discount_value:{
        type: Number,
        default: 0
    },
    total_quantity:{
        type: Number,
        default: 0,
    },
    total_amount:{
        type: Number,
        default: 0,
    },
    discounted_amount:{
        type: Number,
        default: 0,
    },
    final_price:{
        type:Number,
        default:0
    }

}); 

const Cart = new mongoose.model("Cart", cartScheema);

// const testProduct = new Cart({
//     existingItem: [{
//         product_id:"624a81d6e7543512c96b0cbd",
//         product_name:"Basic Black Shirt",
//         product_price:38,
//         product_image:"defaultImage.png",
//         quantity:2,
//     }]
// })

// testProduct.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log("Error:", err);
// })

module.exports = Cart;