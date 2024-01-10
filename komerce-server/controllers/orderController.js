const stripe = require('stripe')
const Order = require('../models/orderModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllOrders = catchAsync(async (req, res, next) => {
    const order = await Order.find();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: order.length,
      data: {
        order
      }
    });
});

exports.getOrder = catchAsync(async(req, res) => {
  const order = await Order.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data:{
      order
    }
  })
});

exports.createOrder = catchAsync(async(req, res) => {
  console.log(req.body)
  const newOrder = await Order.create({
    order_no: req.body.order_no,
		user_id: req.body.user_id,
		billing_address: req.body.billing_address,
		shipping_address: req.body.shipping_address,
		order_status: req.body.order_status,
		products: req.body.products,
		total_quantity: req.body.total_quantity,
		total_amount: req.body.total_amount,
		discounted_amount: req.body.discounted_amount,
		total_item: req.body.total_item,
		discount_code: req.body.discount_code,
		discount_value: req.body.discount_value,
    final_price:req.body.final_price
  })

  if(newOrder){
    res.status(201).json({
        status: 'success',
        data:{
          order: newOrder
        }
    })
  }
})

// exports.payment = catchAsync(async(req, res, next) => {
//   console.log(req.body)
//   // const order = await Order.findById(req.params.id)
//   // console.log(order)

//   // //Create checkout session
//   // const session = await stripe.checkout.sessions.create({
//   //   payment_method_types: ['card'],
//   //   success_url: `${req.protocol}://${req.get(`host`)}/`,
//   //   cancel_url: `${req.protocol}://${req.get('host')}/`,
//   //   line_items: [
      
//   //   ]
//   // })
// })

exports.updateOrder = catchAsync(async(req, res) => {
  console.log(req.params.id)
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  console.log(order)

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});
