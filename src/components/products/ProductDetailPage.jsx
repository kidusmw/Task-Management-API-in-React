import { ArrowLeft, Heart, Minus, Plus, Share2, ShoppingCart, Star, Truck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { PRODUCT_STATUS } from '../../types/product';

const ProductDetailPage = ({ product, onBack }) => {
  const { addToCart, getItemCount, formatPrice } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Initialize variations with first option of each variation type
  useEffect(() => {
    if (product.variations && Object.keys(product.variations).length > 0) {
      const initialVariations = {};
      Object.keys(product.variations).forEach(variationType => {
        if (product.variations[variationType].length > 0) {
          initialVariations[variationType] = product.variations[variationType][0];
        }
      });
      setSelectedVariations(initialVariations);
    }
  }, [product]);

  const handleVariationChange = (variationType, value) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationType]: value
    }));
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity, selectedVariations);
      // Show success message or feedback
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  const getCurrentPrice = () => {
    return product.discountPrice || product.price;
  };

  const getDiscountPercentage = () => {
    if (product.discountPrice && product.price > product.discountPrice) {
      return Math.round((1 - product.discountPrice / product.price) * 100);
    }
    return 0;
  };

  const currentItemCount = getItemCount(product.id, selectedVariations);
  const isOutOfStock = product.status === PRODUCT_STATUS.OUT_OF_STOCK;
  const isDiscontinued = product.status === PRODUCT_STATUS.DISCONTINUED;
  const isAvailable = product.status === PRODUCT_STATUS.AVAILABLE;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Products</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={`http://127.0.0.1:8000${product.images[selectedImage] || product.images[0]}`}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="Arial, sans-serif" font-size="16"%3ENo Image Available%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-gray-400 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg"></div>
                    <p>No image available</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-colors ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={`http://127.0.0.1:8000${image}`}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="Arial, sans-serif" font-size="8"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.5) 128 reviews</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(getCurrentPrice())}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
                      -{getDiscountPercentage()}%
                    </span>
                  </>
                )}
              </div>
              {isOutOfStock && (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
              {isDiscontinued && (
                <p className="text-gray-600 font-medium">Discontinued</p>
              )}
            </div>

            {/* Variations */}
            {product.variations && Object.keys(product.variations).length > 0 && (
              <div className="space-y-4">
                {Object.entries(product.variations).map(([variationType, options]) => (
                  <div key={variationType}>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 capitalize">
                      {variationType}: {selectedVariations[variationType]}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleVariationChange(variationType, option)}
                          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                            selectedVariations[variationType] === option
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity and Add to Cart */}
            {isAvailable && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-16 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (product.stock || 99)}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {currentItemCount > 0 && (
                    <span className="text-sm text-gray-600">
                      ({currentItemCount} in cart)
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      <ShoppingCart size={20} />
                    )}
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 border rounded-lg transition-colors ${
                      isFavorite
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  </button>
                  
                  <button className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Shipping Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={20} />
                <span>Free shipping on orders over $50</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Stock:</span>
                  <span className="ml-2 text-gray-900">{product.stock || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
