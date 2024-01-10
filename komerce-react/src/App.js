import { lazy, Suspense, useContext } from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import * as ROUTES from './constants/routes';

import Header from "./constants/header";
import Footer from "./constants/footer";
import { AuthContextProvider } from "./context/authContext";
import AuthContext from './context/authContext';
import { ProtectedRoute }from "./constants/protected-route";
import { useEffect } from "react/cjs/react.production.min";
// import useAuthListener from "./context/use-auth-listener";

const Login = lazy(() => import('./pages/login'));
const Register = lazy(() => import('./pages/register'));
const Collections = lazy(() => import('./components/user/collections'));
const Product = lazy(() => import('./components/user/product'));
const CreateProduct = lazy(() => import('./components/admin/product/createProduct'));
const ProductList = lazy(() => import('./components/admin/product/productList'));
const UpdateProduct = lazy(() => import('./components/admin/product/updateProduct'));
const CreateDiscount = lazy(() => import('./components/admin/discount/createDiscount'));
const DiscountList = lazy(() => import('./components/admin/discount/DiscountList'));
const UpdateDiscount = lazy(() => import('./components/admin/discount/updateDiscount'));
const OrderList = lazy(() => import('./components/admin/order/orderList'));
const OrderDetails = lazy(() => import('./components/admin/order/orderDetails'));
const Cart = lazy(() => import('./components/user/cart'));
const Checkout = lazy(() => import('./components/user/checkout'));
const OrderSuccess = lazy(() => import('./components/user/order-success'));
const MyOrders = lazy(() => import('./components/user/myOrders'));
const NewOrderDetails = lazy(() => import('./components/user/orderDetails'));

function App(){
    // const authCtx = useContext(AuthContext);
    // console.log(authCtx.values)
    return(
        <Router>
            <AuthContextProvider>
                <ToastContainer className="toaster-style"/>
                <div className="main-content">
                    <Header />
                    <Suspense fallback={<p>Loading...</p>}>
                        <Routes>
                            <Route path={ROUTES.LOGIN} element={<Login/>} />
                            <Route path={ROUTES.REGISTER} element={<Register/>} />
                            <Route path={ROUTES.COLLECTIONS} element={<ProtectedRoute component={Collections}/>} />
                            {/* <Route path={ROUTES.COLLECTIONS} element={isAuth? <Collections/>: <Login/>} exact/> */}
                            {/* <Route path={isAuth? ROUTES.COLLECTIONS:ROUTES.LOGIN } element={<Collections/>} exact/> */}
                            <Route path={ROUTES.PRODUCT} element={<ProtectedRoute component={Product}/>} />
                            <Route path={ROUTES.CREATEPRODUCT} element={<ProtectedRoute component={CreateProduct}/>} />
                            <Route path={ROUTES.PRODUCTLIST} element={<ProtectedRoute component={ProductList}/>} />
                            <Route path={ROUTES.UPDATEPRODUCT} element={<ProtectedRoute component={UpdateProduct}/>} />
                            <Route path={ROUTES.CREATEDISCOUNT} element={<ProtectedRoute component={CreateDiscount}/>} />
                            <Route path={ROUTES.DISCOUNTLIST} element={<ProtectedRoute component={DiscountList}/>} />
                            <Route path={ROUTES.UPDATEDISCOUNT} element={<ProtectedRoute component={UpdateDiscount}/>} />
                            <Route path={ROUTES.ORDERLIST} element={<ProtectedRoute component={OrderList}/>} />
                            <Route path={ROUTES.ORDERDETAIL} element={<ProtectedRoute component={OrderDetails}/>}/>
                            <Route path={ROUTES.CART} element={<ProtectedRoute component={Cart}/>} />
                            <Route path={ROUTES.CHECKOUT} element={<ProtectedRoute component={Checkout}/>} />
                            <Route path={ROUTES.ORDERSUCCESS} element={<ProtectedRoute component={OrderSuccess}/>} />
                            <Route path={ROUTES.ORDERS} element={<ProtectedRoute component={MyOrders}/>} />
                            <Route path={ROUTES.NEWORDERDETAIL} element={<ProtectedRoute component={NewOrderDetails}/>} />
                        </Routes>
                        {/* <ProtectedRoute isAuth={isAuth} path={ROUTES.COLLECTIONS} element={<Collections/>} exact/> */}
                    </Suspense>
                    <Footer />
                </div>
            </AuthContextProvider>
        </Router>
    );
}

export default App;