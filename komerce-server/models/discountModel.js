const mongoose = require('mongoose');
const validator = require('validator');

const discountSchema = new mongoose.Schema({
    discount_code:{
        type:String,
        required: [true, "All"],
        unique: [true]
    },
    discount_value:{
        type:Number,
        required: [true,"All"]
    },
    discount_status:{
        type:String,
        required: [true,"All"]
    },
    active_from:{
        type: Date,
        required: [true,"All"]
    },
    expiry_at:{
        type: Date,
        required: [true,"All"]
    },
    time_used:{
        type:Number,
        default: 0,
    },
    applied_all:{
        type:String,
        required: [true,"All"]
    },
    status:{
        type: String
    },
    products:[]
})

const Discount = new mongoose.model("Discount", discountSchema);

module.exports = Discount;
