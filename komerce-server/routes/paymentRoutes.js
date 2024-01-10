const express = require('express');
const Stripe = require('stripe');

const paymentRoute = express.Router();

paymentRoute.post("/payment", async(req, res, next) => {
    console.log(req.body)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY,{
        apiVersion: "2020-08-27"
    });

    let line_items = req.body.lineItem;
    let orderId = req.body.orderId;
    console.log(orderId)

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        success_url: `http://localhost:3001/order-success/${orderId}`,
        cancel_url: `http://localhost:3001/checkout`
    });

    console.log(session)

    res.status(200).json({
      status: 'success',
      session
    });
})

module.exports = paymentRoute;
