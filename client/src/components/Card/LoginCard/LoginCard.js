import { Link } from 'react-router-dom';
import { useState } from 'react';
import './LoginCard.css';

const LoginCard = () => {
    const [formData, setFormData] = useState({
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

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Login successful!');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div className="login__card__container">
            <div className="login__card">
                <div className="login__header">
                    <h1>Login</h1>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <form onSubmit={handleSubmit} className="login__inputs">
                    <div className="email__input__container input__container">
                        <label className="email__label input__label">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className="email__input login__input" 
                            placeholder='example@gmail.com'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="password__input__container input__container">
                        <label className="password__label input__label">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            className="password__input login__input" 
                            placeholder='**********'
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="login__button__container">
                        <button 
                            type="submit"
                            className="login__button" 
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'LOGIN'}
                        </button>
                    </div>
                </form>
                <div className="login__other__actions">
                    <div className="login__forgot__password">Forgot password?</div>
                    <div className="login__new__account">
                        Don't have account? <Link to="/account/register">Create account</Link>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default LoginCard;
