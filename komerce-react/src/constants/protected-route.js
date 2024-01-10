import React, {useContext, useEffect, useState} from 'react';
import Login from '../pages/login';
import {Navigate} from 'react-router-dom'

import AuthContext from '../context/authContext';

export const ProtectedRoute = ({component: RouteComponent}) => {
    const authCtx = useContext(AuthContext);
    const [loading, setLoading] = useState(true)
    const [isAuth, setIsAuth] = useState(false)
    const [data, setData] = useState();

    const getSession = async() => {
        console.log("sessions")
        const result = await fetch("http://localhost:3000/user/sessions", {
            method: "GET",
            credentials: "include",
            headers: {
            "Content-Type": "application/json",
            },
        });
        const data = await result.json();
        console.log(data)
        if(data.isAuth){
            setIsAuth(data.isAuth)
            setData(data)
            authCtx.setdata(data)
        }
        // setLoading(true)
        // if(data.isAuth){
        //     setData(data)
        //     setIsAuth(data.isAuth)
        // }else{
        //     setData('')
        //     setIsAuth(false)
        // }
        // setLoading(false)
    }
// getSession()
useEffect(()=> {
    getSession()
},[])
    console.log(loading, isAuth)
    console.log(authCtx.loading)
     if(!loading || !isAuth){
        return <Login />
     }else{
        //  if(isAuth){
        //      console.log("yes auth")
        //     return <RouteComponent/>
        //  }else{
        //      console.log("not auth")
        //     return <Login/>
        //  }
        return <RouteComponent/>
            
     }
}