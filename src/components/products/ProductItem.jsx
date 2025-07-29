import { AlertCircle, Edit, Eye, Package, PackageX, ShoppingCart, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { PRODUCT_STATUS, PRODUCT_STATUS_LABELS } from '../../types/product';

const ProductItem = ({
  product,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, getItemCount } = useCart();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsDeleting(true);
      try {
        console.log('🗑️ [ProductItem] Delete confirmation received for:', {
          productId: product.id,
          productTitle: product.title
        });
        await onDelete(product.id);
        console.log('✅ [ProductItem] Product deleted successfully:', product.id);
      } catch (error) {
        console.error('❌ [ProductItem] Delete operation failed:', {
          productId: product.id,
          productTitle: product.title,
          error: error.message,
          stack: error.stack
        });
      } finally {
        setIsDeleting(false);
      }
    } else {
      console.log('❌ [ProductItem] Delete cancelled by user for product:', product.id);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      console.log('🛍️ [ProductItem] Adding to cart:', {
        productId: product.id,
        productTitle: product.title,
        productPrice: product.discountPrice || product.price,
        quantity: 1
      });
      await addToCart(product.id, 1);
      console.log('✅ [ProductItem] Successfully added to cart:', product.id);
    } catch (error) {
      console.error('❌ [ProductItem] Failed to add to cart:', {
        productId: product.id,
        productTitle: product.title,
        error: error.message,
        stack: error.stack
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case PRODUCT_STATUS.AVAILABLE:
        return <Package size={16} className="text-green-500" />;
      case PRODUCT_STATUS.OUT_OF_STOCK:
        return <PackageX size={16} className="text-red-500" />;
      case PRODUCT_STATUS.DISCONTINUED:
        return <AlertCircle size={16} className="text-gray-500" />;
      default:
        return <Package size={16} className="text-gray-500" />;
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

  const currentItemCount = getItemCount(product.id);
  const isOutOfStock = product.status === PRODUCT_STATUS.OUT_OF_STOCK;
  const isDiscontinued = product.status === PRODUCT_STATUS.DISCONTINUED;
  const canAddToCart = product.status === PRODUCT_STATUS.AVAILABLE;

  const normalizeImagePath = (path) => {
    // Remove extra slashes and ensure exactly one /storage/
    return '/storage/' + path.split('/').filter(p => p && p !== 'storage').join('/');
  };

  const normalizedPath = normalizeImagePath(product.images[0]);
  const src = `http://127.0.0.1:8000${normalizedPath}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      {product.images && product.images.length > 0 && (
        <div className="mb-3 relative">
          <img
            src={src}
            alt={product.title}
            className="w-full h-32 object-cover rounded-md"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="128" viewBox="0 0 200 128"%3E%3Crect width="200" height="128" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="Arial, sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
          {product.images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
              +{product.images.length - 1}
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon(product.status)}
          <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewDetails(product)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(product)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit Product"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Delete Product"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>

      {product.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            {product.discountPrice ? formatPrice(product.discountPrice) : formatPrice(product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      {canAddToCart && (
        <div className="mb-3">
          <button
            onClick={handleAddToCart}
            // disabled={addingToCart}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingToCart ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <ShoppingCart size={16} />
            )}
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          {currentItemCount > 0 && (
            <p className="text-xs text-gray-600 text-center mt-1">
              {currentItemCount} in cart
            </p>
          )}
        </div>
      )}

      {(isOutOfStock || isDiscontinued) && (
        <div className="mb-3">
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
          >
            {isOutOfStock ? 'Out of Stock' : 'Discontinued'}
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(product.status)}`}
        >
          {PRODUCT_STATUS_LABELS[product.status.toLowerCase()]}
        </span>

        <div className="text-xs text-gray-500">
          {new Date(product.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
