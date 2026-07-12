import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.email || !formData.name || !formData.password) {
            setError("Please fill all the fields");
            setLoading(false);
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError("Password must have 8 characters, 1 capital letter, 1 number, 1 symbol");
            setLoading(false);
            return;
        }

        setError('');

        try {
            const res = await axiosInstance.post('/auth/register', formData);
            console.log(res.data);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: "Owner / shop name", type: "text", placeholder: "e.g. Abhishekh Traders", key: "name", autoComplete: "organization" },
        { label: "Email address", type: "email", placeholder: "you@example.com", key: "email", autoComplete: "email" },
        { label: "Password", type: "password", placeholder: "8+ chars, 1 capital, 1 number, 1 symbol", key: "password", autoComplete: "new-password" },
    ];

    return (
        <div className="auth-page">
            <div className="auth-card">
                <p className="auth-eyebrow">Get started</p>
                <h1 className="auth-heading">Create your account</h1>
                <p className="auth-subtext">Set up billing and inventory for your store in a few minutes.</p>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {fields.map(({ label, type, placeholder, key, autoComplete }) => (
                        <div className="field-group" key={key}>
                            <label htmlFor={key}>{label}</label>
                            <input
                                id={key}
                                type={type}
                                name={key}
                                placeholder={placeholder}
                                value={formData[key]}
                                onChange={handleChange}
                                autoComplete={autoComplete}
                            />
                        </div>
                    ))}

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;