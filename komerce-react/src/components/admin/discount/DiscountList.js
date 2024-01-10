import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import * as ROUTES from '../../../constants/routes';

export default function DiscountList(){
	const [discounts, setDiscounts] = useState([]);
	const [checkVal, setCheckVal] = useState('');
	console.log(checkVal)
	let isInvalid = checkVal === undefined
	const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	
	const fetchData = async () => {
		const result = await fetch('http://localhost:3000/discounts')
		const data = await result.json()
		setDiscounts(data.data.discounts)
	}

	useEffect(() => {
		document.title = "Discounts"
		fetchData()
	},[])

    return(
        <section className="flex">
			<div className="container-fluid">
				<div className="admin-content">
					<div className="admin-left-nav mt-20">
						<ul>
							<li><Link to={ROUTES.PRODUCTLIST}>Products</Link></li>
							<li><Link to={ROUTES.ORDERLIST}>Orders</Link></li>
							<li><Link to={ROUTES.DISCOUNTLIST} className="active">Discount</Link></li>
						</ul>
					</div>
					<div className="admin-right page-content">
						<div className="products-list">
							<div className="actions flex items-center">
								<h3>Discounts</h3>
								<Link to={ROUTES.CREATEDISCOUNT} className="button button--hollow justify-end inline-block">Create Discount</Link>
							</div>
							<div className="actions flex items-center flex-start">
								{/* <span><span id="count">1</span> selected</span> */}
								<Link to={isInvalid === true ? ROUTES.DISCOUNTLIST:ROUTES.UPDATEDISCOUNT.replace(":id",checkVal)} 
									state= {{data:
										(discounts.filter(discount =>{
											if(checkVal.includes(discount._id)){
												return discount
											}
										}))[0]
									}}
									className="white-btn items-center"
									>Edit Discounts
								</Link>
								{/* <Link to={ROUTES.UPDATEDISCOUNT.replace(":id",discount._id)} state={{data: discount}}><u>{discount.discount_code}</u></Link> */}
							</div>
							<div className="added-products">
								<table className="table">
									<thead>
										<tr>
											<th><input type="checkbox" id="select-all"/></th>
											<th>Discount Code</th>
											<th>Times Used</th>
											<th>Start Date</th>
											<th>End Date</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{discounts.map(discount => (
											<tr key={discount._id}>
												<td><input 
														type="radio" 
														name="discount-item"
														value={discount._id}
														onClick={({target}) => setCheckVal(target.value)}
													/>
												</td>
												<td>
													<Link to={ROUTES.UPDATEDISCOUNT.replace(":id",discount._id)} state={{data: discount}}><u>{discount.discount_code}</u></Link>
													<p>{`${discount.discount_value}%  off one-time purchase products`}</p>
												</td>
												<td><span>{discount.time_used}</span> used</td>
												<td>{
													`${month[new Date(discount.active_from).getMonth()]} 
													 ${new Date(discount.active_from).getDate()}, 
													 ${new Date(discount.active_from).getFullYear()}`
													}
												</td>
												<td>{
													`${month[new Date(discount.expiry_at).getMonth()]} 
													 ${new Date(discount.expiry_at).getDate()}, 
													 ${new Date(discount.expiry_at).getFullYear()}`
													}
												</td>
												<td className={`${discount.status==="Active"? "color-green": discount.status==="Expired" ? "color-red": ""}`}>{discount.status}</td>
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