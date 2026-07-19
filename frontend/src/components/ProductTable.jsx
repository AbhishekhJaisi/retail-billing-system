import ProductRow from './ProductRow';

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="table-card">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Stock</th>
              <th>Unit</th>
              <th>Alert At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {/* npx sequelize-cli migration:generate --name add_column_to_users */}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
