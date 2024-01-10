import { useState, useEffect } from "react";

const Modal = ({ show, close, selectedProducts, discountData }) => {
  console.log(discountData);
  const [allProducts, setAllProducts] = useState([]);
  const checkedItems = [...discountData.products];
  const fetchData = async () => {
    const result = await fetch("http://localhost:3000/products");
    const data = await result.json();
    setAllProducts(data.data.products);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectProductHandler = () => {
    checkedItems.map((val) => selectedProducts.push(val));
    if (selectedProducts.length > 0) {
      close();
    } else {
      alert("Please choose atleast one product!");
    }
  };

  const onChangeHandler = (e) => {
    // e.preventDefault()
    if (e.target.checked) {
      checkedItems.push(e.target.value);
      // console.log(checkedItems)
    } else {
      let index = selectedProducts.indexOf(e.target.value);
      checkedItems.splice(index, 1);
    }
  };
  console.log(checkedItems);
  console.log(selectedProducts);
  console.log(discountData);

  return (
    <>
      {show ? (
        <div id="show-modal" style={{ display: "flex" }}>
          <div className="overlay"></div>
          <div className="admin-right page-content">
            <div className="products-list">
              <div className="actions flex items-center">
                <h3>Select Products</h3>
              </div>
              <div className="added-products border-t">
                <div className="overflow-auto">
                  <table className="table mt-20">
                    <thead>
                      <tr>
                        <th>
                          <input type="checkbox" id="select-all" />
                        </th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Inventory</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProducts.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <input
                              type="checkbox"
                              name="prod-item"
                              value={product._id}
                              checked={checkedItems.includes(product._id)}
                              // checked = {
                              //     console.log(checkedItems)
                              // }
                              onChange={onChangeHandler}
                            />
                          </td>
                          <td>
                            <span className="admin-list-img">
                              <img
                                src={`../images/product/${product.image}`}
                                alt=""
                              />
                            </span>
                          </td>
                          <td>
                            <div className="">
                              <a href="edit-product.html">
                                <u>{product.product_name}</u>
                              </a>
                            </div>
                            <span>
                              SKU: <span>{product.sku}</span>
                            </span>
                          </td>
                          <td>${product.price}</td>
                          <td>{product.inventory}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-20">
                <button
                  className="button checkout_btn button--hollow"
                  onClick={selectProductHandler}
                >
                  Add Products
                </button>
                <button
                  className="button update_btn"
                  id="close-modal"
                  type="submit"
                  onClick={() => close()}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
