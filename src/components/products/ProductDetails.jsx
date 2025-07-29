import { AlertCircle, Calendar, Package, PackageX, X } from 'lucide-react';
import React from 'react';
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
                        src={`http://127.0.0.1:8000${image.url}`}
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

            {/* Product Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Variants ({product.variants.length})
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {product.variants.map((variant, index) => (
                    <div
                      key={variant.id || index}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {variant.color} • {variant.size}
                            </h4>
                            {variant.quantity > 0 ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                In Stock
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                Out of Stock
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Price:</span>
                              <span className="ml-2 font-semibold text-lg text-gray-900">
                                {formatPrice(variant.price)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Quantity:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {variant.quantity} units
                              </span>
                            </div>
                          </div>

                          {/* Additional variant details if available */}
                          <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-gray-600">
                            {variant.sku && (
                              <div>
                                <span className="font-medium">SKU:</span>
                                <span className="ml-1">{variant.sku}</span>
                              </div>
                            )}
                            {variant.weight && (
                              <div>
                                <span className="font-medium">Weight:</span>
                                <span className="ml-1">{variant.weight}</span>
                              </div>
                            )}
                            {variant.dimensions && (
                              <div>
                                <span className="font-medium">Dimensions:</span>
                                <span className="ml-1">{variant.dimensions}</span>
                              </div>
                            )}
                            {variant.material && (
                              <div>
                                <span className="font-medium">Material:</span>
                                <span className="ml-1">{variant.material}</span>
                              </div>
                            )}
                          </div>

                          {/* Inventory details */}
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                              {variant.lowStockThreshold && variant.quantity <= variant.lowStockThreshold && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                                  Low Stock Warning
                                </span>
                              )}
                              {variant.created_at && (
                                <span className="text-gray-500">
                                  Added: {new Date(variant.created_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            {/* Price comparison with base product */}
                            {variant.price !== product.price && (
                              <div className="text-right">
                                {variant.price > product.price ? (
                                  <span className="text-red-600">
                                    +{formatPrice(variant.price - product.price)} from base
                                  </span>
                                ) : (
                                  <span className="text-green-600">
                                    -{formatPrice(product.price - variant.price)} from base
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Variant image if available */}
                          {variant.image_url && (
                            <div className="mt-3">
                              <img
                                src={`http://127.0.0.1:8000${variant.image_url}`}
                                alt={`${variant.color} ${variant.size} variant`}
                                className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Variant Summary Statistics */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">
                        {product.variants.reduce((sum, v) => sum + parseInt(v.quantity || 0), 0)}
                      </div>
                      <div className="text-gray-600">Total Units</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">
                        {formatPrice(Math.min(...product.variants.map(v => v.price)))} - {formatPrice(Math.max(...product.variants.map(v => v.price)))}
                      </div>
                      <div className="text-gray-600">Price Range</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">
                        {product.variants.filter(v => v.quantity > 0).length}/{product.variants.length}
                      </div>
                      <div className="text-gray-600">In Stock</div>
                    </div>
                  </div>
                </div>

                {/* JSON Debug Display */}
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-900 p-2 bg-gray-100 rounded">
                    🔍 View Raw Variant Data (Developer Mode)
                  </summary>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto mt-2 max-h-40 overflow-y-auto font-mono">
                    {JSON.stringify(product.variants, null, 2)}
                  </pre>
                </details>
              </div>
            )}

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
