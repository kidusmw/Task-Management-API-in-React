import React, { useState } from 'react';
import { Edit, Trash2, Eye, Package, PackageX, AlertCircle, ShoppingCart } from 'lucide-react';
import { PRODUCT_STATUS, PRODUCT_STATUS_LABELS } from '../../types/product';
import { useCart } from '../../contexts/CartContext';

const ProductItem = ({
  product,
  onEdit,
  onDelete,
  onStatusChange,
  onViewDetails,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, getItemCount } = useCart();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsDeleting(true);
      try {
        await onDelete(product.id);
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      {product.images && product.images.length > 0 && (
        <div className="mb-3">
          <img
            src={product.images[0].url}
            alt={product.title}
            className="w-full h-32 object-cover rounded-md"
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
            {formatPrice(product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-red-600 font-medium">
              {formatPrice(product.discountPrice)}
            </span>
          )}
        </div>
      </div>

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
