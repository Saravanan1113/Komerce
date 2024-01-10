import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

export default function MyOrders(){
	const [orderData, setOrderData] = useState([]);
	const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	const fetchOrderData = async() => {
		const result = await fetch('http://localhost:3000/orders')
		const data = await result.json()
		const orders = data.data.order
		let paidOrders = []
		orders.map(order=>{
			if(order.order_status !== "pending"){
				paidOrders.push(order)
			}
		})
		setOrderData(paidOrders)
	}

	useEffect(() => {
		document.title = "My Orders"
		fetchOrderData()
	},[])
	
	let val = 0
	orderData.map(order=> {
		if(order.order_status !== "pending"){
			val = val+1
		}
	})
	// console.log(val)

    return(
        <section>
			<div className="container">
				<div className="checkout-template page-content">
					<h2>My Orders</h2>
					<div className="my-orders row">
						<div className="orders-wrap">
							<div className="orders-list">
								<table>
									<thead>
										<tr>
											<th>S. No</th>
											<th>Order No.</th>
											<th>Date</th>
											<th>Payment Status</th>
											<th>Fulfillment Status</th>
											<th className="text-right">Total</th>
										</tr>
									</thead>
									<tbody>
										{
											orderData.map((order, i) => (
												order.order_status !== "pending" ?
												<tr key={order._id}>
													<td>{i+1 < 9 ? "0"+(i+1): i+1}</td>
													<td><Link to={ROUTES.NEWORDERDETAIL.replace(":id",order._id)} state={{data: orderData}}><u>#{order.order_no}</u></Link></td>
													<td>{`${month[new Date(order.orderedDate).getMonth()]} 
														${new Date(order.orderedDate).getDate()}, 
														${new Date(order.orderedDate).getFullYear()}`}
													 </td>
													<td>{order.order_status}</td>
													<td>Fulfilled</td>
													<td className="text-right">${order.final_price}</td>
												</tr>
												:
												null
											))
										}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
    )
}