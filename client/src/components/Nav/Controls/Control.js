import './Control.css'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LogoutIcon from '@mui/icons-material/Logout';
import Badge from '@mui/material/Badge';
import { Link } from 'react-router-dom';
import Cart from '../../Card/Cart/Cart';
import { useContext, useState, useRef, useEffect } from 'react';
import { WishItemsContext } from '../../../Context/WishItemsContext';
import { useAuth } from '../../../Context/AuthContext';

const Control = () => {
    const wishItems = useContext(WishItemsContext);
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [userData, setUserData] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (user && user._id) {
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://srikalmart-1.onrender.com/api/auth/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleUserClick = (e) => {
        if (user) {
            e.preventDefault();
            setShowDropdown(!showDropdown);
        }
    };

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };

    const getUserDisplayName = () => {
        if (userData) {
            return userData.name || userData.email || 'User';
        }
        return user?.name || user?.email || 'User';
    };

    return ( 
        <div className="control__bar__container">
            <div className="controls__container">
                <div className="control" ref={dropdownRef}>
                    {user ? (
                        <>
                            <div className="user-icon-container" onClick={handleUserClick}>
                                <PersonOutlineIcon 
                                    color="black" 
                                    size="large" 
                                    sx={{ width: '35px', cursor: 'pointer' }}
                                />
                            </div>
                            {showDropdown && (
                                <div className="user-dropdown-menu">
                                    <div className="dropdown-item user-name">
                                        {getUserDisplayName()}
                                    </div>
                                    <Link to="/account/me" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                        My Account
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                                        <LogoutIcon sx={{ width: '20px', marginRight: '5px' }} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link to="/account/login">
                            <PersonOutlineIcon 
                                color="black" 
                                size="large" 
                                sx={{ width: '35px'}}
                            />
                        </Link>
                    )}
                </div>
                <div className="control">
                    <Link to="/wishlist">
                        <Badge badgeContent={wishItems.items.length} color="error">
                            <FavoriteBorderIcon color="black" sx={{ width: '35px' }}/>
                        </Badge>
                    </Link>
                </div>
                <div className="control">
                    <Cart />
                </div>
            </div>
        </div>
     );
}
 
export default Control;
