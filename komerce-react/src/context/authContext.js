// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = React.createContext({
//   sessionId: '',
//   // token: '',
//   userId: '',
//   role: '',
//   cartId: null,
//   orderId: '',
//   isAuth: false,
//   isLoggedIn: false,
//   onLogout: () => {},
//   onLogin: (sessionId, isAuth) => {},
//   onCart: (cartId) => {},
// });

// // console.log(AuthContext);
// export const AuthContextProvider = (props) => {
//     // const [token, setToken] = useState('');
//     const [sessionId, setSessionId] = useState('');
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [isAuth, setIsAuth] = useState(false);
//     const [userId, setUserId] = useState('');
//     const [cartId, setCartId] = useState('');
//     const [role, setRole] = useState('');
//     const [orderId, setOrderId] = useState('');
//     const [data, setData] = useState();
//     const [loading, setLoading] = useState(false)
//     // console.log(isLoggedIn)
//     // console.log(sessionId)
//     const getSession = async() => {
//       console.log("sessions")
//       // const data = await axios.get("http://localhost:3000/user/sessions")
//       const result = await fetch("http://localhost:3000/user/sessions", {
//         method: "GET",
//         credentials: "include",
//         headers: {
//         "Content-Type": "application/json",
//         },
//       });
//       const data = await result.json();
//       console.log("It is",data)
//       if(data.loggedIn){
//         setData(data)
//       }
//       setLoading(true)
//     }

//     useEffect(() => {
//       getSession();
//       const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');
//       // console.log(storedUserLoggedInInformation)

//       // if (storedUserLoggedInInformation === token) {
//       //   setIsLoggedIn(true);
//       // }
//       if(storedUserLoggedInInformation === sessionId){
//         setIsLoggedIn(true);
//       }
//     }, [sessionId]);

//     const logoutHandler = () => {
//       // console.log("entered logout")
//       // setToken('');
//       setSessionId('');
//       setUserId('');
//       setRole('');
//       localStorage.removeItem('isLoggedIn');
//       setIsLoggedIn(false);
//       setIsAuth(false);
//       setCartId(null);
//       setOrderId('');

//     };

//     const loginHandler = (sessionId, isAuth, userId, cartId, role) => {
//       // console.log("entered login")
//       console.log(sessionId)
//       // setToken(token)
//       setSessionId(sessionId)
//       setIsAuth(isAuth);
//       setUserId(userId);
//       setCartId(cartId);
//       setRole(role)
//       // localStorage.setItem('isLoggedIn', token);
//       localStorage.setItem('isLoggedIn', sessionId);
//       setIsLoggedIn(true);
//     };

//     const cartHandler = (cartId) => {
//       console.log(cartId);
//       setCartId(cartId)
//     }

//     const orderHandler = (orderId) =>{
//       setOrderId(orderId)
//     }

//     const contextVal = {
//       sessionId: sessionId,
//       userId: userId,
//       cartId: cartId,
//       orderId: orderId,
//       role: role,
//       // token: token,
//       isLoggedIn: isLoggedIn,
//       isAuth: isAuth,
//       onLogout: logoutHandler,
//       onLogin: loginHandler,
//       onCart: cartHandler,
//       onOrder: orderHandler,
//     }
//     console.log(contextVal)
//     return (
//       <AuthContext.Provider value={contextVal}>
//         {props.children}
//       </AuthContext.Provider>
//     );
// };

// export default AuthContext;


import React, { useState, useEffect } from 'react';
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react/cjs/react.production.min';

const AuthContext = React.createContext({
  values: [],
  userId: '',
  role: '',
  sessionId: '',
  orderId: '',
  cartId: null,
  isAuth: false,
  loading: Boolean,
  isLoggedIn: false,
  setdata: (data) => {},
  onLogin: (data) => {},
  onLogout: () => {},
  onOrder: (orderId) => {},
  onCart: (cartId) => {},
  onSession: (sessionId) => {},
  // getSession: () => {}
});

export const AuthContextProvider = (props) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('')
  const [orderId, setOrderId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isAuth, setIsAuth] = useState('');
  const [cartId, setCartId] = useState('');
  const [role, setRole] = useState('')

  // const getSession = async() => {
  //     console.log("sessions")
  //     const result = await fetch("http://localhost:3000/user/sessions", {
  //       method: "GET",
  //       credentials: "include",
  //       headers: {
  //       "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await result.json();
  //     if(data.isAuth){
  //       setData(data)
  //       setIsAuth(data.isAuth)
  //       setLoading(false)
  //       return data
  //     }
     
  // }

  const loginHandler = async(data) => {
    // console.log(sessionId)
    setData(data);
    setUserId(data.userData.userId)
    setRole(data.userData.role)
   // setLoading(false);
    // setSessionId(sessionId)
    // if(sessionId) {
    //   setLoading(false);
    // }
    localStorage.setItem('isLoggedIn', sessionId);
    setIsLoggedIn(true);
  }

  const logoutHandler = () => {
    setSessionId('');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setOrderId('');
    setIsAuth(false)
  }

  const orderHandler = (orderId) =>{
    setOrderId(orderId)
  }

  const cartHandler = (cartId) => {
    console.log(cartId);
    setCartId(cartId)
  }

  const sessionHandler = (sessionId) => {
    setSessionId(sessionId)
  }

  const setdata = (setdata) => {
    setCartId(setData)
  }

  const contextVal = {
      values: data,
      userId: userId,
      role: role,
      sessionId: sessionId,
      orderId: orderId,
      cartId: cartId,
      isAuth: isAuth,
      loading: loading,
      isLoggedIn: isLoggedIn,
      onOrder: orderHandler,
      setdata: setData,
      onLogin: loginHandler,
      onLogout: logoutHandler,
      onCart: cartHandler,
      onSession: sessionHandler,
      // getSession: getSession
  }
  console.log(contextVal)

  useEffect(() => {
  
    const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');
    // console.log(storedUserLoggedInInformation)

    // if (storedUserLoggedInInformation === token) {
    //   setIsLoggedIn(true);
    // }
    if(storedUserLoggedInInformation === sessionId){
        console.log("entered")
        setIsLoggedIn(true);
    }
  }, [sessionId]);

  return (
      <AuthContext.Provider value={contextVal}>
        {props.children}
      </AuthContext.Provider>
    );
}
// export const useAuth = ()=>{
//   return useContext(AuthContext)
// }

export default AuthContext;