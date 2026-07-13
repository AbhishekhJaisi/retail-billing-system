const ProductSearch = ({ search, setSearch, filter, setFilter }) => {
  return (
    <div className="search-panel">
      <div className="search-box">
        {/* Simple magnifier icon via SVG */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search products"
        />
      </div>

      <select
        value={filter}
        onChange={e => setFilter(e.target.value)}
        aria-label="Filter by stock status"
      >
        <option value="all">All Products</option>
        <option value="in-stock">In Stock</option>
        <option value="low-stock">Low Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>
    </div>
  );
};

export default ProductSearch;
