import { useEffect, useState } from "react";
import { CartItemsContext } from "./CartItemsContext";
import { showAlert } from '../components/Alert/AlertSystem';

const CartItemsProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmountOfItems, setTotalAmountOfItems] = useState(0);

  // Add item to cart
  const addToCartHandler = (item, quantity) => {
    const { _id, name, price, image, category, size } = item;

    setCartItems((prevItems) => {
      const filtered = prevItems.filter((prevItem) => prevItem._id !== _id);
      const newItems = [
        ...filtered,
        { _id, name, price, image, category, itemQuantity: quantity, size },
      ];
      
      // Show alert when item is added to cart
      showAlert(`${name} added to cart!`, 'success');
      
      return newItems;
    });
  };

  // Remove item from cart
  const removeFromCartHandler = (item) => {
    setCartItems((prevItems) =>
      prevItems.filter((prevItem) => prevItem._id !== item._id)
    );
    showAlert(`${item.name} removed from cart!`, 'info');
  };

  // Increment quantity
  const incrementHandler = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId
          ? { ...item, itemQuantity: item.itemQuantity + 1 }
          : item
      )
    );
  };

  // Decrement quantity
  const decrementHandler = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId && item.itemQuantity > 1
          ? { ...item, itemQuantity: item.itemQuantity - 1 }
          : item
      )
    );
  };

  // Calculate total
  const calculateTotalAmount = (cartItems) => {
    let total = 0;
    cartItems.forEach((item) => {
      const cleanPrice = Number(
        String(item.price).replace(/[^0-9.-]+/g, "")
      );
      total += cleanPrice * Number(item.itemQuantity || 0);
    });
    setTotalAmountOfItems(total);
  };

  // Recalculate whenever cart changes
  useEffect(() => {
    calculateTotalAmount(cartItems);
  }, [cartItems]);

  const cartItemCtx = {
    items: cartItems,
    totalAmount: totalAmountOfItems,
    addItem: addToCartHandler,
    removeItem: removeFromCartHandler,
    increment: incrementHandler,
    decrement: decrementHandler,
    clearCart: () => {
      setCartItems([]);
      showAlert('Cart cleared successfully!', 'warning');
    }
  };

  return (
    <CartItemsContext.Provider value={cartItemCtx}>
      {props.children}
    </CartItemsContext.Provider>
  );
};

export default CartItemsProvider;
