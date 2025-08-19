import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useContext, useState } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import './CartCard.css';
import { CartItemsContext } from '../../../../Context/CartItemsContext';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const CartCard = (props) => {
    const cartItems = useContext(CartItemsContext);
    const [size, setSize] = useState(props.item.size[0]);

    const handleQuantityIncrement = () => {
        cartItems.increment(props.item._id);
    };

    const handleQuantityDecrement = () => {
        cartItems.decrement(props.item._id);
    };

    const handleRemoveItem = () => {
        cartItems.removeItem(props.item);
    };

    const handleSizeChange = (event) => {
        setSize(event.target.value);
    };

    return (
        <div className='cart__item__card'>
            <div className="cart__item__detail">
                <div className="cart__item__image">
                    <img src={`https://shema-ecommerce.herokuapp.com/${props.item.category}/${props.item.image[0].filename}`} alt="item" className="item__image"/>
                </div>
                <div className="cart__item__name">{props.item.name}</div>
            </div>
            <div className="cart__item__quantity">
                <IconButton onClick={handleQuantityDecrement}>
                    <RemoveCircleIcon fontSize='medium'/>
                </IconButton>
                <div className="quantity__input">{props.item.itemQuantity}</div>
                <IconButton onClick={handleQuantityIncrement}>
                    <AddCircleIcon />
                </IconButton>
            </div>
            <div className="product size">
                <Box sx={{ minWidth: 80 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Size</InputLabel>
                        <Select
                            value={size}
                            label="size"
                            onChange={handleSizeChange}
                        >
                            {props.item.size.map((size) => <MenuItem key={size} value={size}>{size}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
            </div>
            <div className="cart__item__price">₹{props.item.price}</div>
            <div className="remove__item__icon">
                <IconButton onClick={handleRemoveItem}>
                    <HighlightOffIcon />
                </IconButton>
            </div>
        </div>
    );
};

export default CartCard;
