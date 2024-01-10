import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import * as ROUTES from '../../../constants/routes';

export default function DiscountList(){
	const [orders, setOrders] = useState([]);
	const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	const fetchData = async () => {
		const result = await fetch('http://localhost:3000/orders')
		const data = await result.json()
		console.log(data)
		setOrders(data.data.order)
	}

	useEffect(() => {
		document.title = "Orders"
		fetchData()
	},[])
	console.log(orders)

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
								<h3>Orders</h3>
							</div>
							<div className="added-products">
								<table className="table">
									<thead>
										<tr>
											<th>S. No</th>
											<th>Order No.</th>
											<th>Date</th>
											<th>Payment Status</th>
											<th>Fulfillment Status</th>
											<th>Items</th>
											<th className="text-right">Total</th>
										</tr>
									</thead>
									<tbody>
										{orders.map((order, i) => (
											<tr key={order._id}>
												<td>{i+1 < 9 ? "0"+(i+1): i+1}</td>
												<td><Link to={ROUTES.ORDERDETAIL.replace(":id",order._id)} state={{data: order}}><u>#{order.order_no}</u></Link></td>
												<td>{`${month[new Date(order.orderedDate).getMonth()]} 
														${new Date(order.orderedDate).getDate()}, 
														${new Date(order.orderedDate).getFullYear()}`}
												</td>
												<td>{order.order_status}</td>
												<td>Fulfilled</td>
												<td>{order.products.length} items</td>
												<td className="text-right">${order.discounted_amount}</td>
											</tr>
										))}
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