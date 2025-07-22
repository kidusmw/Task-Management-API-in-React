import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { PRODUCT_STATUS } from '../../types/product';
import ProductItem from './ProductItem';
import ProductFilter from './ProductFilter';

const ProductList = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onStatusChange,
  onViewDetails,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProductCountByStatus = (status) => {
    return products.filter(product => product.status === status).length;
  };

  const getTotalValue = () => {
    return products.reduce((total, product) => {
      const price = product.discountPrice || product.price;
      return total + price;
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Total: {products.length}</span>
            <span>Available: {getProductCountByStatus(PRODUCT_STATUS.AVAILABLE)}</span>
            <span>Out of Stock: {getProductCountByStatus(PRODUCT_STATUS.OUT_OF_STOCK)}</span>
            <span>Discontinued: {getProductCountByStatus(PRODUCT_STATUS.DISCONTINUED)}</span>
            <span>Total Value: {formatPrice(getTotalValue())}</span>
          </div>
        </div>
        <button
          onClick={onAddProduct}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <ProductFilter
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by creating your first product'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={onAddProduct}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Create Product
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
              onStatusChange={onStatusChange}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;