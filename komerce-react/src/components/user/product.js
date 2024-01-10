import React, { useContext, useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthContext from "../../context/authContext";
import * as ROUTES from "../../constants/routes";

export default function Product() {
  const history = useNavigate();
  const authCtx = useContext(AuthContext);
  // const isAuth = authCtx.isAuth
  const [quantity, setQuantity] = useState("1");
  const [amountIsValid, setAmountIsValid] = useState(true);
  const [cartId, setCartId] = useState(null);
  const userId = authCtx.values.userData.userId;
  console.log(cartId);
  const [error, setError] = useState("");
  let preQuantity = 0;
  // const cartCtx = useContext(CartContext);
  const location = useLocation();
  const { id } = useParams();
  const product = location.state.data;
  const fetchData = async () => {
    const result = await fetch(`http://localhost:3000/users/${userId}`);
    const data = await result.json();
    // console.log(data.data.user.cart_id)
    setCartId(data.data.user.cart_id);
  };

  useEffect(() => {
    // if(!isAuth){
    // 	history(ROUTES.LOGIN)
    // }else{
    // 	fetchData();
    // }
    fetchData();
  }, []);

  const userUpdate = async () => {
    // console.log("called", cartId)
    await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart_id: cartId,
      }),
    });
  };
  const addCartHandler = async (event) => {
    event.preventDefault();
    let url;

    const enteredQuantity = quantity;
    const enteredAmountQuantity = +enteredQuantity;
    if (enteredQuantity.includes(".")) {
      toast.error("Quantity is not valid", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (
      enteredQuantity.trim().length === 0 ||
      enteredAmountQuantity < 1
    ) {
      // setError("Please add product!")
      toast.warn("Add mininum 1 quantity", {
        position: toast.POSITION.TOP_CENTER,
      });
      // setAmountIsValid(true)
    } else if (enteredAmountQuantity > product.inventory) {
      toast.warn(`Maximum Quantity is (${product.inventory})`, {
        position: toast.POSITION.TOP_CENTER,
      });
      // setAmountIsValid(false)
      // setError('')
      // return;
    } else {
      console.log(cartId);
      setAmountIsValid(true);
      setError("");
      if (cartId === null) {
        // console.log("Entered")
        url = "http://localhost:3000/carts";
      } else {
        // console.log("Not entered")
        authCtx.onCart(cartId);
        url = `http://localhost:3000/carts/${cartId}`;
      }
      console.log(url, cartId);
    }

    // const existingItem = {
    // 	product_id: product._id,
    // 	product_name: product.product_name,
    // 	product_price: product.price,
    // 	product_image: product.image,
    // 	quantity: quantity,
    // }

    // cartCtx.addItem({
    // 	product_id: product._id,
    // 	product_name: product.product_name,
    // 	product_price: product.price,
    // 	quantity: quantity,
    // })

    await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: product._id,
        product_name: product.product_name,
        product_price: product.price,
        product_image: product.image,
        quantity: quantity,
        inventory: product.inventory,
        product_sku: product.sku,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.status);
          });
        }
      })
      .then((data) => {
        console.log(data.data.cart._id);
        setCartId(data.data.cart._id);
        // alert("Product added into cart Successfully!")
        toast.success("Product added Successfully!", {
          position: toast.POSITION.TOP_CENTER,
        });
        authCtx.onCart(data.data.cart._id);
        setQuantity("1");
      })
      .catch((err) => {
        console.log(err.message);
      });

    // await fetch("http://localhost:3000/sessionUpdate",{
    // 	method: "PATCH",
    // 	headers: {
    // 		'Accept' : 'application/json',
    // 		'Content-Type' : 'application/json',
    // 	},
    // 	body:JSON.stringify({cartId:cartId})
    // })
  };

  userUpdate();

  return (
    <section>
      <div className="container">
        <div className="product-template page-content">
          <h2>Product Details</h2>
          <div className="product-details row">
            <div className="product-wrap">
              <div className="product-single">
                <div className="product-media">
                  <a href="#">
                    <img src={`images/product/${product.images}`} alt="" />
                  </a>
                </div>
                <div className="product-info">
                  <div className="right-side">
                    <span className="product-sku">{product.sku}</span>
                    <h3 className="product-title main-title">
                      {product.product_name}
                    </h3>
                    <div className="price">
                      <div className="regular-price">
                        <span>
                          <span className="money" data-currency-usd="$200.00">
                            ${product.price}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="line-item-quantity">
                      <span className="line-item__quantity-text">
                        Quantity:
                      </span>
                      <input
                        type="text"
                        name=""
                        size="4"
                        id=""
                        input={{
                          min: "1",
                          max: product.inventory,
                        }}
                        value={quantity}
                        onChange={({ target }) => setQuantity(target.value)}
                      />
                    </div>
                    <div className="product-add">
                      {/* {(quantity>preQuantity) ?
												<button onClick={addCartHandler} className="button button--alt" name="add" id="add" type="submit">Add to Bag</button>
												: 
												setError("Please update Quantity and click!")
											} */}
                      {/* {!amountIsValid && toast.warn("Maximum Quantity is ()", {position: toast.POSITION.TOP_CENTER})} */}
                      {/* {error && <p className="error-message">{error}</p>} */}
                      {/* <ToastContainer className="toaster-style"/> */}
                      <button
                        onClick={addCartHandler}
                        className="button button--alt"
                        name="add"
                        id="add"
                        type="submit"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="desc-wrap">
                <h4>Description</h4>
                <div className="detail-desc">{product.description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
