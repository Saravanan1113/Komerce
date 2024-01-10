const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name:{
        type: String,
        required: [true, 'Product Required'],
    },
    sku:{
        type: String,
        required: [true, 'SKU Required'],
        unique: [true, 'This SKU is already Exists!']
    },
    price:{
        type: Number,
        required: [true, 'Price Required']
    },
    description:{
        type: String,
    },
    image:{
        type: String,
        // data: Buffer,
        // contentType: String,
    },
    inventory:{
        type: Number,
        required: [true, "Inventory Required"]
    },
    product_status:{
        type: String,
    },
    created_at:{
        type: Date,
        default: new Date,
    },
    modified_at:{
        type: Date
    }
})

const Product = new mongoose.model("Product", productSchema);

// const testProduct = new Product({
//     product_name: "Basic Green Shirt",
//     sku: "WIGO0001",
//     price: 45,
//     description: "New Description here",
//     image: "black-01/jpg",
//     inventory: 200,
//     product_status: "active"
// })

// testProduct.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log("Error:", err);
// })

module.exports = Product;