import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthContext from "../context/authContext";
import * as ROUTES from '../constants/routes';
import '../css/style.css';

export default function Register(){
	const history = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [error, setError] = useState('');
	
	const registerHandler = async(event) => {
		event.preventDefault();
		// console.log(email, password, passwordConfirm);

		await fetch('http://localhost:3000/users/signup',{
            method: 'POST',
			credentials: 'include',
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
				passwordConfirm: passwordConfirm
            })
        }).then(res => {
			// console.log(res.json())
			if(res.ok){
				toast.success("Registered Successfully!", {position: toast.POSITION.TOP_CENTER}) 
                return res.json();
            }else{
                return res.json().then((data) => {
                    console.log(data.status)
					if('email'in data.status && 'password'in data.status && 'passwordConfirm'in data.status){
						throw new Error("Please provide email, password & confirmPassword");
						// console.log(true)
					}else if('password'in data.status && 'passwordConfirm'in data.status){
						if(data.status.password.kind === "minlength"){
							setPassword('');
							throw new Error(data.status.password.message);
						}else{
							throw new Error("Please provide password & confirmPassword");
						}	
					}else if('passwordConfirm'in data.status){
						setPasswordConfirm('')
						throw new Error(data.status.passwordConfirm.message);
					}else{
						throw new Error("Others");
					}
                });
            }
		}).then(() => {
			history(ROUTES.LOGIN)
		}).catch((err) => {
            // console.log(err)
			// if(err.message === "Passwords not matched!" || err.message === "Password must be at least 8 characters"){
			// 	setPassword('');
			// 	setPasswordConfirm('');
			// }
            // setError(err.message)   
			// if(err.message === "Passwords not matched!")       
			toast.error(err.message, {position: toast.POSITION.TOP_CENTER}) 
        })
	}

	useEffect(() => {
        document.title = "Login";
    });

    return(
        <section>
			<div className="form-container sign-up-container">
	            <form action="#" onSubmit={registerHandler}>
	                <h1>Create Account</h1>
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
	                <div className="form-control">
	                	<label htmlFor="name">Confirm Password</label>
	                	<input 
							type="password" 
							placeholder="" 
							value={passwordConfirm}
							onChange={({ target }) => setPasswordConfirm(target.value)}
						/>
	                </div>
					{/* {error && <p className="error-message">{error}</p>} */}
					{/* <ToastContainer className="toaster-style"/> */}
	                <button className="button checkout_btn button--hollow">Sign Up</button>
	            </form>
	        </div>
		</section>
    )
}