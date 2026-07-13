const EmptyState = ({ onAddProduct }) => {
  return (
    <div className="empty-state-card">
      <div className="empty-icon">📦</div>
      <h3>No products yet</h3>
      <p>Add your first product to start tracking inventory.</p>
      <button className="primary-btn" onClick={onAddProduct}>
        + Add First Product
      </button>
    </div>
  );
};

export default EmptyState;
