import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "../../../constants/routes";

const SpecifiedProducts = ({productsList, data}) => {
    const [allProducts, setAllProducts] = useState([]);
    const productArray = []

	const fetchData = async () => {
		const result = await fetch(`http://localhost:3000/products/`)
		const data = await result.json()
        setAllProducts(data.data.products)
	}

    const specificProductHandler = () => {
        allProducts.filter(product =>{
            if(productsList.includes(product._id)){
                productArray.push(product)
            }
        })
    }

    const removeSpecificProductHandler = (e,pid) => {
        e.preventDefault()
        let index = productsList.indexOf(pid)
        productsList.splice(index,1)
        fetchData()
    }

	useEffect(() => {
		document.title = "Update Product"
        fetchData();
	},[])

    specificProductHandler();
    // console.log(productArray)
 

    return(
        <div className="added-products mt-20">
			<table className="table">
				<tbody>
                    {productArray.map(product => (
                        <tr key={product._id}>
                            <td><span className="admin-list-img"><img src={`../images/product/${product.image}`} alt=""/></span></td>
                            <td>
                                <div className="">
                                    <Link to={ROUTES.UPDATEPRODUCT.replace(":id",product._id)}><u>{product.product_name}</u></Link>
                                </div>
                            </td>
                            <td className="text-right">
                                <Link to={ROUTES.UPDATEDISCOUNT} onClick={(e)=>removeSpecificProductHandler(e,product._id)}><u>Remove</u></Link>
                            </td>
                        </tr>
                    ))}
				</tbody>
			</table>
	    </div>
    )
}

export default SpecifiedProducts;