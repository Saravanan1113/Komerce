import React,{useEffect, useContext, useState} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AuthContext from '../../context/authContext';
import * as ROUTES from '../../constants/routes';

export default function OrderSuccess(){
    const history = useNavigate();
    // const authCtx = useContext(AuthContext);
    // const isAuth = authCtx.isAuth;
    const {id} = useParams();
    const [orderData, setOrderData] = useState([])
    const [sessionData, setSessionData] = useState([]);
    const [productSku, setProductSku] = useState([]); 
    const [userData, setUserData] = useState([]);

    const fetchSessionData = async() => {
		const result = await fetch("http://localhost:3000/user/sessions", {
            method: "GET",
            credentials: "include",
            headers: {
            "Content-Type": "application/json",
            },
		});
		const data = await result.json();
        console.log(data)
		if(data.isAuth){
			setSessionData(data);
		}
	}

    const patchOrderData = async () => {
        await fetch(`http://localhost:3000/orders/${id}`,{
            method: 'PATCH',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                order_status: "Paid"
            })
        })
    }
    const fetchOrderData = async () => {
		const result = await fetch(`http://localhost:3000/orders/${id}`)
		const data = await result.json()
        const order = data.data.order
        const prod = data.data.order.products
        setOrderData(order)
        prod.map(item => {
            setProductSku(prod)
        })
    }

    const fetchUserData = async() => {
		const result = await fetch(`http://localhost:3000/users/${sessionData.userId}`)
		const data = await result.json()
		setUserData(data.data.user)
	}

    const removeCartData = async() => {
        await fetch(`http://localhost:3000/carts/${sessionData.cart_id}`,{
            method: 'DELETE',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
            }
        })

        await fetch(`http://localhost:3000/users/${sessionData.userId}`,{
            method: 'PATCH',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                cart_id: "",
            })
        })
    }

    const reduceInventory = async ()=>{
        const result = await fetch(`http://localhost:3000/products`)
        const data = await result.json()
        const products = data.data.products
        products.map(product => {
            productSku.filter(sku => {
                if(sku.product_sku === product.sku){
                    const inventUpdate = product.inventory - sku.quantity;
                    console.log(inventUpdate)
                    fetch(`http://localhost:3000/products/${product._id}`,{
                        method: 'PATCH',
                        headers: {
                            'Accept' : 'application/json',
                            'Content-Type' : 'application/json',
                        },
                        body: JSON.stringify({
                            inventory: inventUpdate
                        })
                    })
                }
            })
        })
    }

    useEffect(() => {
        document.title = "order-success";
        fetchSessionData()
        patchOrderData()
        fetchUserData()
        fetchOrderData()
        removeCartData()
        reduceInventory()
    },[])
    // console.log(userData)
    // console.log(orderData,sessionData,userData,productSku)
    return(
        <section>
			<div className="container">
				<div className="checkout-template page-content">
					<h2>Thank you</h2>
					<div className="checkout-details row">
						<div className="checkout-wrap">
							<div className="checkout-section">
								<div className="contact-info">
									
									<div className="fieldset">
										<h3>Order Placed</h3>
										<p className="mt-20">Thank you for placing your order.</p>
										<p className="mt-20">Your order no.: <Link to={ROUTES.NEWORDERDETAIL.replace(":id",orderData._id)} state={{data: orderData}}> <u>{orderData.order_no}</u></Link>. You can check your order <Link to={ROUTES.NEWORDERDETAIL.replace(":id",orderData._id)} state={{data: orderData}}><u>details</u></Link> here.</p>
									</div>
									
									
									<div className="action-btn">
										<Link to={ROUTES.ORDERS} className="button button--hollow">My Orders</Link>
			                    		<Link to={ROUTES.COLLECTIONS} className="button secondary-btn">Continue Shopping</Link>
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