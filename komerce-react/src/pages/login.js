import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthContext from "../context/authContext";
import * as ROUTES from "../constants/routes";
import "../css/style.css";

export default function Login() {
  const history = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState('');
  const isInvalid = email === "" && password === "";

  const authCtx = useContext(AuthContext);

  const loginHandler = async (event) => {
    event.preventDefault();
    // console.log(email, password);

    await fetch("http://localhost:3000/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        // console.log(res)
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            // console.log(data)
            throw new Error(data.status);
          });
        }
      })
      .then((data) => {
        console.log(data.data);
        console.log(data.sessionId);
        // console.log(data.session.user.cartId)
        authCtx.onLogin(data.data);
        authCtx.onSession(data.sessionId);
        authCtx.onCart(data.data.userData.cartId);
        // authCtx.onLogin(data.token)
        // authCtx.onLogin(data.sessionId, data.session.isAuth, data.userId, data.cartId, data.role)
        // authCtx.onLogin(data.sessionId, data.session.isAuth, data.data.userId, data.session.user.cart_id, data.data.role)
        if (data.data.userData.role === "admin") {
          history(ROUTES.PRODUCTLIST);
        } else {
          history(ROUTES.COLLECTIONS);
        }
      })
      .catch((err) => {
        setPassword("");
        if (isInvalid) {
          toast.error("Please provide email & password!", {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.error(err.message, { position: toast.POSITION.TOP_CENTER });
        }
      });

    // await fetch(`http://localhost:3000/mySessions`,{
    //     method: 'PATCH',
    //     body: JSON.stringify({
    //         userId: sessionData.userId,
    //         cartId: sessionData.cartId,
    //         user_role: sessionData.user_role
    //     })
    // })
  };

  useEffect(() => {
    document.title = "Login";
  });

  return (
    <section>
      <div className="form-container sign-up-container">
        <form action="#" onSubmit={loginHandler}>
          <h1>Login</h1>
          <div className="form-control">
            <label htmlFor="name">Email Address</label>
            <input
              type="email"
              placeholder=""
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="name">Enter Password</label>
            <input
              type="password"
              placeholder=""
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          {/* {error && <p className="error-message">{error}</p>} */}
          {/* <ToastContainer className="toaster-style"/> */}
          <button className="button button--hollow justify-end inline-block">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
