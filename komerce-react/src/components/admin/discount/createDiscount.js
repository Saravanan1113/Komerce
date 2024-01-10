import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as ROUTES from '../../../constants/routes';
import Modal from "./Modal";
import '../../../css/style.css';

export default function AddDiscount(){
	const history = useNavigate();
	const [modal, setModal] = useState(false);
	const [error, setError] = useState('');
	const [checked, setChecked] = useState('');
	const selectedProducts = []

	const initialState = {
		discount_code: '',
        discount_value: '',
        discount_status: '',
        active_from: '',
        expiry_at: '',
        applied_all: '',
        products: []
	}
	const [discountData, setDiscountData] = useState(initialState)

	useEffect(()=> {
		document.title="Add Discount"
	})

	const addDiscountHandler = async(event) => {
		event.preventDefault();
		await fetch('http://localhost:3000/discounts',{
			method: 'POST',
			headers: {
				'Accept' : 'application/json',
				'Content-Type' : 'application/json',
			},
			body: JSON.stringify({
				discount_code: discountData.discount_code,
				discount_value: discountData.discount_value,
				discount_status: discountData.discount_status,
				active_from: discountData.active_from,
				expiry_at: discountData.expiry_at,
				time_used: discountData.time_used,
				applied_all: discountData.applied_all,
				products: discountData.products
			})
		}).then(res => {
			if(res.ok){
				return res.json();
			}else{
				return res.json().then((data) => {
					throw new Error(data.status);
				});
			}
		}).then(() => {
			history(ROUTES.DISCOUNTLIST)
		}).catch((err) => {
			if(err.message === 'This Code is already Exists!'){
				setDiscountData({discount_code: ''});
				setError(err.message)
			}else if(err.message === "All"){
				const message = "Please Provide all details!"
				setError(message)
			}else{
				setError(err.message)
			}
		})
	}

	const clearDiscountHandler = (event) => {
		event.preventDefault();
		setDiscountData({...initialState});
		setChecked('');
		setError('');
	}

	const showModal = () => {
		setModal(!modal)
		if(checked === 'specific'){
			if(selectedProducts.length > 0){
				setDiscountData({...discountData,applied_all:false})
				setDiscountData({...discountData,products:selectedProducts});
			}
			else{
				setChecked('')
				setDiscountData({...discountData,applied_all:''})
			}
		}
	}
	// console.log(checked)
	// console.log(discountData.products)
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
								<h3>TRYNEW</h3>
							</div>
							<div className="view-orders">
								<div className="main-cart-wrapper">
					                <div className="cart__items cart__block">
						                <div className="form-inline">
						                	<div className="order__details-wrap">
						                		<div className="flex">
							                		<div className="w-50 pr-10">
								                    	<h4>Discount code</h4>
								                    	<input 
															type="text" 
															placeholder="" 
															className=""
															value={discountData.discount_code}
															onChange={({ target }) => setDiscountData({...discountData,discount_code:target.value})}
														/>
							                    	</div>
							                    	<div className="w-50 pl-10">
								                    	<h4>Discount Value (in %)</h4>
								                    	<input 
															type="text" 
															placeholder="" 
															className=""
															value={discountData.discount_value}
															onChange={({ target }) => setDiscountData({...discountData,discount_value:target.value})}
														/>
								                    </div>
							                    </div>
							                    <div className="mt-10">
							                    	<h4>Status</h4>
							                    	<div className="">
														<label htmlFor="enable">
															<input 
																type="radio" 
																className="input-text" 
																id="enable" 
																name="status"
																checked = {discountData.discount_status === 'enable' ? true : false}
																onChange={({ target }) => setDiscountData({...discountData,discount_status:target.id})}
															/>
															Enable
														</label>
													</div>
													<div className="mt-10">
														<label htmlFor="disable">
															<input 
																type="radio" 
																className="input-text" 
																id="disable" 
																name="status"
																checked = {discountData.discount_status === 'disable' ? true : false}
																onChange={({ target }) => setDiscountData({...discountData,discount_status:target.id})}
															/>
															Disable
														</label>
													</div>
							                    </div>
							                </div>
							                <div className="order__details-wrap mt-20">    
							                    <div className="">
							                    	<h4>Applies to</h4>
							                    	<div className="">
														<label htmlFor="all">
															<input 
																type="radio" 
																className="input-text" 
																id="all" 
																name="products"
																checked={checked==="all" ? true: false}
																onChange={({target}) => {
																	setDiscountData({...discountData,applied_all:target.id})
																	setChecked(target.id)
																}}
															/>
															All Products
														</label>
													</div>
													<div className="mt-10">
														<label htmlFor="specific">
															<input 
																type="radio" 
																className="input-text" 
																id="specific" 
																name="products"
																checked={checked==="specific" ? true: false}
																onChange={({target}) => {
																	setDiscountData({...discountData,applied_all:target.id})
																	setChecked(target.id)
																	showModal()
																}}
															/>
															Specific products
														</label>
														<Modal show={modal} close={showModal} selectedProducts={selectedProducts} discountData={discountData}/>
													</div>
							                    </div>
							                    <div className="mt-20 discount-period">
							                    	<h4>Active Dates</h4>
							                    	<div className="flex">
							                    		<div className="w-50 pr-10">
							                    			<label htmlFor="">Start Date</label>
								                    		<input 
																type="date" 
																placeholder="" 
																className=""
																value={discountData.active_from}
																onChange={({ target }) => setDiscountData({...discountData,active_from:target.value})}
															/>
								                    	</div>
								                    	<div className="w-50 pl-10">
							                    			<label htmlFor="">End Date</label>
								                    		<input 
																type="date" 
																placeholder="" 
																className=""
																value={discountData.expiry_at}
																onChange={({ target }) => setDiscountData({...discountData,expiry_at:target.value})}
															/>
								                    	</div>
							                    	</div>
							                    </div>
						                    </div>                    
						                </div>
						                <div className="mt-20">
											{error && <p className="error-message">{error}</p>}
						                	<Link to ={ROUTES.DISCOUNTLIST} onClick={addDiscountHandler} className="button checkout_btn button--hollow">Save</Link>
						                	<button className="button update_btn" type="submit" onClick={clearDiscountHandler}>Discard</button>
						                </div>
					                </div>
					                <div className="cart__details cart__block add-margin">
						                <div className="order__details-wrap">
						                    <h3>Summary</h3>
						                    <div className="border-t mt-10">
							                    <div className="flex mt-20">
							                    	<p>No information entered yet.</p>
							                    </div>
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