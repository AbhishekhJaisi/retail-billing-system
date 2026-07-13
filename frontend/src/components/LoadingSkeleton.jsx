const LoadingSkeleton = () => {
  return (
    <div className="table-card">
      <div className="skeleton-rows">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-row" />
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
