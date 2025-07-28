import React from 'react';
import { X, Calendar, Package, PackageX, AlertCircle } from 'lucide-react';
import { PRODUCT_STATUS, PRODUCT_STATUS_LABELS } from '../../types/product';

const ProductDetails = ({ product, onClose, onEdit }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case PRODUCT_STATUS.AVAILABLE:
        return <Package size={20} className="text-green-500" />;
      case PRODUCT_STATUS.OUT_OF_STOCK:
        return <PackageX size={20} className="text-red-500" />;
      case PRODUCT_STATUS.DISCONTINUED:
        return <AlertCircle size={20} className="text-gray-500" />;
      default:
        return <Package size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case PRODUCT_STATUS.AVAILABLE:
        return 'bg-green-100 text-green-700';
      case PRODUCT_STATUS.OUT_OF_STOCK:
        return 'bg-red-100 text-red-700';
      case PRODUCT_STATUS.DISCONTINUED:
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {product.images && product.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.images.map((image, index) => (
                    <div key={image.id || index} className="relative">
                      <img
                        src={`http://127.0.0.1:8000/storage/${image.url}`}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border border-gray-200"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="96" viewBox="0 0 200 96"%3E%3Crect width="200" height="96" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="Arial, sans-serif" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {getStatusIcon(product.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                {PRODUCT_STATUS_LABELS[product.status]}
              </span>
            </div>

            {product.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                  {product.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="text-lg font-semibold text-gray-900">
                  {formatPrice(product.price)}
                </div>
              </div>

              {product.discountPrice && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Price
                  </label>
                  <div className="text-lg font-semibold text-red-600">
                    {formatPrice(product.discountPrice)}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created
                </label>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => onEdit(product)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
