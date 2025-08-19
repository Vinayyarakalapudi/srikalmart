import './Checkout.css';
import { useContext, useState } from 'react';
import { CartItemsContext } from '../../Context/CartItemsContext';

const Checkout = () => {
    const cartItems = useContext(CartItemsContext);
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        email: '',
        address: '',
        city: '',
        postalCode: ''
    });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            const response = await fetch('https://srikalmart-1.onrender.com/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cartItems.items,
                    totalAmount: cartItems.totalAmount,
                    shippingInfo: shippingInfo
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setAlert({
                    type: 'success',
                    message: '🎉 Order placed successfully!',
                    orderId: data.orderId,
                    estimatedDelivery: data.estimatedDelivery
                });
                // Auto-dismiss after 5 seconds
                setTimeout(() => {
                    setAlert(null);
                }, 5000);
                
                // Clear form
                setShippingInfo({
                    fullName: '',
                    email: '',
                    address: '',
                    city: '',
                    postalCode: ''
                });
            } else {
                setAlert({
                    type: 'error',
                    message: '❌ ' + (data.message || 'Something went wrong')
                });
                // Auto-dismiss after 4 seconds
                setTimeout(() => {
                    setAlert(null);
                }, 4000);
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: '❌ Failed to place order. Please try again.'
            });
            // Auto-dismiss after 4 seconds
            setTimeout(() => {
                setAlert(null);
            }, 4000);
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div className="checkout-container">
            <h1>Checkout</h1>

            {alert && (
                <div className={`alert-box ${alert.type}`}>
                    <p>{alert.message}</p>
                    {alert.orderId && <p><strong>Order ID:</strong> {alert.orderId}</p>}
                    {alert.estimatedDelivery && (
                        <p><strong>Estimated Delivery:</strong> {alert.estimatedDelivery}</p>
                    )}
                </div>
            )}

            <div className="checkout-content">
                <div className="checkout-summary">
                    <h2>Order Summary</h2>
                    <div className="checkout-items">
                        {cartItems.items.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            cartItems.items.map((item) => (
                                <div key={item._id} className="checkout-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <p>Price: ₹{item.price}</p>
                                        <p>Quantity: {item.itemQuantity}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="checkout-total">
                        <h3>
                          Total: ₹{cartItems.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                </div>
                <div className="checkout-form">
                    <h2>Shipping Information</h2>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            name="fullName"
                            placeholder="Full Name" 
                            value={shippingInfo.fullName}
                            onChange={handleInputChange}
                            required 
                        />
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email" 
                            value={shippingInfo.email}
                            onChange={handleInputChange}
                            required 
                        />
                        <input 
                            type="text" 
                            name="address"
                            placeholder="Address" 
                            value={shippingInfo.address}
                            onChange={handleInputChange}
                            required 
                        />
                        <input 
                            type="text" 
                            name="city"
                            placeholder="City" 
                            value={shippingInfo.city}
                            onChange={handleInputChange}
                            required 
                        />
                        <input 
                            type="text" 
                            name="postalCode"
                            placeholder="Postal Code" 
                            value={shippingInfo.postalCode}
                            onChange={handleInputChange}
                            required 
                        />
                        <button 
                            type="submit" 
                            className="place-order-btn"
                            disabled={loading || cartItems.items.length === 0}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
