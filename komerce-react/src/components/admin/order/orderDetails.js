import React, {useState, useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';

import * as ROUTES from '../../../constants/routes';

export default function OrderDetails(){
    const location = useLocation();
    const [orderDetails, setOrderDetails] = useState([]);
    const [products, setProducts] = useState([]);
    const [billingDetails, setBillingDetails] = useState({});
    const [shippingDetails, setShippingDetails] = useState({})
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    useEffect(()=>{
        document.title = "Order Detail"
        setOrderDetails(location.state.data)
        setProducts(location.state.data.products)
        setBillingDetails(location.state.data.billing_address)
        setShippingDetails(location.state.data.shipping_address)
    })
    return(
        <section className="flex">
			<div className="container-fluid">
				<div className="admin-content">
					<div className="admin-left-nav mt-20">
						<ul>
                            <li><Link to={ROUTES.PRODUCTLIST}>Products</Link></li>
							<li><Link to={ROUTES.ORDERLIST} className="active">Orders</Link></li>
							<li><Link to={ROUTES.DISCOUNTLIST}>Discount</Link></li>
						</ul>
					</div>
					<div className="admin-right page-content">
						<div className="products-list">
							<div className="actions flex items-center">
								<h3>#{orderDetails.order_no}</h3>
							</div>
							<div className="actions flex items-center flex-start">
								<span>{`${month[new Date(orderDetails.orderedDate).getMonth()]} 
										${new Date(orderDetails.orderedDate).getDate()}, 
										${new Date(orderDetails.orderedDate).getFullYear()} at 
                                        ${new Date(orderDetails.orderedDate).getHours()}:${new Date(orderDetails.orderedDate).getMinutes()}
                                        ${new Date(orderDetails.orderedDate).getHours()>=12? "pm": "am"}`
                                       }
                                </span>
							</div>
							<div className="view-orders">
								<div className="main-cart-wrapper">
					                <div className="cart__items cart__block">
						                <div className="line-items">
						                	<table className="table">
                                                <tbody>
                                                    {products.map(product => (
                                                        /*Change key later as _id*/
                                                        <tr key={product.product_sku}> 
                                                            <td>
                                                                <div className="image-wrapper">
                                                                    <img className="line-item__image" src={`/images/product/${product.product_image}`} alt=""/>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <h2 className="line-item-title">Basic Green Shirt</h2>
                                                                <label htmlFor="">SKU: <span>{product.product_sku}</span></label>
                                                            </td>
                                                            <td>
                                                                ${product.product_price} × <span>{product.quantity}</span>
                                                            </td>
                                                            <td>
                                                                ${(product.product_price*product.quantity).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
						                	</table>
						                </div>
						                <div className="order__details-wrap mt-10">
						                	<div className="flex">
						                    	<h4>Paid</h4>
						                    </div>
						                    <div className="flex border-t">
						                    	<span>Subtotal</span>
						                    	<span>{orderDetails.total_item} item</span>
						                    	<span>${orderDetails.total_amount}</span>
						                    </div>
						                    <div className="flex">
						                    	<span>Shipping</span>
						                    	<span>Standard (3.0 kg)</span>
						                    	<span>$0</span>
						                    </div>
						                    <div className="flex">
						                    	<span>Tax</span>
						                    	<span>GST 7%</span>
						                    	<span>$0</span>
						                    </div>
						                    <div className="flex">
						                    	<span>Discount</span>
						                    	<span>{orderDetails.discount_code}</span>
						                    	<span>${orderDetails.total_discount}</span>
						                    </div>
						                    <div className="flex">
						                    	<span><strong>Total</strong></span>
						                    	<span><strong>${orderDetails.discounted_amount}</strong></span>
						                    </div>
						                    <div className="flex border-t">
						                    	<span>Paid by customer</span>
						                    	<span>${orderDetails.discounted_amount}</span>
						                    </div>
						                    <div className="mt-20">
							                	<button className="button update_btn" type="submit">Fulfill Item</button>
				                    			<button className="button checkout_btn button--hollow">Create Shipping Label</button>
							                </div>
						                </div>
					                </div>
					                <div className="cart__details cart__block add-margin">
						                <div className="order__details-wrap">
						                    <h4>Customer</h4>
						                    <p><a href="#">{billingDetails.name}</a></p>
						                    <p>{orderDetails.total_item} orders</p>
						                </div>
						                <div className="order__details-wrap mt-10">
						                	<div className="flex">
						                    	<h4>Contact Information</h4>
						                    	{/* <a href="#"><u>Edit</u></a> */}
						                    </div>
						                    <p><a href="#">{billingDetails.email}</a></p>
						                    <p>{billingDetails.phone}</p>
						                </div>
						                <div className="order__details-wrap mt-10">
						                	<div className="flex">
						                    	<h4>Shipping Address</h4>
						                    	{/* <a href="#"><u>Edit</u></a> */}
						                    </div>
						                    <p>{shippingDetails.name}</p>
						                    <p>{shippingDetails.address}</p>
						                    <p>{shippingDetails.postal_code}</p>
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