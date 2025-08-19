import Account from '../Account';
import './MyAccount.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import { useState, useEffect } from 'react';

const MyAccount = () => {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            
            try {
                const response = await fetch(`/api/orders/user/${user._id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders || []);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders()
    }, [user]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    const getUserDisplayName = () => {
        if (!user) return 'Account holder name';
        
        // Try different possible name fields
        const name = user.name || 
                    `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
                    user.fullName || 
                    'Account holder name';
        return name;
    };

    return ( 
        <Account>
            <div className="order__history__container">
                <div className="order__history">
                    <div className="order__history__header">Order History</div>
                    
                    {loading ? (
                        <div className="order__history__detail">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="order__history__detail">You have not placed any orders yet</div>
                    ) : (
                        <div className="orders__list">
                            {orders.map((order) => (
                                <div key={order._id} className="order__item">
                                    <div className="order__header">
                                        <span>Order #{order.orderId}</span>
                                        <span className="order__date">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className="order__status">
                                        Status: <span className={`status-${order.status}`}>{order.status}</span>
                                    </div>
                                    <div className="order__total">
                                        Total: {formatPrice(order.totalAmount)}
                                    </div>
                                    <div className="order__items">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="order__item__detail">
                                                <span>{item.name}</span>
                                                <span>Qty: {item.quantity}</span>
                                                <span>{formatPrice(item.price)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="account__details__container">
                <div className="account__details__header">
                    <div className="details__header">Account Details</div>
                    <div className="logout__action" onClick={logout}>Logout</div>
                </div>
                <div className="account__details">
                    <div className="account__holder__name">{getUserDisplayName()}</div>
                    <div className="account__holder__email">{user?.email || 'Account holder email'}</div>
                    <div className="manage__account__action">
                        <Link to="/account/manage">Manage account</Link>   
                    </div>
                </div>
            </div>
        </Account>
     );
}
 
export default MyAccount;
