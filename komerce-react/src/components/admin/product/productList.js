import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../../constants/routes';
import '../../../css/style.css';;

export default function ProductList(){
	const [products, setProducts] = useState([]);
	const [checkVal, setCheckVal] = useState('');
	let isInvalid = checkVal === undefined

	const fetchData = async () => {
		const result = await fetch('http://localhost:3000/products')
		const data = await result.json()
		setProducts(data.data.products)
	}

	useEffect(() => {
		document.title = "Products"
		fetchData()
	},[])
	
    return(
		<section className="flex">
			<div className="container-fluid">
				<div className="admin-content">
					<div className="admin-left-nav mt-20">
						<ul>
							<li><Link to={ROUTES.PRODUCTLIST} className="active">Products</Link></li>
							<li><Link to={ROUTES.ORDERLIST}>Orders</Link></li>
							<li><Link to={ROUTES.DISCOUNTLIST}>Discount</Link></li>
						</ul>
					</div>
					<div className="admin-right page-content">
						<div className="products-list">
							<div className="actions flex items-center">
								<h3>Products</h3>
								<Link to={ROUTES.CREATEPRODUCT} className="button button--hollow justify-end inline-block">Add Product</Link>
							</div>
							<div className="actions flex items-center flex-start">
								{/* <span><span id="count">1</span> selected</span> */}
								<Link to={isInvalid === true ? ROUTES.PRODUCTLIST:ROUTES.UPDATEPRODUCT.replace(":id",checkVal)} className="white-btn items-center">Edit Products</Link>
							</div>
							<div className="added-products">
								<table className="table">
									<thead>
										<tr>
											{/* <th><input type="checkbox" id="select-all"/></th> */}
											<th></th>
											<th>Image</th>
											<th>Product Name</th>
											<th>SKU</th>
											<th>Price</th>
											<th>Inventory</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										{products.map(product => (
											// console.log(product.image)
											<tr key={product._id}>
												<td><input 
														type="radio" 
														name="prod-item"
														value={product._id}
														onClick={({target}) => setCheckVal(target.value)}
													/>
												</td>
												<td><span className="admin-list-img"><img src={`/images/product/${product.image}`} alt=""/></span></td>
												<td>
													<div className="">
														<Link to={ROUTES.UPDATEPRODUCT.replace(":id",product._id)}><u>{product.product_name}</u></Link>
													</div>
												</td>
												<td>{product.sku}</td>
												<td>${product.price}</td>
												<td>{product.inventory}</td>
												<td className={
													`${product.product_status==='Active' ? "color-green":"color-red"}`
												}>{product.product_status}</td>
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