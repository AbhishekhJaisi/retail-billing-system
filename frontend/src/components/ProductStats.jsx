const ProductStats = ({ products }) => {
  const total = products.length;
  const inStock = products.filter(p => p.stock > 0 && p.stock > p.lowStockAlert).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.lowStockAlert).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  const cards = [
    { label: 'Total Products', value: total,      sub: 'Inventory items',  tone: 'purple' },
    { label: 'In Stock',       value: inStock,    sub: 'Ready to sell',    tone: 'green' },
    { label: 'Low Stock',      value: lowStock,   sub: 'Need restocking',  tone: 'orange' },
    { label: 'Out of Stock',   value: outOfStock, sub: 'Unavailable',      tone: 'red' },
  ];

  return (
    <div className="stats-grid">
      {cards.map(card => (
        <div key={card.label} className={`stat-card ${card.tone}`}>
          <span className="stat-label">{card.label}</span>
          <strong>{card.value}</strong>
          <span>{card.sub}</span>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;
