import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ProductHeader from '../components/ProductHeader';
import ProductStats from '../components/ProductStats';
import ProductSearch from '../components/ProductSearch';
import ProductTable from '../components/ProductTable';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './Products.css';

const EMPTY_FORM = { name: '', unit: '', stock: '', lowStockAlert: '5' };

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'success'|'error', message }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Auto-dismiss banner after 4 seconds
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 4000);
    return () => clearTimeout(t);
  }, [banner]);

  const loadProducts = async () => {
    try {
      const res = await axiosInstance.get('/product');
      const result = res?.data?.data ?? [];
      setProducts(Array.isArray(result) ? result : []);
    } catch (err) {
      setBanner({ type: 'error', message: err.response?.data?.message || 'Unable to load products' });
      setProducts([]);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    let cancelled = false;
    // setLoading(true);

    axiosInstance.get('/product')
      .then(res => {
        if (cancelled) return;
        const result = res?.data?.data ?? [];
        setProducts(Array.isArray(result) ? result : []);
      })
      .catch(err => {
        if (cancelled) return;
        setBanner({ type: 'error', message: err.response?.data?.message || 'Unable to load products' });
        setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [navigate]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    if (filter === 'in-stock') {
      list = list.filter(p => p.stock > 0 && p.stock > p.lowStockAlert);
    } else if (filter === 'low-stock') {
      list = list.filter(p => p.stock > 0 && p.stock <= p.lowStockAlert);
    } else if (filter === 'out-of-stock') {
      list = list.filter(p => p.stock === 0);
    }
    return list;
  }, [products, search, filter]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setBanner(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      selling_price: Number(product.selling_price),
      cost_price: Number(product.cost_price),
      stock: String(product.stock),
      unit: String(product.unit),
      lowStockAlert: String(product.lowStockAlert),
    });
    setBanner(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setBanner(null);

    const payload = {
      name: formData.name.trim(),
      selling_price: Number(formData.selling_price),
      cost_price: Number(formData.cost_price),
      stock: Number(formData.stock),
      unit: String(formData.unit),
      lowStockAlert: Number(formData.lowStockAlert),
    };

    if (!payload.name || Number.isNaN(payload.stock) || Number.isNaN(payload.lowStockAlert)) {
      setBanner({ type: 'error', message: 'Please fill in all fields with valid values.' });
      setSubmitting(false);
      return;
    }

    try {
      if (editingProduct) {
        await axiosInstance.put(`/product/${editingProduct.id}`, payload);
        setBanner({ type: 'success', message: 'Product updated.' });
      } else {
        await axiosInstance.post('/product', payload);
        setBanner({ type: 'success', message: 'Product added.' });
      }
      closeModal();
      await loadProducts();
    } catch (err) {
      setBanner({ type: 'error', message: err.response?.data?.message || 'Unable to save product.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await axiosInstance.delete(`/product/${productId}`);
      setBanner({ type: 'success', message: 'Product deleted.' });
      await loadProducts();
    } catch (err) {
      setBanner({ type: 'error', message: err.response?.data?.message || 'Unable to delete product.' });
    }
  };

  const field = (key, value) => setFormData(f => ({ ...f, [key]: value }));

  return (
    <div className="products-page">
      <ProductHeader onAddProduct={openAddModal} />

      {banner && (
        <div className={`banner ${banner.type}`} role="alert">
          {banner.message}
        </div>
      )}

      <ProductStats products={products} />

      <ProductSearch search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />

      {loading ? (
        <LoadingSkeleton />
      ) : filteredProducts.length === 0 ? (
        <EmptyState onAddProduct={openAddModal} />
      ) : (
        <ProductTable products={filteredProducts} onEdit={openEditModal} onDelete={handleDelete} />
      )}

      {isModalOpen && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-label={editingProduct ? 'Edit Product' : 'Add Product'}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Inventory</p>
                <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              </div>
              <button className="close-btn" onClick={closeModal} aria-label="Close">✕</button>
            </div>

            <form className="product-form" onSubmit={handleSubmit} noValidate>
              <label className="form-label">
                Product name
                <input
                  value={formData.name}
                  onChange={e => field('name', e.target.value)}
                  placeholder="e.g. Wireless Mouse"
                  required
                  autoFocus
                />
              </label>

              <div className="form-row">
                <label className="form-label">
                  Cost Price
                  <input
                    type="number"
                    value={formData.cost_price}
                    onChange={e => field('cost_price', e.target.value)}
                    placeholder="0"
                    required
                  />
                </label>
                <label className="form-label">
                  Selling Price
                  <input
                    type="number"
                    value={formData.selling_price}
                    onChange={e => field('selling_price', e.target.value)}
                    placeholder="0"
                    required
                  />
                </label>
              </div>

              <div className="form-row">
                <label className="form-label">
                  Unit
                  <input
                    value={formData.unit}
                    onChange={e => field('unit', e.target.value)}
                    placeholder="pcs, kg"
                    required
                    autoFocus
                  />
                </label>

                <label className="form-label">
                  Stock quantity
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={e => field('stock', e.target.value)}
                    placeholder="0"
                    required
                  />
                </label>
              </div>



              <label className="form-label">
                Low stock alert threshold
                <input
                  type="number"
                  min="0"
                  value={formData.lowStockAlert}
                  onChange={e => field('lowStockAlert', e.target.value)}
                  placeholder="5"
                  required
                />
              </label>

              {banner && isModalOpen && (
                <div className={`banner ${banner.type}`} role="alert">{banner.message}</div>
              )}

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Saving…' : editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
