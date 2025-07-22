import React from 'react';
import { PRODUCT_STATUS, PRODUCT_STATUS_LABELS } from '../../types/product';

const ProductFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'All Products', color: 'bg-gray-100 text-gray-700' },
    { key: PRODUCT_STATUS.AVAILABLE, label: PRODUCT_STATUS_LABELS[PRODUCT_STATUS.AVAILABLE], color: 'bg-green-100 text-green-700' },
    { key: PRODUCT_STATUS.OUT_OF_STOCK, label: PRODUCT_STATUS_LABELS[PRODUCT_STATUS.OUT_OF_STOCK], color: 'bg-red-100 text-red-700' },
    { key: PRODUCT_STATUS.DISCONTINUED, label: PRODUCT_STATUS_LABELS[PRODUCT_STATUS.DISCONTINUED], color: 'bg-gray-100 text-gray-700' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            currentFilter === filter.key
              ? filter.color + ' shadow-md transform scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default ProductFilter;