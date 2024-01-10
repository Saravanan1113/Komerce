import React, {useState, useEffect, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthContext from '../../context/authContext';
import * as ROUTES from '../../constants/routes';

export default function Cart(){
    const history = useNavigate()
    const authCtx = useContext(AuthContext);
    const isAuth = authCtx.isAuth;
    console.log(authCtx.cartId)
    const [cartData, setCartData] = useState([]);
    // const isValid = cartData.discount === '' || cartData.discounted_amount === '';
    const isInvalid = cartData.total_item === 0 || authCtx.cartId === ''
    console.log(isInvalid, cartData.total_item, authCtx.cartId)
    // const [cartId, setCartId] = useState(null);
    console.log(authCtx.cartId)
    const [quantityValue, setQuantityValue] = useState([])
    const [quantity, setQuantity] = useState('');
    const [discountEntered, setDiscountEntered] = useState('');
    const [error, setError] = useState('')
    const [discounts, setDiscounts] = useState([]);
    const [amountIsValid, setAmountIsValid] = useState(true);
    const [existingCartItems, setExistingCartItems] = useState([])
    const [productData, setProductData] = useState([]);

    const fetchProductData = async () => {
		const result = await fetch(`http://localhost:3000/products`)
		const data = await result.json()
        setProductData(data.data.products)
		// const cart = data.data.user.cart_id
        // setCartId(cart)
	}

    const fetchCartData = async () => {
        console.log("entered")
		const result = await fetch(`http://localhost:3000/carts/${authCtx.cartId}`)
		const data = await result.json()
        console.log(data)
        const newData = data.data.cart
        const eData = newData.existingItem
		setCartData(newData)
        setExistingCartItems(eData)
	}
    console.log(cartData)

    const fetchDiscountData = async () => {
        const result = await fetch('http://localhost:3000/discounts')
		const data = await result.json()
		setDiscounts(data.data.discounts)
    }

	useEffect(() => {
        document.title = "Cart"
        // fetchUserData()
        fetchCartData()
        fetchDiscountData()
        fetchProductData()
        // fetchCartData()
	},[])

    const checkInventor = async(productId) =>{
        const result = await fetch(`http://localhost:3000/products/${productId}`)
		const data = await result.json()
        return(parseInt(data.data.product.inventory))
    }

    // useEffect(()=>{
    //     if(cartData.total_item === 0){
    //         alert("Your cart is empty, Please add product!")
    //     }
    // })


    // const inputHandler = (e, id) => {
    //     e.preventDefault()
    //     console.log(e.target.value,id)
    //     setQuantity('')
    //     quantityValue = parseInt(quantity)+parseInt(e.target.value)
    //     existingCartItems.map((list, index) => {
    //         if(index === id){
    //             setQuantity(quantityValue)
    //         }
    //     })

    // }
    const inputHandler = (value, id) => {
        console.log(value, id)
        setQuantity(value)

        existingCartItems.map((item) => {
            if(item.product_id === id){
                // item.quantity = value
                // setCartData({...existingCartItems, quantity:value})
                if(value !== '' && value.toString() !== '0'){
                    const obj = {'id':id, 'quantity':value}
                    quantityValue.push(obj)
                }
                
                // setQuantityValue({
                //     quantityValue: [...quantityValue, obj]
                // })
                // setQuantityValue(prevState => ({
                //     quantityValue: [...prevState.quantityValue, {id:id, quantity:value}]
                // }))
            }
        })
        // e.target.value = 
        // setCartData({...existingItem, quantity:})
    }
    // console.log(quantityValue)

    const overallUpdateHandler = async(event) => {
        quantityValue.forEach(values => {
            existingCartItems.map((item) => {
                if(values.id===item.product_id){
                    updateQuantityHandler(event,item)
                }
            })
        })
    }

    const updateQuantityHandler = async(event, cartItem) => {
        event.preventDefault()
        console.log(quantity)
        const enteredQuantity = quantity;
        console.log(enteredQuantity.trim.length)
		const enteredAmountQuantity = +enteredQuantity;

		if(enteredQuantity.includes('.')){
			toast.error("Quantity is not valid", {position: toast.POSITION.TOP_CENTER})
		}
		else if(enteredQuantity.trim().length === 0 || enteredAmountQuantity < 1)
		{
			// setError("Please add product!")
			toast.warn("Add mininum 1 quantity", {position: toast.POSITION.TOP_CENTER})
			// setAmountIsValid(true)
		}

		else if(enteredAmountQuantity > 5){
			toast.warn("Maximum Quantity is ()", {position: toast.POSITION.TOP_CENTER})
			// setAmountIsValid(false)
			// setError('')
			// return;
		}

		else{

            await fetch(`http://localhost:3000/carts/${authCtx.cartId}`,{
                method: 'PATCH',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    product_id: cartItem.product_id,
                    product_name: cartItem.product_name,
                    product_price: cartItem.product_price,
                    product_image: cartItem.product_image,
                    quantity: quantity,
                })
            }).then(res => {
                if(res.ok){
                    return res.json();
                }else{
                    return res.json().then((data) => {
                        throw new Error(data.status);
                    });
                }
            }).then(data => {
                fetchCartData()
                // alert('Product updated successfully!')
                setQuantity('')
            }).catch((err) => {
                console.log(err.message)
            })
        }
    }

    const applyDiscountHandler = async(event) => {
        event.preventDefault()
        let discountedPrice = 0;
        let discountIndex;
        let discountCode;

        const discountList = discounts.map(discount => discount.discount_code)
        if(cartData.discount_code !==""){
            toast.error("Coupon already applied", {position: toast.POSITION.TOP_CENTER})
            setDiscountEntered('')
        }else{
            if(discountList.includes(discountEntered)){
                // setError('')
                discountIndex = discounts.findIndex(
                    (discount) => discount.discount_code === discountEntered
                );
                discountCode = discounts[discountIndex]
                if(discountCode.status === 'Active'){
                    // const discountInfo = discountCode
                    // if(discountCode){
                    //     // setError('')
                        setCartData({...cartData, discount: discountEntered})
                            if(discountCode.applied_all === 'all'){
                                existingCartItems.map(item => {
                                    // console.log(cartData.total_amount)
                                    const discountValue=Math.abs((discountCode.discount_value/100)*100).toFixed(2)
                                    let totalDiscount=parseFloat(item.product_price*discountValue/100)
                                    const discountedAmount = parseFloat(item.product_price-totalDiscount)
                                    discountedPrice = parseFloat(discountedPrice+totalDiscount*item.quantity)
                                    // const discountAmount = 
                                    // const finalPrice = (totalDiscount*item.quantity).toFixed(2)
                                    // discountedPrice = parseFloat(discountedPrice)+parseFloat(finalPrice)
                                    // const discountedAmount = parseFloat(parseInt(item.product_price)*parseInt(item.quantity))-parseFloat(discountedPrice)
                                    console.log(discountValue, totalDiscount, discountedAmount, discountedPrice)
                                })
                            }
                            else{
                                discountCode.products.map(product => {
                                    existingCartItems.map(item => {
                                        // console.log(item)
                                        // console.log(item.product_id, product)
                                        if(item.product_id === product){
                                            const discountValue=Math.abs((discountCode.discount_value/100)*100).toFixed(2)
                                            let totalDiscount=parseFloat(item.product_price*discountValue/100)
                                            const discountedAmount = parseFloat(item.product_price-totalDiscount)
                                            discountedPrice = parseFloat(discountedPrice+totalDiscount*item.quantity)
                                        //     console.log(product)
                                        //     const discountValue=Math.abs((discountCode.discount_value/100)*100).toFixed(2)
                                        //     let totalDiscount=parseFloat(item.product_price-(item.product_price*discountValue/100))
                                        //     totalDiscount = totalDiscount
                                        //     const finalPrice = (totalDiscount*item.quantity).toFixed(2)
                                        //     console.log("final",finalPrice)
                                        //     discountedAmount = parseFloat(discountedAmount)+parseFloat(finalPrice)
                                        //     console.log("discount",discountedAmount)
                                            console.log(discountValue, totalDiscount, discountedAmount, discountedPrice)
                                        }
                                    })
                                })
                            }  
                }else{
                    toast.error("Please fill valid coupon!", {position: toast.POSITION.TOP_CENTER})
                    setDiscountEntered('')
                }
            
            }else{
                toast.error("Please fill valid coupon!", {position: toast.POSITION.TOP_CENTER})
                setDiscountEntered('')
                // setError("Please provide valid Coupon!")
            }
            if(discountedPrice>0){
                await fetch(`http://localhost:3000/carts/${authCtx.cartId}`,{
                                method: 'PATCH',
                                headers: {
                                    'Accept' : 'application/json',
                                    'Content-Type' : 'application/json',
                                },
                                body: JSON.stringify({
                                    type: "discount",
                                    discount: discountEntered,
                                    discount_value: discountCode.discount_value,
                                    discounted_amount: discountedPrice
                                })
                            }).then(data=>{
                                setDiscountEntered('')
                                fetchCartData()
                                toast.success("Coupon Applied!", {position: toast.POSITION.TOP_CENTER})
                            })
                const timeUsed = discountCode.time_used+1
                // console.log(discountCode.time_used,timeUsed)
                await fetch(`http://localhost:3000/discounts/${discountCode._id}`,{
                    method: 'PATCH',
                    headers: {
                        'Accept' : 'application/json',
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify({
                        time_used: timeUsed
                    })
                })
            }else{

                toast.error("Coupon is not valid for these products!", {position: toast.POSITION.TOP_CENTER})
                setDiscountEntered('')
            }
            
        }
        
        // if(cartData.total_item === 0 || cartData.discount !==""){
        //     alert("Your cart is empty, Please add product!")
        // }else{
        //     discountIndex = discounts.findIndex(
        //         (discount) => discount.discount_code === discountEntered
        //     );
            
        //     discountCode = discounts[discountIndex] 
        //     console.log(discountCode)
        // }

        // if(discountCode){
        //     // setError('')
        //     setCartData({...cartData, discount: discountEntered})
        //         if(discountCode.applied_all === 'all'){
        //             console.log("For All products")
        //         }else{
        //             discountCode.products.map(product => {
        //                 existingCartItems.map(item => {
        //                     // console.log(item)
        //                     // console.log(item.product_id, product)
        //                     if(item.product_id === product){
        //                         console.log(product)
        //                         const discountValue=Math.abs((discountCode.discount_value/100)*100).toFixed(2)
        //                         let totalDiscount=parseFloat(item.product_price-(item.product_price*discountValue/100))
        //                         totalDiscount = totalDiscount
        //                         const finalPrice = (totalDiscount*item.quantity).toFixed(2)
        //                         console.log("final",finalPrice)
        //                         discountedAmount = parseFloat(discountedAmount)+parseFloat(finalPrice)
        //                         console.log("discount",discountedAmount)
        //                     }
        //                     else{
        //                         console.log(product)
        //                         discountedAmount = parseFloat(discountedAmount)+parseFloat(item.product_price)
        //                         console.log(discountedAmount)
        //                     }
        //                 })
        //             })
        //         }  
        // }else{
        //     setError("Please enter valid Coupon!");
        //     setDiscountEntered('')
        // }
        // discounts.filter(discount => {
        //     if(discount.discount_code.includes(discountEntered)){
        //         setCartData({...cartData, discount: discountEntered})
        //         if(discount.applied_all === 'all'){
        //             console.log("For All products")
        //         }else{
        //             discount.products.map(product => {
        //                 console.log(product)
        //                 existingCartItems.map(item => {
        //                     if(item.product_id === product){
        //                         const discountValue=Math.abs((discount.discount_value/100)*100).toFixed(2)
        //                         let totalDiscount=parseFloat(item.product_price-(item.product_price*discountValue/100))
        //                         totalDiscount = totalDiscount
        //                         const finalPrice = (totalDiscount*item.quantity).toFixed(2)
        //                         // console.log("final",finalPrice)
        //                         discountedAmount = parseFloat(discountedAmount)+parseFloat(finalPrice)
        //                         console.log("discount",discountedAmount)
        //                     }else{
        //                         // console.log(item.product_price)
        //                         discountedAmount = parseFloat(discountedAmount)+parseFloat(item.product_price)
        //                     }
        //                 })
        //             })
        //         }  
        //     }else{
        //         setError("Please enter valid Coupon!");
        //         setDiscountEntered('')
        //     }
        // })
        
        // await fetch(`http://localhost:3000/carts/${authCtx.cartId}`,{
		// 	method: 'PATCH',
		// 	headers: {
		// 		'Accept' : 'application/json',
		// 		'Content-Type' : 'application/json',
		// 	},
		// 	body: JSON.stringify({
		// 		discount: discountEntered,
        //         discounted_amount: discountedAmount
		// 	})
		// }).then(data=>{
        //     fetchCartData()
        // })
    }


    const deleteProductHandler = async(event, id) => {
        console.log(id)
        event.preventDefault();
        await fetch(`http://localhost:3000/carts/${authCtx.cartId}`,{
			method: 'DELETE',
			headers: {
				'Accept' : 'application/json',
				'Content-Type' : 'application/json',
			},
            body: JSON.stringify({
				id: id
			})
		}).then(data=>{
            fetchCartData()
        })
    }

    // console.log(cartData)
    return(
        isInvalid === true ?
        <h3 className="no-data">Your cart is Empty! Please add product.</h3>
        :
        <section>
			<div className="container">
				<div className="cart-template page-content">
					<h2>Cart</h2>
					<div className="cart-count-price">
	                    <p className="no-margin">
	                        <span className="cart-total-quantity">TOTAL: {cartData.total_quantity} items</span>
	                        <strong className="cart-total-price">
	                        	(<span><span id="revy-cart-subtotal-price">${cartData.total_amount}</span></span>)
	                        </strong>
	                    </p>
	                </div>
	                <div className="main-cart-wrapper">
		                <div className="cart__items cart__block">
			                <div className="line-items">
                                {
                                    existingCartItems.map((cartItem, i) => (
                                        // parseInt(cartItem.inventory) > 0 ?
                                        <div className="line-item" key={cartItem._id}>
                                            <div className="line-item__left">
                                                <div className="line-item__image-wrapper">
                                                    <img className="line-item__image" src={`images/product/${cartItem.product_image}`} alt=""/>
                                                </div>
                                            </div>	
                                            <div className="line-item__right">
                                                <div className="line-item__details">
                                                    <h2 className="line-item-title">
                                                        <Link to={ROUTES.PRODUCT.replace(":id",cartItem.product_id)} className="cart__product-title">
                                                            {cartItem.product_name}
                                                        </Link>
                                                    </h2>
                                                    <a onClick={(e) => deleteProductHandler(e,cartItem._id)} title="Remove item" className="line-item__remove">
                                                        <svg aria-hidden="true" viewBox="0 0 448 512" className="svg-inline--fa fa-trash-alt fa-w-14 fa-3x">
                                                            <path fill="currentColor" d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" className=""></path>
                                                        </svg>
                                                    </a>
                                                </div>
                                                
                                                <div className="line-item__price">
                                                    <span><strong>Price:</strong></span>${cartItem.product_price}
                                                </div>
                                            
                                                <div className="line-item__total-amount-price">
                                                    <span><strong>Total Price:</strong></span>${cartItem.product_price*cartItem.quantity}
                                                </div>
                                            
                                                <div className="line-item__quantity">
                                                    <span className="line-item__quantity-text">Quantity:</span>
                                                    <input 
                                                        type="text" 
                                                        // name="updates[]" 
                                                        pattern="[0-9]*"
                                                        size="4" 
                                                        input={{
                                                            min:'1',
                                                            max: cartItem.inventory,
                                                        }}
                                                        defaultValue={cartItem.quantity}
                                                        onChange={(e) => {
                                                            // inputHandler(e, i) 
                                                            if(!e.target.validity.valid){
                                                                toast.error("Quantity should be number!", {position: toast.POSITION.TOP_CENTER})
                                                            }
                                                            else if(e.target.value === '' || e.target.value ===0){
                                                                toast.warn(`You can choose maximum (${cartItem.inventory}) only!`, {position: toast.POSITION.TOP_CENTER})
                                                            }else{
                                                                inputHandler(e.target.value, cartItem.product_id)
                                                            }
                                                        }}
                                                    />
                                                    <button onClick={(e)=> {
                                                        updateQuantityHandler(e,cartItem)
                                                        if(amountIsValid === true){
                                                            toast.success("Product updated successfully!", {position: toast.POSITION.TOP_CENTER})
                                                        }else{
                                                            toast.error(`You can choose maximum (${cartItem.inventory}) only!`, {position: toast.POSITION.TOP_CENTER})
                                                        }
                                                        }} 
                                                    className="button update_btn" type="submit">Update Quantity</button>
                                                </div>
                                                {/* {!amountIsValid && <p>You can choose maximum () only!</p>} */}
                                            </div>
                                        </div>
                                        // : null
                                    ))
                                }
			                </div>
		                </div>
		                <div className="cart__details cart__block">
			                <div className="cart__details-wrap">
			                    <h5>ORDER SUMMARY</h5>
			                    <p className="no-margin evenly-align">
			                        <span className="cart-total-quantity">{cartData.total_quantity} items</span>
			                        <span className="cart-total-price">
			                        	<span>${cartData.total_amount}</span>
			                        </span>
			                    </p>
                                {cartData.discounted_amount !== 0 &&
                                    <div className="cart-subtotal evenly-align cart__total">
                                        <span className="cart-subtotal__title">Discount</span>
                                        <strong><span className="cart-subtotal__price">-${cartData.discounted_amount}</span></strong>
                                    </div>
                                }
			                  	<div className="cart-subtotal evenly-align cart__total">
			                        <span className="cart-subtotal__title">Subtotal</span>
			                        <strong><span className="cart-subtotal__price">${parseFloat(cartData.total_amount)-parseFloat(cartData.discounted_amount)}</span></strong>
			                    </div>
			                    <div className="cart__total evenly-align">
			                        <span className="cart__total-text">Total:</span>  
			                        <strong className="cart__total-price">
			                        	<span>${parseFloat(cartData.total_amount)-parseFloat(cartData.discounted_amount)}</span>
			                        	<span> USD</span>
			                        </strong>
			                    </div>
			                  	<button className="button update_btn" type="submit" 
                                    onClick={(e) => {
                                        overallUpdateHandler(e) 
                                        toast.success("Product updated successfully!", {position: toast.POSITION.TOP_CENTER})
                                    }}>Update Quantity</button>
			                    <Link to={cartData.total_item !== 0 ? ROUTES.CHECKOUT: ROUTES.COLLECTIONS} className="button checkout_btn button--hollow">Checkout</Link>
			                  	<div className="cart-promo">
			                    	<h5>ENTER A PROMO CODE</h5>
                                    {error && <p className="error-message">{error}</p>}
			                    	<input 
                                        type="text" 
                                        id="devPromo"
                                        value={discountEntered}
                                        onChange={({target}) => setDiscountEntered(target.value)}
                                    />
                                    <Link to={ROUTES.CART} onClick={applyDiscountHandler}>Apply Coupon</Link>
                                    {/* {isValid === false? 
                                        <Link to={ROUTES.CART} disabled={!isValid} className={`${!isValid}-sub`}>Apply Coupon</Link>
                                        : 
                                        <Link to={ROUTES.CART} onClick={applyDiscountHandler}>Apply Coupon</Link>
                                    } */}
			                  	</div>
			                  	<div className="text-center mt-20">
			                  		<Link to={ROUTES.COLLECTIONS} title="Continue shopping">Continue shopping</Link>
			                  	</div>
			                </div>
			              
			            </div>
	                </div>
				</div>
			</div>
		</section>
    )
}