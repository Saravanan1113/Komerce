import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone} from 'react-dropzone'
import axios from 'axios';

import * as ROUTES from '../../../constants/routes';
import '../../../css/style.css';

export default function AddProduct(){
	const history = useNavigate();
	// const [images, setImages] = useState();
	const [selectedImageFile, setSelectedImageFile] = useState(null);
	const [selectedImageFileUrl, setSelectedImageFileUrl] = useState("");
	const [productData, setProductData] = useState({
		product_name: '',
		sku: '',
		price: '',
		description: '',
		image: '',
		inventory: '',
		product_status: '',
	});
	// console.log(selectedImageFile.name);
	// console.log(selectedImageFileUrl)

	// const imageUploadHandler = async(event) => {
	// 	// console.log(await event.currentTarget.files[0])
	// 	// image_name = await event.currentTarget.files[0]
	// 	// setImages(image_name)
	// 	// console.log(images.name)
	// 	// setProductData(await {...productData, image:images})
	// 	setImages(event.target.files[0]);
	// 	setProductData({...productData, image:`${new Date().getDate()}-${event.target.files[0].name}`})
	// }
	const onDrop = useCallback(
		(acceptedFiles) => {
		setSelectedImageFile(acceptedFiles[0]);
		},
		[setSelectedImageFile]
	);
	useEffect(() => {
		if (selectedImageFile === null) return;
		const reader = new FileReader();
		reader.onload = (e) => {
		setSelectedImageFileUrl(e.target.result);
		};
		reader.readAsDataURL(selectedImageFile);
	}, [setSelectedImageFileUrl, selectedImageFile]);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });




	const addProductHandler = async(event)=> {
		event.preventDefault();
		if(selectedImageFile===null){
			alert("Please add Image")
		}else{
		console.log(productData);
		const formData = new FormData();
		formData.append("file",selectedImageFile);
		formData.append("product_name", productData.product_name)
		formData.append("sku", productData.sku)
		formData.append("price", productData.price)
		formData.append("description", productData.description)
		formData.append("image", `${new Date().getDate()}-${selectedImageFile.name}`)
		formData.append("inventory", productData.inventory)
		formData.append("product_status", productData.product_status)
		console.log(formData)

		
		await axios.post("http://localhost:3000/products",
			formData,
			{headers:{"Content-type": "multipart/form-data"}}
		).then((res)=> {
			console.log(res)
			history(ROUTES.PRODUCTLIST)
		}).catch((err) => {
			alert(err.message)
			if(err.message === "This SKU is already Exists!"){
				setProductData({sku: ''});
			}else{
				setProductData({
					product_name: '',
					sku: '',
					price: '',
					description: '',
					inventory: '',
					product_status: '',
				})
			}
		})
		}
		

		// await fetch('http://localhost:3000/products',{
		// 	method: 'POST',
        //     headers: {
        //         'Accept' : 'application/json',
        //         'Content-Type' : 'application/json',
        //     },
        //     body: JSON.stringify({
        //      	product_name: productData.product_name,
		// 		sku: productData.sku,
		// 		price: productData.price,
		// 		description: productData.description,
		// 		image: productData.image,
		// 		inventory: productData.inventory,
		// 		product_status: productData.product_status
        //     })
		// }).then(res => {
		// 	// console.log(res)
		// 	if(res.ok){
        //         return res.json();
        //     }else{
        //         return res.json().then((data) => {
        //             throw new Error(data.status);
        //         });
        //     }
		// }).then(()=> {
		// 	history(ROUTES.PRODUCTLIST)
		// }).catch((err) => {
		// 	alert(err.message)
		// 	if(err.message === "This SKU is already Exists!"){
		// 		setProductData({sku: ''});
		// 	}else{
		// 		setProductData({
		// 			product_name: '',
		// 			sku: '',
		// 			price: '',
		// 			description: '',
		// 			inventory: '',
		// 			product_status: '',
		// 		})
		// 	}
		// })
	}

	useEffect(() => {
		document.title = "Create-Product";
	})

	// const imageUploadHandler = () => {
	// 	console.log("Entered")
	// 	// console.log(images.sl)
	// 	// image_name = images.File
	// 	// console.log(image_name)
	// }

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
								<h3>Add Product</h3>
								<button onClick={addProductHandler} className="button button--hollow justify-end inline-block">Save</button>
							</div>
							<div className="edit-product">
									<div className="flex">
										<div className="product-lineitems form-section">
											<form action="#">
												<div className="form-control">
													<label htmlFor="product-name">Product Name</label>
													<input 
														type="text" 
														placeholder=""
														value={productData.product_name}
														onChange={({ target }) => setProductData({...productData,product_name:target.value})}
													/>
												</div>
												<div className="form-control">
													<label htmlFor="sku">SKU</label>
													<input 
														type="text" 
														placeholder=""
														value={productData.sku}
														onChange={({ target }) => setProductData({...productData,sku:target.value})}
													/>
												</div>
												<div className="flex">
													<div className="form-control pr-10">
														<label htmlFor="price">Price ($)</label>
														<input 
															type="text" 
															placeholder=""
															value={productData.price}
															onChange={({ target }) => setProductData({...productData,price:target.value})}
														/>
													</div>
													<div className="form-control pl-10">
														<label htmlFor="inventory">Inventory</label>
														<input 
															type="text" 
															placeholder=""
															value={productData.inventory}
															onChange={({ target }) => setProductData({...productData,inventory:target.value})}
														/>
													</div>
												</div>
												<div className="form-control">
													<label htmlFor="status">Product Status</label>
													<div className="mt-10" >
														<span className="pr-20">
															<input 
																type="radio" 
																name="status"
																value="Active"
																onClick={({ target }) => setProductData({...productData,product_status:target.value})}
															/> 
															Active
														</span>
														<span>
															<input 
																type="radio" 
																name="status"
																value="Inactive"
																onClick={({ target }) => setProductData({...productData,product_status:target.value})}
															/> Inactive
														</span>
													</div>
												</div>
												<div className="form-control">
													<label htmlFor="description">Description</label>
													<textarea cols="5" rows="10" value={productData.description} onChange={({ target }) => setProductData({...productData,description:target.value})}></textarea>
												</div>
												<button onClick={addProductHandler} className="button button--hollow justify-end inline-block">Save</button>
											</form>
										</div>
										<div className="product-imageitem">
												<div id="wrapper">
													<label htmlFor="description">Product Image</label>
													<div className="mt-10">
														{/* <div className="drop-zone"> */}
													<div {...getRootProps()} className="drop-zone">
														<input
															{...getInputProps()}
															className="drop-zone__input"
														/>
														{selectedImageFileUrl === "" ? (
															<span className="drop-zone__prompt">
															Drop file here or click to upload
															</span>
														) : (
															<img src={selectedImageFileUrl} />
														)}
													</div>
												    	

										
												    	{/* <input type="file" name="myFile" className="drop-zone__input"/> */}
														{/* <input type="file" name="myFile" className="drop-zone__thumb" onClick={async(event) => {
															const filename = await event.currentTarget.files[0]
															console.log(filename.name)
															setImages(await filename)
															imageUploadHandler()
															}}/> */}
										
														{/* <input 
															type="file" 
															name="myFile" 
															className="drop-zone__input" 
															// files = {productData.image}
															onChange={imageUploadHandler}/>
														{images === "" ?
															<span className="drop-zone__prompt">
															Drop file here or click to upload
															</span>
															:
															<div className='drop-zone__thumb' data-label={'images/green-01.jpg'}></div>
														} */}


														{/* <div className='drop-zone__thumb' data-label={'images/green-01.jpg'}></div> */}
												  		{/* </div> */}
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