import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axiosInstance from '../api/axiosInstance';
import './Register.css';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            const res = await axiosInstance.post('/auth/login', formData);
            const data = res.data;

            if (!data?.success) {
                setError(data?.message || "Invalid credentials");
                setLoading(false);
                return;
            }

            const result = data?.data ?? data;
            const user = result?.admin ?? result?.user ?? null;
            const token = result?.token ?? null;

            if (!user || !token) {
                setError("Login response is incomplete. Please try again.");
                setLoading(false);
                return;
            }

            localStorage.setItem("name", user.name ?? "");
            localStorage.setItem("userId", String(user.id ?? ""));
            localStorage.setItem("role", user.role ?? "");
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);

            navigate("/products");

        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: "Email address", type: "email", placeholder: "you@example.com", key: "email", autoComplete: "email" },
        { label: "Password", type: "password", placeholder: "Enter your password", key: "password", autoComplete: "current-password" },
    ];

    return (
        <div className="auth-page">
            <div className="auth-card">
                <p className="auth-eyebrow">Welcome back</p>
                <h1 className="auth-heading">Sign in to your account</h1>
                <p className="auth-subtext">Access your billing, inventory, and sales reports.</p>

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
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;