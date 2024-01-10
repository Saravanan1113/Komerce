const Cart = require('../models/cartModle');
const catchAsync = require('./../utils/catchAsync');

// exports.getAllCartItems = catchAsync(async(req, res, next) => {
//     const cartItems = await Cart.find();
//     // const features = new APIFeatures(Discount.find(), req.query).sort();
//     // const discounts = await features.query;

//     // SEND RESPONSE
//     res.status(200).json({
//       status: 'success',
//       results: cartItems.length,
//       data: {
//         cartItems
//       }
//     });
// });

exports.getCart = catchAsync(async(req, res) => {
  // console.log("getCart",req.session.user)
  const cart = await Cart.findById(req.params.id);
  // console.log(cart)

  res.status(200).json({
    status: 'success',
    results: cart.length,
    data:{
      cart
    }
  })
});

exports.createCart = catchAsync(async(req, res) => {
  // const existingItem = {
  //   product_id: req.body.product_id,
  //   product_name: req.body.product_name,
  //   product_price: req.body.product_price,
  //   product_image: req.body.product_image,
  //   quantity: req.body.quantity,
  // }
  // console.log(existingItem)

  // const {product_id} = req.body
  // console.log(product_id) 
  // let total_quantity = 0;
  // let total_amount = 0;

  const newCart = await Cart.create({
    total_quantity: req.body.quantity,
    total_amount: parseInt(req.body.product_price) * parseInt(req.body.quantity),
    existingItem : [
      {
        product_id: req.body.product_id,
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_image: req.body.product_image,
        quantity: req.body.quantity,
        inventory: req.body.inventory,
        product_sku: req.body.product_sku
      }
    ]
  })
  newCart.total_item = newCart.existingItem.length
  newCart.final_price = parseFloat(newCart.total_amount-newCart.discounted_amount)
  newCart.save()

  // cart.existingItem.map(
  //   (item) => {
  //     total_quantity = parseInt(total_quantity) + parseInt(item.quantity)
  //     total_amount = parseInt(total_amount) + parseInt(item.product_price) * parseInt(item.quantity)
  //     // console.log(item.product_price)
  //   }
  // );
  // cart.total_quantity = total_quantity;
  // cart.total_amount = total_amount;
  // await cart.save()
  // console.log(newCart)
  // newCart.existingItem.push(existingItem)
  // await newCart.save()

  if(newCart){
    // req.session.user.cartId=newCart._id
    res.status(201).json({
        status: 'success',
        data:{
          cart: newCart,
        }
    })
  }
})



// exports.addCartItem = catchAsync(async (req, res, next)  => {
//   console.log(req.body)
//   const cart = await Cart.findById(req.params.id);
//   console.log(cart.total_quantity, cart.total_amount)
//   let total_quantity = cart.total_quantity;
//   let total_amount = cart.total_amount;
//   let discount = '';
//   let discounted_amount = 0;
//   const existingItem = {
//     product_id: req.body.product_id,
//     product_name: req.body.product_name,
//     product_price: req.body.product_price,
//     product_image: req.body.product_image,
//     quantity: req.body.quantity,
//   }

//   //Indexing of existing cart items.
//   const existingCartItemIndex = cart.existingItem.findIndex(
//     (item) => item.product_id === req.body.product_id
//   );
//   const existingCartItem = cart.existingItem[existingCartItemIndex];

//   //Check is existingcartitem exists
//   if(existingCartItem){
//     existingCartItem.quantity = parseInt(existingCartItem.quantity) + parseInt(req.body.quantity)
//     await cart.save()
//   }else{
//     cart.existingItem.push(existingItem)
//     await cart.save()
//   }
  
//   //update total quantity
//   cart.existingItem.map(
//     (item) => {
//       total_quantity = parseInt(total_quantity) + parseInt(item.quantity)
//       total_amount = parseInt(total_amount) + parseInt(item.product_price) * parseInt(item.quantity)
//       // console.log(item.product_price)
//     }
//   );
//   cart.total_quantity = total_quantity;
//   cart.total_amount = total_amount;
//   await cart.save()
//   // console.log(cart)
//   //update discount
//   cart.discount = req.body.discount;
//   cart.discounted_amount = req.body.discounted_amount;
  

//   res.status(200).json({
//     status: 'success',
//     data: {
//       cart
//     }
//   })
// })

