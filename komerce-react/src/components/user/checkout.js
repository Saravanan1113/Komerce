import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStripe } from '@stripe/react-stripe-js';
import validator from "validator";
import axios from "axios";

import AuthContext from '../../context/authContext';
import * as ROUTES from '../../constants/routes';

export default function Checkout(){
	const history = useNavigate()
	const stripe = useStripe();
    const authCtx = useContext(AuthContext);
    const isAuth = authCtx.isAuth;
	const [orderId, setOrderId] = useState('');
	// console.log(orderId)
	const [cartData, setCartData] = useState([]);
	const [discountData, setDiscountData] = useState([]);
	const [orderData, setOrderData] = useState([]);
	const [order,setOrders] = useState([]);
	const [orderNo, setOrderNo] = useState('')
	const [existingCartItems, setExistingCartItems] = useState([]);
	const [userData, setUserData] = useState([])
	const [error, setError] = useState('');
	let discountedAmount
	let orderStart = 0

	const [billingAddress, setBillingAddress] = useState({
		name: '',
        email: '',
        phone: '',
        address: '',
        postal_code: ''
	})
	const [shippingAddress, setShippingAddress] = useState({
		name: '',
        email: '',
        phone: '',
        address: '',
        postal_code: ''
	})

	const isInvalid = billingAddress.name === '' || billingAddress.email === '' || billingAddress.phone === '' || billingAddress.address === '' || billingAddress.postal_code === '' ||
						shippingAddress.name === '' || shippingAddress.email === '' || shippingAddress.phone === '' || shippingAddress.address === '' || shippingAddress.postal_code === ''

	const fetchCartData = async () => {
		const result = await fetch(`http://localhost:3000/carts/${authCtx.cartId}`)
		const data = await result.json()
        const newData = data.data.cart
        const eData = newData.existingItem
		setCartData(newData)
        setExistingCartItems(eData)
		setOrderId(authCtx.orderId)
	}

	const fetchDiscountData = async() => {
		const result = await fetch('http://localhost:3000/discounts')
		const data = await result.json()
		setDiscountData(data.data.discounts)
	}

	const fetchOrderData = async () => {
		console.log("Entered")
		const result = await fetch(`http://localhost:3000/orders/${authCtx.orderId}`)
		const data = await result.json()
		setOrderData(data.data.order)
		const billingData = data.data.order.billing_address
		const shippingData = data.data.order.shipping_address
		setBillingAddress({
			name: billingData.name,
			email: billingData.email,
			phone: billingData.phone,
			address: billingData.address,
			postal_code: billingData.postal_code
		})
		setShippingAddress({
			name: shippingData.name,
			email: shippingData.email,
			phone: shippingData.phone,
			address: shippingData.address,
			postal_code: shippingData.postal_code
		})
		// setOrderNo(data.data.order.order_no)
	}

	const fetchUserData = async() => {
		const result = await fetch(`http://localhost:3000/users/${authCtx.userId}`)
		const data = await result.json()
		setUserData(data.data.user)
	}

	const fetchOrders = async() => {
		const result = await fetch("http://localhost:3000/orders")
		const data = await result.json()
		setOrders(data.data.order)
	}

	const newData = async(data) => {
		const resOrder = await data
		console.log(resOrder)
		setOrderData(resOrder)
		setOrderId(resOrder._id)
		authCtx.onOrder(resOrder.order._id)
	}

	// const orderNoHandler = () =>{
	// 	let total = 0
	// 	console.log("entered")
	// 	// console.log(order.length)
	// 	order.map(item => {
	// 		if(item.user_id===userData._id){
	// 			total = total + 1
	// 		}
	// 	})
	// 	orderStart = 1000+total+1
	// 	// console.log(orderStart)
	// 	setOrderNo(orderStart)
	// }

	useEffect(() => {
		document.title = "Checkout"
        fetchCartData()
		fetchOrders()
		fetchDiscountData()
		fetchUserData()
		if(orderId!==''){
			fetchOrderData()
		}
	},[])
	console.log(orderId, orderData, authCtx.orderId, order)

	const emailValidation = async(event) => {
		const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
		if(!billingAddress.email || regex.test(billingAddress.email) === false || !shippingAddress.email || regex.test(shippingAddress.email) === false){
            alert("Email is not valid");
            return false;
        }else{
			return true;
		}
	}

	const checkoutHandler = async(event) => {
		event.preventDefault();
		let url
		if(!isInvalid){
			if(await emailValidation()){
				let total = 0
				// console.log(order.length)
				order.map(item => {
					if(item.user_id===userData._id){
						total = total + 1
					}
				})
				const orderNo = 1000+total+1
				if(orderId === ''){
					url = 'http://localhost:3000/orders'
					await fetch(url,{
						method: 'POST',
						headers: {
							'Accept' : 'application/json',
							'Content-Type' : 'application/json',
						},
						body: JSON.stringify({
							order_no: orderNo,
							user_id: authCtx.userId,
							billing_address: billingAddress,
							shipping_address: shippingAddress,
							order_status: "pending",
							products: existingCartItems,
							total_quantity: cartData.total_quantity,
							total_amount: cartData.total_amount,
							discounted_amount: cartData.discounted_amount,
							total_item: cartData.total_item,
							discount_code: cartData.discount_code,
							discount_value: cartData.discount,
							final_price: cartData.final_price
						})
					}).then(res => {
						if(res.ok){
							return res.json();
						}else{
							return res.json().then((data) => {
								throw new Error(data.status);
							});
						}
					}).then((data) => {
						console.log(data.data.order)
						// setOrderData(data.data.order)
						// setOrderId(data.data.order._id)
						authCtx.onOrder(data.data.order._id)
						newData(data.data.order)
						alert("Added to order");
					})
				}
				else{
					// orderNoHandler()
					url = `http://localhost:3000/orders/${orderId}`
					await fetch(url,{
						method: 'PATCH',
						headers: {
							'Accept' : 'application/json',
							'Content-Type' : 'application/json',
						},
						body: JSON.stringify({
							order_no: orderNo,
							user_id: authCtx.userId,
							billing_address: billingAddress,
							shipping_address: shippingAddress,
							order_status: "pending",
							products: existingCartItems,
							total_quantity: cartData.total_quantity,
							total_amount: cartData.total_amount,
							discounted_amount: cartData.discounted_amount,
							total_item: cartData.total_item,
							discount_code: cartData.discount_code,
							discount_value: cartData.discount_value,
							final_price: cartData.final_price
						})
					}).then(res => {
						if(res.ok){
							return res.json();
						}else{
							return res.json().then((data) => {
								throw new Error(data.status);
							});
						}
					}).then((data) => {
						// console.log(data)
						alert("Updated Order");
						authCtx.onOrder(data.data.order._id)
						setOrderId(data.data.order._id)
						setOrderData(data.data.order)
					})
				}
				
				let stripeData = []
				let discountedAmount
				// let discount_code = ''
				existingCartItems.map(cartItem => {
					discountData.map(item => {
						if(item.discount_code === cartData.discount_code){
							if(item.applied_all==="all"){
								const discountValue=Math.abs((item.discount_value/100)*100).toFixed(2)
								const totalDiscount=parseFloat(cartItem.product_price*discountValue/100)
								discountedAmount = parseFloat(cartItem.product_price-totalDiscount)
								console.log(discountValue, totalDiscount, discountedAmount)
								// discount_code = item.discount_code
							}
							else if(item.products.includes(cartItem.product_id)){
								console.log(item.products)
								const discountValue=Math.abs((item.discount_value/100)*100).toFixed(2)
								const totalDiscount=parseFloat(cartItem.product_price*discountValue/100)
								discountedAmount = parseFloat(cartItem.product_price-totalDiscount)
								// discount_code = item.discount_code
								console.log(discountValue, totalDiscount, discountedAmount)
								// if(discountedAmount>0) 
								// 	<>
								// 		<span className="order-summary__emphasis__strike">${parseInt(cartItem.product_price)*parseInt(cartItem.quantity)}</span>
								// 		<span className="order-summary__emphasis">${cartItem.discounted_price}</span>
								// 	</>)
							
								// :
								// <span className="order-summary__emphasis">${parseInt(cartItem.product_price)*parseInt(cartItem.quantity)}</span>
							}else{
								console.log("Nothing")
							}
						}
					})
					const obj = {
						name: cartItem.product_name,
						amount: parseInt(discountedAmount),
						quantity: cartItem.quantity,
						currency: "USD",
						// image: cartItem.product_image
					}
					stripeData.push(obj)
				})
				console.log(stripeData, orderData, orderId, authCtx.orderId)
				const session = await axios.post("http://localhost:3000/stripe/payment", {
					lineItem: stripeData, orderId: authCtx.orderId
				})
				console.log(session)
				const { error } = await stripe.redirectToCheckout({
					sessionId: session.data.session.id,
				});
			}
		}
		// if(!isInvalid){
		// 	if(await emailValidation()){
		// 		await fetch('http://localhost:3000/orders',{
		// 			method: 'POST',
		// 			headers: {
		// 				'Accept' : 'application/json',
		// 				'Content-Type' : 'application/json',
		// 			},
		// 			body: JSON.stringify({
		// 				order_no: "10002",
		// 				user_id: "abcdefg1234",
		// 				billing_address: billingAddress,
		// 				shipping_address: shippingAddress,
		// 				order_status: "pending",
		// 				products: existingCartItems,
		// 				total_quantity: cartData.total_quantity,
		// 				total_amount: cartData.total_amount,
		// 				discounted_amount: cartData.discounted_amount,
		// 				total_item: cartData.total_item,
		// 				discount_code: cartData.discount_code,
		// 				discount_value: cartData.discount
		// 			})
		// 		}).then(res => {
		// 			if(res.ok){
		// 				return res.json();
		// 			}else{
		// 				return res.json().then((data) => {
		// 					throw new Error(data.status);
		// 				});
		// 			}
		// 		}).then((data) => {
		// 			alert("Added to order");
		// 			authCtx.onOrder(data.data.order._id)
		// 		})
		// 		console.log(authCtx.orderId)

		// 		// await fetch(`http://localhost:3000/payment`,{
		// 		// 	method: 'POST',
		// 		// 	headers: {
		// 		// 		'Accept' : 'application/json',
		// 		// 		'Content-Type' : 'application/json',
		// 		// 	},
		// 		// 	body: JSON.stringify({
		// 		// 		lineItem: stripeData
		// 		// 	})
		// 		// })
		// 		const session = await axios.post("http://localhost:3000/stripe/payment", {
		// 			lineItem: stripeData, orderId: authCtx.orderId
		// 		})
		// 		console.log(session)
		// 		const { error } = await stripe.redirectToCheckout({
		// 			sessionId: session.data.session.id,
		// 		});
		// 	}


		// }else{
		// 	alert("Please fill all the data!")
		// }
	}
	// console.log(discountData)

    return(
        <section>
			<div className="container">
				<div className="checkout-template page-content">
					<h2>Checkout</h2>
					<div className="checkout-details row">
						<div className="checkout-wrap">
							<div className="checkout-section">
								<div className="contact-info">
									
									<div className="fieldset">
										<h3>Contact information</h3>
										<div className="field-input">
											<label htmlFor="name">Name</label>
											<span>
												<input 
													type="text" 
													className="input-text" 
													placeholder="Enter your name"
													value={billingAddress.name}
													onChange={({ target }) => setBillingAddress({...billingAddress,name:target.value})}
												/>
											</span>
										</div>
										<div className="field-input">
											<label htmlFor="name">Email Id</label>
											<span>
												<input 
													type="email" 
													// className="input-text" 
													placeholder="Enter your email id"
													value={billingAddress.email}
													onChange={({target}) => {
														setBillingAddress({...billingAddress,email:target.value})
														// validateEmail(billingAddress.email);
													}}
													// onChange={({target}) => validateEmail(...target.value,target.value)}
												/>
											</span>
										</div>
										<div className="field-input">
											<label htmlFor="name">Phone</label>
											<span>
												<input 
													type="text" 
													className="input-text" 
													placeholder="Enter your phone no."
													value={billingAddress.phone}
													onChange={({ target }) => setBillingAddress({...billingAddress,phone:target.value})}
												/>
											</span>
										</div>
										<div className="field-input">
											<label htmlFor="name">Address</label>
											<span>
												<input 
													type="text" 
													className="input-text" 
													placeholder="Enter your address"
													value={billingAddress.address}
													onChange={({ target }) => setBillingAddress({...billingAddress,address:target.value})}
												/>
											</span>
										</div>
										<div className="field-input">
											<label htmlFor="name">Postal Code</label>
											<span>
												<input 
													type="text" 
													className="input-text" 
													placeholder="Enter your postal code"
													value={billingAddress.postal_code}
													onChange={({ target }) => setBillingAddress({...billingAddress,postal_code:target.value})}
												/>
											</span>
										</div>
									</div>
									
									<div className="fieldset">
										<h3>Shipping Address</h3>
										<div className="field-input">
											<label htmlFor="name">Name</label>
											<span>
												<input 
													type="text" 
													className="input-text" 
													placeholder="Enter your name"
													value={shippingAddress.name}
													onChange={({ target }) => setShippingAddress({...shippingAddress,name:target.value})}
												/>
											</span>
										</div>
										<div className="field-input">
											<label htmlFor="name">Email Id</label>
											<span>
												<input 
													type="email" 
													pattern=".+@globex\.com"
													className="input-text" 
													placeholder="Enter your email id"
													value={shippingAddress.email}
													onChange={({ target }) => setShippingAddress({...shippingAddress,email:target.value})}
												/>
											</span>
										</div>
										<div className="field-input">
											<label htmlFor="name">Phone</label>
											<span>
												<input 
													type="text" 
													className="input-text" 
													placeholder="Enter your phone no."
													value={shippingAddress.phone}
													onChange={({ target }) => setShippingAddress({...shippingAddress,phone:target.value})}
												/>
											</span>
										</div>
										<div className="field-input">
											<label htmlFor="name">Address</label>
											<span>
												<input 
													type="text" 
													className="input-text" 
													placeholder="Enter your address"
													value={shippingAddress.address}
													onChange={({ target }) => setShippingAddress({...shippingAddress,address:target.value})}
												/>
											</span>
										</div>
										<div className="field-input">
											<label htmlFor="name">Postal Code</label>
											<span>
												<input 
													type="text" 
													className="input-text" 
													placeholder="Enter your postal code"
													value={shippingAddress.postal_code}
													onChange={({ target }) => setShippingAddress({...shippingAddress,postal_code:target.value})}
												/>
											</span>
										</div>
									</div>
									<div className="action-btn">
										<button className="button button--hollow" onClick={checkoutHandler}>Proceed to Payment</button>
			                    		<Link to={ROUTES.CART} className="button secondary-btn">Return to Cart</Link>
									</div>
								</div>
								<div className="order-summary-right">
									<div className="order-summary__sections">
									    <div className="">
						                    <div className="order-summary__section__content">
						                    	<table className="product-table">
						                    		<thead className="product-table__header">
												        <tr>
												          <th><span className="visually-hidden">Image</span></th>
												          <th><span className="visually-hidden">Description</span></th>
												          <th><span className="visually-hidden">Quantity</span></th>
												          <th><span className="visually-hidden">Price</span></th>
												        </tr>
												    </thead>
												    <tbody>
														{existingCartItems.map(cartItem => (
															<tr className="product" key={cartItem._id}>
																<td className="product__image">
																	<div className="product-thumbnail ">
																		<div className="product-thumbnail__wrapper">
																			<img alt="Basic Green T-Shirt" className="product-thumbnail__image" src={`images/product/${cartItem.product_image}`}/>
																		</div>
																		<span className="product-thumbnail__quantity">{cartItem.quantity}</span>
																	</div>
																</td>
																<td className="product__description" scope="row">
																	<span className="product__description__name">{cartItem.product_name}</span>
																	<span className="product__description__variant"></span>
																</td>
																<td className="product__quantity">
																	<span className="visually-hidden">1</span>
																</td>
																<td className="product__price">
																	{
																		discountData.map(item => {
																			if(item.discount_code === cartData.discount_code){
																				if(item.applied_all==="all"){
																					const discountValue=Math.abs((item.discount_value/100)*100).toFixed(2)
																					const totalDiscount=parseFloat(cartItem.product_price*discountValue/100)
																					discountedAmount = parseFloat(cartItem.product_price-totalDiscount)
																					// console.log(discountValue, totalDiscount, discountedAmount)
																				}
																				else if(item.products.includes(cartItem.product_id)){
																					console.log(item.products)
																					const discountValue=Math.abs((item.discount_value/100)*100).toFixed(2)
																					const totalDiscount=parseFloat(cartItem.product_price*discountValue/100)
																					discountedAmount = parseFloat(cartItem.product_price-totalDiscount)
																					// console.log(discountValue, totalDiscount, discountedAmount)
																					// if(discountedAmount>0) 
																					// 	<>
																					// 		<span className="order-summary__emphasis__strike">${parseInt(cartItem.product_price)*parseInt(cartItem.quantity)}</span>
																					// 		<span className="order-summary__emphasis">${cartItem.discounted_price}</span>
																					// 	</>)
																				
																					// :
																					// <span className="order-summary__emphasis">${parseInt(cartItem.product_price)*parseInt(cartItem.quantity)}</span>
																				}else{
																					console.log("Nothing")
																				}
																			}
																		})

																	}
																	{discountedAmount > 0 ?
																		<>
																			<span className="order-summary__emphasis__strike">${parseInt(cartItem.product_price)*parseInt(cartItem.quantity)}</span>
																			<span className="order-summary__emphasis">${parseFloat(discountedAmount)*parseFloat(cartItem.quantity)}</span>
																		</>
																		:
																		<span className="order-summary__emphasis">${parseFloat(cartItem.product_price*cartItem.quantity)}</span>
																	}	
																</td>
															</tr> 
														))}
												    </tbody>
						                    	</table>
						                    </div>
						                    <p className="no-margin evenly-align mt-20">
						                        <span className="cart-total-quantity">{cartData.total_item} items</span>
						                        <span className="cart-total-price">
						                        	<span>${cartData.total_amount}</span>
						                        </span>
						                    </p>
						                    <div className="cart-subtotal evenly-align cart__total">
						                        <span className="cart-subtotal__title">Discount</span>
						                        <strong><span className="cart-subtotal__price">-${cartData.discounted_amount}</span></strong>
						                    </div>
						                  	<div className="cart-subtotal evenly-align cart__total">
						                        <span className="cart-subtotal__title">Subtotal</span>
						                        <strong><span className="cart-subtotal__price">${(parseFloat(cartData.total_amount)-parseFloat(cartData.discounted_amount)).toFixed(2)}</span></strong>
						                    </div>
						                    <div className="cart__total evenly-align separator">
						                        <span className="cart__total-text">Total:</span>  
						                        <strong className="cart__total-price text-lg">
						                        	<span>{(parseFloat(cartData.total_amount)-parseFloat(cartData.discounted_amount)).toFixed(2)}</span>
						                        	<span> USD</span>
						                        </strong>
						                    </div>
						                </div>
								  	</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
    )
}