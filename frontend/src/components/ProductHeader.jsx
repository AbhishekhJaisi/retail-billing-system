const ProductHeader = ({ onAddProduct }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button className="primary-btn" onClick={onAddProduct}>
        + Add Product
      </button>
    </div>
  );
};

export default ProductHeader;
