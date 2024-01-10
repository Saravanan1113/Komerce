import React, {useState, useEffect, useCallback, useLayoutEffect, useRef} from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import moment from 'moment';

import * as ROUTES from "../../../constants/routes";
import Modal from "./Modal";
import SpecifiedProducts from "./specifiedProduts";

export default function EditDiscount(){
    const history = useNavigate();
    const [modal, setModal] = useState(false);
    const [error, setError] = useState('');
	const [checked, setChecked] = useState('');
	const selectedProducts = []
    const location = useLocation();
    const {id} = useParams();
	const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    // console.log(id)
    // const discount = location.state.data;

    const initialState = {
		discount_code: '',
        discount_value: '',
        discount_status: '',
        active_from: '',
        expiry_at: '',
        applied_all: '',
        products: []
	}
    const [discountData, setDiscountData] = useState(initialState);
    
    useEffect(()=>{
        document.title ="Update Discount";
        setDiscountData(location.state.data)
		// selectedProducts.push(...discountData.products)
        // setChecked(location.state.data.applied_all)
        // setChecked(discountData.applied_all)
    },[])

    console.log(discountData)
    // setChecked(discountData.applied_all===true ? "all" : "specific")
    console.log(checked)
	// console.log(sele)
    const active_from = new Date(discountData.active_from)
    const activeDate = moment(active_from, 'DD-MM-YYYY').format().split('T')[0]
    const expiry_at = new Date(discountData.expiry_at)
    const expiryDate = moment(expiry_at, 'DD-MM-YYYY').format().split('T')[0]
    

    const editDiscountHandler = async(event) => {
        // console.log(event.target.value)
		event.preventDefault();
        console.log(discountData)
		await fetch(`http://localhost:3000/discounts/${id}`,{
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

    const showModal = () => {
		setModal(!modal)
		if(checked === 'specific'){
			if(selectedProducts.length > 0){
                console.log("entered")
				setDiscountData({...discountData,applied_all:'specific'})
                const allProducts = [...discountData.products,...selectedProducts]
				setDiscountData({...discountData,products:allProducts});
			}
			else{
				setChecked('')
				setDiscountData({...discountData,applied_all:''})
			}
		}else{
            setDiscountData({...discountData,products:[]});
        }
	}

	const deleteDiscountHandler = async(event) => {
		await fetch(`http://localhost:3000/discounts/${id}`,{
			method: 'DELETE',
			headers: {
				'Accept' : 'application/json',
				'Content-Type' : 'application/json',
			},
		}).then(data => {
			history(ROUTES.DISCOUNTLIST)
		}).catch((err) => {
			console.log(err.message)
		})
	}
    
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
								                    	<input type="text" 
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
																checked={discountData.applied_all==='all' ? true: false}
																onChange={({target}) => {
																	setDiscountData({...discountData,applied_all:target.id})
																	setChecked(target.id)
                                                                    // setDiscountData({...discountData,products:null});
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
																checked={discountData.applied_all==='specific' ? true: false}
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
                                                <SpecifiedProducts productsList={discountData.products} data={"Calling"}/>
							                    <div className="mt-20 discount-period">
							                    	<h4>Active Dates</h4>
							                    	<div className="flex">
							                    		<div className="w-50 pr-10">
							                    			<label htmlFor="">Start Date</label>
                                                            <input 
																type="date" 
																placeholder="" 
																className=""
																value={activeDate}
																onChange={({ target }) => setDiscountData({...discountData,active_from:new Date(target.value)})}
															/>
								                    	</div>
								                    	<div className="w-50 pl-10">
							                    			<label htmlFor="">End Date</label>
								                    		<input 
																type="date" 
																placeholder="" 
																className=""
																value={expiryDate}
																onChange={({ target }) => setDiscountData({...discountData,expiry_at:new Date(target.value)})}
															/>
								                    	</div>
							                    	</div>
							                    </div>
						                    </div>
						                    
						                </div>
						                <div className="mt-20">
						                	<button onClick={editDiscountHandler} className="button checkout_btn button--hollow">Save</button>
						                	<button onClick={deleteDiscountHandler}className="button update_btn" type="submit">Delete</button>
						                </div>
					                </div>
					                <div className="cart__details cart__block add-margin">
						                <div className="order__details-wrap">
						                    <h3>Summary</h3>
						                    <div className="border-t mt-10">
							                    <div className="flex mt-20">
							                    	<p><strong>Cart Offer</strong></p>
							                    	<span className={`${discountData.status==="Active"? "color-green": discountData.status==="Expired" ? "color-red": ""}`}>{discountData.status}</span>
							                    </div>
						                    </div>
						                    <ul className="list-items">
						                    	<li>{`${discountData.discount_value}% off products`}</li>
						                    	<li>Active from {`${month[new Date(discountData.active_from).getMonth()]} 
													 ${new Date(discountData.active_from).getDate()}`}</li>
						                    </ul>
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