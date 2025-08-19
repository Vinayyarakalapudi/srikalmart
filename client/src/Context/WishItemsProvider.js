import { useContext, useState } from "react";
import { CartItemsContext } from "./CartItemsContext";
import { WishItemsContext } from "./WishItemsContext";
import { showAlert } from '../components/Alert/AlertSystem';

const WishItemsProvider = (props) => {
    const [wishItems, setWishItems] = useState([]);
    const cartItems = useContext(CartItemsContext);

    const addToCartHandler = (item) => {
        cartItems.addItem(item, 1);
    };

    const addToWishHandler = (item) => {
        const { _id, name, price, image, category, size } = item;
        const existingItem = wishItems.find(prevItem => prevItem._id === _id);
        
        if (!existingItem) {
            setWishItems((prevItems) => [...prevItems, {_id, name, price, image, category, size, itemQuantity: 1}]);
            showAlert(`${name} has been added to your wishlist!`, 'info');
        } else {
            showAlert(`${name} is already in your wishlist!`, 'info');
        }
    };

    const removeFromWishHandler = (item) => {
        setWishItems(wishItems.filter((prevItem) => prevItem._id !== item._id));
    };

    const wishItemsCtx = {
        items: wishItems,
        addItem: addToWishHandler,
        removeItem: removeFromWishHandler,
        addToCart: addToCartHandler,
    };

    return ( 
        <WishItemsContext.Provider value={wishItemsCtx}>
            {props.children}
        </WishItemsContext.Provider>
     );
};
 
export default WishItemsProvider;
