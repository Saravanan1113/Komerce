import React, { useState } from 'react';

const CartContext = React.createContext({
    items: [],
    totalAmount: 0,
    addItem: (item) => {},
    removeItem: (id) => {}
});

console.log(CartContext);

export const CartContextProvider = (props) => {
   const [items, setItems] = useState(null);

   const addItemHandler = (items) =>{
       setItems(items)
   }

   const contextVal = {
       items: items,
       addItem: addItemHandler,
   }
   
   console.log(contextVal)
   return(
       <CartContext.Provider value={contextVal}>
           {props.children}
       </CartContext.Provider>
   )
};

export default CartContext;