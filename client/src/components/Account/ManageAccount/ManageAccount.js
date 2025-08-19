import Account from '../Account';
import './ManageAccount.css';
import { useState } from 'react';
import { useAuth } from '../../../Context/AuthContext';

const ManageAccount = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        name: user?.name || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Profile updated successfully!');
                // Update local storage
                const updatedUser = {
                    ...user,
                    ...data.user
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                setMessage(data.message || 'Failed to update profile');
            }
        } catch (error) {
            setMessage('An error occurred while updating profile');
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <Account> 
            <div className="manage__account__container">
                <div className="edit__account__container">
                    <div className="edit__account">
                        <div className="edit__account__header">Edit account</div>
                        <div className="edit__account__form__container">
                            <form className="edit__account__form" onSubmit={handleSubmit}>
                                <div className="fname__input__container edit__input__container">
                                    <label className="fname__label input__label">First name</label>
                                    <input 
                                        type="text" 
                                        name="firstName"
                                        className="fname__input edit__account__input"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="lname__input__container edit__input__container">
                                    <label className="lname__label input__label">Last name</label>
                                    <input 
                                        type="text" 
                                        name="lastName"
                                        className="lname__input edit__account__input"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="email__input__container edit__input__container">
                                    <label className="email__label input__label">Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        className="email__input edit__account__input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="save__changes__button__container">
                                    <button 
                                        type="submit"
                                        className="save__changes__button" 
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                                {message && (
                                    <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                                        {message}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
                <div className="separator__line"></div>
                <div className="delete_account__container">
                    <div className="delete__account">
                        <div className="delete__account__header">
                            Delete account
                        </div>
                        <div className="delete__account__prompt">Do you want to cancel subscription?</div>
                        <div className="delete__account__button__container">
                            <button className="delete__account__button" >Delete Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </Account>
     );
}
 
export default ManageAccount;
