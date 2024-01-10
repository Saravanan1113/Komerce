const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_no:{
        type: Number,
    },
    user_id:{
        type: String,
    },
    billing_address:{
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: Number,
        },
        address: {
            type: String,
        },
        postal_code:{
            type: Number
        }
    },
    shipping_address: {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: Number,
        },
        address: {
            type: String,
        },
        postal_code:{
            type: Number
        }
    },
    order_status:{
        type: String,
    },
    orderedDate: {
        type: Date,
        default: new Date,
    },
    products: [{
        product_name: {
            type: String,
        },
        product_sku: {
            type: String,
        },
        product_price: {
            type: Number,
        },
        quantity:{
            type: Number,
        },
        discount_code:{
            type: String,
        },
        discount_value:{
            type: Number,
        }
    }],
    total_quantity: {
        type: Number,
    },
    total_amount:{
        type: Number,
    },
    discounted_amount:{
        type: Number,
    },
    total_item:{
        type: Number
    },
    discount_code:{
        type: String
    },
    discount_value:{
        type: Number
    },
    total_discount:{
        type: Number
    },
    final_price:{
        type:Number,
        default:0
    }
});

const Order = new mongoose.model("Order", orderSchema);

// const testOrder = new Order({
//     order_no: 10001,
//     user_id: "user123",
//     billing_address:{
//         name: "Mohamed",
//         email: "mohamed@email.com",
//         phone: 1234567890,
//         address: "xxx, yyy, zzzz.",
//         postal_code: 614205
//     },
//     shipping_address: {
//         name: "Mohamed",
//         email: "mohamed@email.com",
//         phone: 1234567890,
//         address: "xxx, yyy, zzzz.",
//         postal_code: 614205
//     },
//     order_status: "Paid",
//     products: [{
//         product_name:"Black shirt",
//         product_sku: "SKU0001",
//         product_price: 32,
//         quantity: 2,
//         discount_code: "TESTING",
//         discount_value: 10
//     }],
//     total_quantity: 2,
//     total_amount:64,
//     discounted_amount: 28.8
// })

// testOrder.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log("Error:", err);
// })

module.exports = Order;