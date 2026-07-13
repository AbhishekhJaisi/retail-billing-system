import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './Products.css';

const initialForm = {
    name: '',
    price: '',
    stock: '',
    lowStockAlert: ''
};

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [profile, setProfile] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);

    const summary = useMemo(() => {
        const totalStock = products.reduce((sum, item) => sum + Number(item.stock || 0), 0);
        const totalValue = products.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.stock || 0), 0);
        const lowStockCount = products.filter((item) => Number(item.stock || 0) <= Number(item.lowStockAlert || 0)).length;

        return { totalStock, totalValue, lowStockCount };
    }, [products]);

    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.get('/product', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const list = res?.data?.data || [];
            setProducts(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load products');
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await axiosInstance.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res?.data?.data || null);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!formData.name || !formData.price || !formData.stock || !formData.lowStockAlert) {
            setError('Please fill in every product field');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                name: formData.name,
                price: Number(formData.price),
                stock: Number(formData.stock),
                lowStockAlert: Number(formData.lowStockAlert)
            };

            const res = await axiosInstance.post('/product', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res?.data?.success) {
                throw new Error(res?.data?.message || 'Unable to create product');
            }

            setSuccess(`Product “${payload.name}” added successfully`);
            setFormData(initialForm);
            await fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Unable to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            if (token) {
                await axiosInstance.post('/auth/logout', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.clear();
            navigate('/login');
        }
    };

    return (
        <div className="products-page">
            <nav className="top-nav">
                <div className="brand-block">
                    <div className="brand-icon">R</div>
                    <div>
                        <h3>RetailFlow</h3>
                        <p>Smart billing dashboard</p>
                    </div>
                </div>

                <div className="nav-actions">
                    <button className="nav-btn" onClick={() => setProfileOpen(!profileOpen)}>
                        My Profile
                    </button>
                    <button className="nav-btn logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {profileOpen && profile && (
                <div className="profile-card">
                    <h4>{profile.name}</h4>
                    <p>{profile.email}</p>
                    <span>{profile.role}</span>
                </div>
            )}

            <div className="products-header">
                <div>
                    <h1>Inventory Control</h1>
                    <p>Track stock, spot low inventory, and add new items instantly.</p>
                </div>
                <div className="header-pill">Live dashboard</div>
            </div>

            <div className="stats-row">
                <div className="stat-card primary">
                    <span>Total Stock</span>
                    <strong>{summary.totalStock}</strong>
                </div>
                <div className="stat-card">
                    <span>Inventory Value</span>
                    <strong>${summary.totalValue.toFixed(2)}</strong>
                </div>
                <div className="stat-card warning">
                    <span>Low Stock</span>
                    <strong>{summary.lowStockCount}</strong>
                </div>
            </div>

            <div className="products-grid">
                <form className="product-form-card" onSubmit={handleSubmit}>
                    <h2>Add New Product</h2>

                    <label>
                        Name
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Wireless Mouse"
                            required
                        />
                    </label>

                    <label>
                        Price
                        <input
                            type="number"
                            name="price"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Stock
                        <input
                            type="number"
                            name="stock"
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Low Stock Alert
                        <input
                            type="number"
                            name="lowStockAlert"
                            min="0"
                            value={formData.lowStockAlert}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    {error && <p className="form-error">{error}</p>}
                    {success && <p className="form-success">{success}</p>}

                    <button type="submit" className="add-product-btn" disabled={loading}>
                        {loading ? 'Saving...' : '+ Add Product'}
                    </button>
                </form>

                <div className="product-list-card">
                    <div className="product-list-header">
                        <h2>Current Inventory</h2>
                        <span className="live-dot">● live</span>
                    </div>

                    {loading && products.length === 0 ? (
                        <p className="empty-state">Loading products...</p>
                    ) : products.length === 0 ? (
                        <p className="empty-state">No products yet. Add your first product to get started.</p>
                    ) : (
                        <div className="product-list">
                            {products.map((product) => {
                                const isLowStock = Number(product.stock || 0) <= Number(product.lowStockAlert || 0);

                                return (
                                    <div key={product.id} className={`product-item ${isLowStock ? 'low-stock' : ''}`}>
                                        <div>
                                            <h3>{product.name}</h3>
                                            <p>Price: ${Number(product.price).toFixed(2)}</p>
                                        </div>
                                        <div className="product-meta">
                                            <span>Stock: {product.stock}</span>
                                            <span>Alert: {product.lowStockAlert}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;