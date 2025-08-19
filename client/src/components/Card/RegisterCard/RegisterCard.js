import { Link } from 'react-router-dom';
import { useState } from 'react';
import './RegisterCard.css';

const RegisterCard = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate fields before sending
        if (!formData.name || !formData.email || !formData.password) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://srikalmart-1.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)  // sends { name, email, password }
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Account created successfully!');
                setTimeout(() => {
                    window.location.href = '/account/login';
                }, 1500);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div className="register__card__container">
            <div className="register__card">
                <div className="register__header">
                    <h1>Create Account</h1>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <form onSubmit={handleSubmit} className="register__inputs">
                    <div className="name__input__container reg__input__container">
                        <label className="name__label input__label">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            className="name__input register__input" 
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="email__input__container reg__input__container">
                        <label className="email__label input__label">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className="email__input register__input" 
                            placeholder='example@gmail.com'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="password__input__container reg__input__container">
                        <label className="password__label input__label">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            className="password__input register__input" 
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="register__button__container">
                        <button 
                            type="submit"
                            className="register__button" 
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
                        </button>
                    </div>
                </form>
                <div className="register__other__actions">
                    <div className="register__login__account">
                        Already have an account? <Link to="/account/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default RegisterCard;
