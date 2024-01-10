import React, {useEffect, useState, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";

import * as ROUTES from "../../constants/routes";
import AuthContext from '../../context/authContext';
import '../../css/style.css';

export default function Collections(){
	const history = useNavigate()
	const [products, setProducts] = useState([]);
	// const authCtx = useContext(AuthContext);
    // const isAuth = authCtx.values.isAuth
	// console.log(isAuth)

	const fetchData = async () => {
		const result = await fetch('http://localhost:3000/products')
		const data = await result.json()
		console.log(data)
		setProducts(data.data.products)
	}

	useEffect(() => {
		// if(!isAuth){
		// 	console.log("entered")
		// 	history(ROUTES.LOGIN)
		// }else{
		// 	console.log("dump")
		// 	document.title = "Collections"
		// 	fetchData();
		// }
		fetchData();
	},[])

	
    return( 
        <section>
			<div className="container">
				<div className="product-collection page-content">
					<h2>Collections</h2>
					<div className="products-grid row">
						{products.map(product => (
							product.product_status === "Active"?
							<div className="grid-item" key={product._id}>
								<div className="product-item">
									{product.inventory === 0 ?
										<>
											<div className="product-image">
												<img src={`/images/product/${product.image}`} alt="" />
											</div>
											<div className="product-content">
												<h3>{product.product_name}</h3>
												<div className="price">
													<div className="regular-price">
														<span><span className="money">${product.price}</span></span>
													</div>	  
												</div>
											</div>
											<div className="not-available">
												<h4>Currently unavailable</h4>
											</div>
										</>
										:
										<>
											<div className="product-image">
												<Link to={ROUTES.PRODUCT.replace(":id",product._id)} state={{data: product}}>
													<img src={`/images/product/${product.image}`} alt="" />
												</Link>
											</div>
											<div className="product-content">
												<h3><Link to={ROUTES.PRODUCT.replace(":id",product._id)} state={{data: product}} className="product-title" title="">{product.product_name}</Link></h3>
												<div className="price">
													<div className="regular-price">
														<span><span className="money">${product.price}</span></span>
													</div>	  
												</div>
											</div>
										</>
									}
									{/* // <div className="product-image">
									// 	<Link to={ROUTES.PRODUCT.replace(":id",product._id)} state={{data: product}}>
									// 		<img src={`/images/product/${product.image}`} alt="" />
									// 	</Link>
									// </div>
									// <div className="product-content">
									// 	<h3><Link to={ROUTES.PRODUCT.replace(":id",product._id)} state={{data: product}} className="product-title" title="">{product.product_name}</Link></h3>
									// 	<div className="price">
									// 		<div className="regular-price">
									// 			<span><span className="money">${product.price}</span></span>
									// 		</div>	  
									// 	</div>
									// </div> */}
								</div>
							</div>
							: null
						))}
					</div>
				</div>
			</div>
		</section>
     )
}