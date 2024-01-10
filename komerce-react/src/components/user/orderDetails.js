import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function MyOrders() {
  const location = useLocation();
  const { id } = useParams();
  const orderList = location.state.data;
  console.log(id, orderList);
  // const [order, setOrder] = useState([])
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // const fetchOrderData = async() => {
  // 	const result = await fetch(`http://localhost:3000/orders/${id}`)
  // 	const data = await result.json()
  // 	// setOrder(data.data.order)
  // }
  const order = orderList.filter((item) => item._id === id);
  useEffect(() => {
    document.title = "Order Details";
    // fetchOrderData()
  }, []);
  console.log(orderList);

  return (
    <section>
      <div className="container">
        <div className="checkout-template page-content">
          <h2>Order #{order[0].order_no}</h2>
          <p>
            Placed on{" "}
            {`${month[new Date(order[0].orderedDate).getMonth()]} 
									${new Date(order[0].orderedDate).getDate()},
									${new Date(order[0].orderedDate).getFullYear()}`}
          </p>
          <div className="mt-20">
            <div className="flex">
              <div className="address">
                <h3>Billing Address</h3>
                <p>{order[0].billing_address.name}</p>
                <p>{order[0].billing_address.address}</p>
                <p>{order[0].billing_address.postal_code}</p>
                <p className="mt-20">
                  <strong>Payment Status: {order[0].order_status}</strong>
                </p>
              </div>
              <div className="address">
                <h3>Shipping Address</h3>
                <p>{order[0].shipping_address.name}</p>
                <p>{order[0].shipping_address.address}</p>
                <p>{order[0].shipping_address.postal_code}</p>
                <p className="mt-20">
                  <strong>Fulfillment Status: Paid</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="my-orders row">
            <div className="orders-wrap">
              <div className="orders-list">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th className="text-right">Price</th>
                      <th>Quantity</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order[0].products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.product_name}</td>
                        <td>SKU0001</td>
                        <td className="text-right">${product.product_price}</td>
                        <td>{product.quantity}</td>
                        <td className="text-right">
                          $
                          {parseInt(product.product_price) *
                            parseInt(product.quantity)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={4}>Subtotal</td>
                      <td className="text-right">${order[0].total_amount}</td>
                    </tr>
                    <tr>
                      <td colSpan={4}>Shipping</td>
                      <td className="text-right">$0.00</td>
                    </tr>
                    <tr>
                      <td colSpan={4}>Tax (GST)</td>
                      <td className="text-right">$0.00</td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        Discount{" "}
                        <span>
                          (<strong>{order[0].discount_code}</strong>)
                        </span>
                      </td>
                      <td className="text-right">
                        -${order[0].discounted_amount}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <strong>Total</strong>
                      </td>
                      <td className="text-right">
                        <strong>
                          ${order[0].final_price} <span>USD</span>
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