exports.addCartItem = catchAsync(async (req, res, next)  => {
  // console.log(req.body)
  const cart = await Cart.findById(req.params.id);
  let total_quantity = 0;
  let total_amount = 0;

  const existingItem = {
    product_id: req.body.product_id,
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_image: req.body.product_image,
    quantity: req.body.quantity,
    inventory: req.body.inventory,
    product_sku: req.body.product_sku
  }
  // console.log(existingItem)

  //Indexing of existing cart items.
  const existingCartItemIndex = cart.existingItem.findIndex(
    (item) => item.product_id === req.body.product_id
  );
  const existingCartItem = cart.existingItem[existingCartItemIndex];

  //Check is existingcartitem exists
  if(existingCartItem){
    //   existingCartItem.quantity = parseInt(existingCartItem.quantity) - parseInt(req.body.quantity)
    // existingCartItem.quantity = parseInt(req.body.quantity)
    existingCartItem.quantity = parseInt(existingCartItem.quantity) + parseInt(req.body.quantity)
    await cart.save()
  }else{
    cart.existingItem.push(existingItem)
    await cart.save()
  }

  //update total quantity
  cart.existingItem.map(
    (item) => {
      total_quantity = parseInt(total_quantity) + parseInt(item.quantity)
      total_amount = parseInt(total_amount) + parseInt(item.product_price) * parseInt(item.quantity)
      // console.log(item.product_price)
    }
  );

  cart.total_item = cart.existingItem.length;
  cart.total_quantity = total_quantity;
  cart.total_amount = total_amount;
  cart.final_price = parseFloat(cart.total_amount-cart.discounted_amount)
  cart.save()

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  })
});

exports.updateCartItem = catchAsync(async (req, res, next)  => {
  const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
  })
  if(req.body.type === "discount"){
    const finalPrice = parseFloat(cart.total_amount-req.body.discounted_amount)
    cart.discount_code = req.body.discount;
    cart.discount_value = req.body.discount_value;
    cart.discounted_amount = req.body.discounted_amount;
    cart.final_price = finalPrice;
    cart.save()
  }else{
    let total_quantity = 0;
    let total_amount = 0;

    const existingItem = {
      product_id: req.body.product_id,
      product_name: req.body.product_name,
      product_price: req.body.product_price,
      product_image: req.body.product_image,
      quantity: req.body.quantity,
      inventory: req.body.inventory,
      product_sku: req.body.product_sku
    }

    const existingCartItemIndex = cart.existingItem.findIndex(
      (item) => item.product_id === req.body.product_id
    );
    const existingCartItem = cart.existingItem[existingCartItemIndex];

    if(existingCartItem){
      existingCartItem.quantity = parseInt(req.body.quantity)
      await cart.save()
    }else{
      cart.existingItem.push(existingItem)
      await cart.save()
    }

    cart.existingItem.map(
      (item) => {
        total_quantity = parseInt(total_quantity) + parseInt(item.quantity)
        total_amount = parseInt(total_amount) + parseInt(item.product_price) * parseInt(item.quantity)
      }
    );

    cart.total_item = cart.existingItem.length;
    cart.total_quantity = total_quantity;
    cart.total_amount = total_amount;
    cart.finalPrice = parseFloat(cart.total_amount-cart.discounted_amount)
    cart.save()
  }

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

// exports.updateDiscount = catchAsync(async(req, res) => {
//   console.log(req.body)
//   // const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
//   //   new: true,
//   //   runValidators: true
//   // })
//   // cart.discount = req.body.discount;
//   // cart.discounted_amount = req.body.discounted_amount;


// })

exports.deleteCartItem = catchAsync(async (req,res) => {
  let total_quantity = 0;
  let total_amount = 0;

  const cart = await Cart.findById(req.params.id);
  const existItems = cart.existingItem
  console.log(existItems)
  console.log(req.body.id)

  //delete Item from existingItems
  let index = existItems.findIndex(item => (item._id).toString() === req.body.id)
  cart.existingItem.splice(index,1)

  //update total quantity
  cart.existingItem.map(
    (item) => {
      total_quantity = parseInt(total_quantity) + parseInt(item.quantity)
      total_amount = parseInt(total_amount) + parseInt(item.product_price) * parseInt(item.quantity)
      // console.log(item.product_price)
    }
  );

  cart.total_item = cart.existingItem.length;
  cart.total_quantity = total_quantity;
  cart.total_amount = total_amount;
  cart.save()

  res.status(204).json({
    status: 'success',
    data:{
      cart
    }
  });
})

exports.deleteCart = catchAsync(async(req, res) => {
  const cart = await Cart.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data:null
  });
})