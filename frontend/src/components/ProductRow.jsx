const getStatus = (product) => {
  if (product.stock === 0)
    return { label: 'Out of Stock', className: 'status-red' };
  if (product.stock <= product.lowStockAlert)
    return { label: 'Low Stock', className: 'status-orange' };
  return { label: 'In Stock', className: 'status-green' };
};

const ProductRow = ({ product, onEdit, onDelete }) => {
  const status = getStatus(product);
  // Use first letter of name as icon character
  const iconChar = product.name?.charAt(0).toUpperCase() || 'P';

  return (
    <tr>
      <td>
        <div className="product-name-cell">
          <div className="product-icon">{iconChar}</div>
          <div>
            <strong>{product.name}</strong>
            <span>SKU-{String(product.id).padStart(4, '0')}</span>
          </div>
        </div>
      </td>
      <td>₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>{product.stock}</td>
      <td>{product.lowStockAlert}</td>
      <td>
        <span className={`status-badge ${status.className}`}>{status.label}</span>
      </td>
      <td>
        <div className="actions-cell">
          <button
            className="icon-btn"
            aria-label="Edit product"
            title="Edit"
            onClick={() => onEdit(product)}
          >
            ✎
          </button>
          <button
            className="icon-btn danger"
            aria-label="Delete product"
            title="Delete"
            onClick={() => onDelete(product.id)}
          >
            🗑
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
