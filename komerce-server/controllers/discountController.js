const Discount = require("./../models/discountModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
// const Product = require('../models/productModel');

exports.getAllDiscounts = catchAsync(async (req, res, next) => {
  // const discounts = await Discount.find();
  const features = new APIFeatures(Discount.find(), req.query).sort();
  const discounts = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: discounts.length,
    data: {
      discounts,
    },
  });
});

exports.getDiscount = catchAsync(async (req, res) => {
  const discount = await Discount.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      discount,
    },
  });
});

exports.createDiscount = catchAsync(async (req, res) => {
  const newDiscount = await Discount.create({
    discount_code: req.body.discount_code,
    discount_value: req.body.discount_value,
    discount_status: req.body.discount_status,
    active_from: req.body.active_from,
    expiry_at: req.body.expiry_at,
    time_used: req.body.time_used,
    applied_all: req.body.applied_all,
    products: req.body.products,
  }).catch((err) => {
    // console.log(err.name)
    if (err.name === "ValidationError") {
      error = Object.values(err.errors).map((val) => val.message);
      message = Array.from(new Set(error));
      res.status(400).json({
        status: message,
      });
    }
    if (err.name === "MongoError") {
      res.status(400).json({
        status: "This Code is already Exists!",
      });
    }
  });

  const endDate = newDiscount.expiry_at.setHours(0, 0, 0, 0);
  const startDate = newDiscount.active_from.setHours(0, 0, 0, 0);
  const currentDate = new Date().setHours(0, 0, 0, 0);
  if (startDate > currentDate && endDate > currentDate) {
    newDiscount.status = "Scheduled";
  } else if (
    (startDate < currentDate && endDate > currentDate) ||
    (startDate === currentDate && endDate > currentDate)
  ) {
    newDiscount.status = "Active";
  } else {
    newDiscount.status = "Expired";
  }
  newDiscount.save();

  if (newDiscount) {
    res.status(201).json({
      status: "success",
      data: {
        discount: newDiscount,
      },
    });
  }
});

exports.updateDiscount = catchAsync(async (req, res) => {
  const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).catch((err) => {
    if (err.name === "ValidationError") {
      error = Object.values(err.errors).map((val) => val.message);
      // console.log(error)
      res.status(400).json({
        status: error,
      });
    }
    if (err.name === "MongoError") {
      res.status(400).json({
        status: "This Code is already Exists!",
      });
    }
  });

  const endDate = discount.expiry_at.setHours(0, 0, 0, 0);
  const startDate = discount.active_from.setHours(0, 0, 0, 0);
  const currentDate = new Date().setHours(0, 0, 0, 0);
  if (startDate > currentDate && endDate > currentDate) {
    discount.status = "Scheduled";
  } else if (
    (startDate < currentDate && endDate > currentDate) ||
    (startDate === currentDate && endDate > currentDate)
  ) {
    discount.status = "Active";
  } else {
    discount.status = "Expired";
  }
  discount.save();

  if (!discount) {
    res.status(400).json({
      status: "Fail",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      discount,
    },
  });
});

exports.deleteDiscount = catchAsync(async (req, res) => {
  const discount = await Discount.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
