"use client"

import {
  AlertCircle,
  ArrowLeft,
  Heart,
  Minus,
  Package,
  PackageX,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useCart } from "../../contexts/CartContext"
import { PRODUCT_STATUS } from "../../types/product"

// Clean e-commerce style variation selector
const VariationSelector = ({ variationType, options, selectedValue, onChange }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-medium text-gray-900 capitalize">
      {variationType}: <span className="text-gray-600">{selectedValue}</span>
    </h3>
    <div className="flex flex-wrap gap-2">
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => onChange(variationType, option)}
          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
            selectedValue === option
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-300 text-gray-700 hover:border-gray-400 bg-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
)

// Clean variant details display
const VariantDetails = ({ variants, selectedVariations }) => {
  const matchedVariant = variants.find((variant) =>
    Object.entries(selectedVariations).every(([key, value]) => variant.variation_values?.[key] === value),
  )

  if (!matchedVariant) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
        <p className="text-sm text-yellow-800">This combination is not available</p>
      </div>
    )
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-green-800 font-medium">Available</span>
        <div className="flex gap-4">
          <span className="text-green-800">Price: ${matchedVariant.price}</span>
          <span className="text-green-800">Stock: {matchedVariant.stock} units</span>
        </div>
      </div>
    </div>
  )
}

const ProductDetailPage = ({ product, onBack }) => {
  const { addToCart, getItemCount, formatPrice } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariations, setSelectedVariations] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Initialize variations with first option of each variation type
  useEffect(() => {
    if (product.variations && Object.keys(product.variations).length > 0) {
      const initialVariations = {}
      Object.keys(product.variations).forEach((variationType) => {
        if (product.variations[variationType].length > 0) {
          initialVariations[variationType] = product.variations[variationType][0]
        }
      })
      setSelectedVariations(initialVariations)
    }
  }, [product])

  const handleVariationChange = (variationType, value) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [variationType]: value,
    }))
  }

  const handleAddToCart = async () => {
    setAddingToCart(true)
    try {
      await addToCart(product.id, quantity, selectedVariations)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock || 99)) {
      setQuantity(newQuantity)
    }
  }

  const getCurrentPrice = () => {
    if (product.variants && product.variants.length > 0) {
      const matchedVariant = product.variants.find((variant) =>
        Object.entries(selectedVariations).every(([key, value]) => variant.variation_values?.[key] === value),
      )
      if (matchedVariant) return matchedVariant.price
    }
    return product.discountPrice || product.price
  }

  const getDiscountPercentage = () => {
    if (product.discountPrice && product.price > product.discountPrice) {
      return Math.round((1 - product.discountPrice / product.price) * 100)
    }
    return 0
  }

  const normalizeImagePath = (path) => {
    return (
      "/storage/" +
      path
        .split("/")
        .filter((p) => p && p !== "storage")
        .join("/")
    )
  }

  const normalizedPath = normalizeImagePath(product.images[0])
  const src = `http://127.0.0.1:8000${normalizedPath}`
  const selectedSrc = `http://127.0.0.1:8000${normalizeImagePath(product.images[selectedImage])}`

  const currentItemCount = getItemCount(product.id, selectedVariations)
  const isOutOfStock = product.status === PRODUCT_STATUS.OUT_OF_STOCK
  const isDiscontinued = product.status === PRODUCT_STATUS.DISCONTINUED
  const isAvailable = product.status === PRODUCT_STATUS.AVAILABLE

  console.log("Product Detail Page Loaded:", product)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean header */}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={selectedSrc || src}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="%236b7280" fontFamily="Arial, sans-serif" fontSize="16"%3ENo Image Available%3C/text%3E%3C/svg%3E'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-gray-400 text-center">
                    <Package size={48} className="mx-auto mb-4" />
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
                    className={`flex-shrink-0 w-16 h-16 rounded-md border-2 overflow-hidden ${
                      selectedImage === index ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={`http://127.0.0.1:8000${image}`}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="%236b7280" fontFamily="Arial, sans-serif" fontSize="8"%3ENo Image%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.5) 128 reviews</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(getCurrentPrice())}</span>
                {product.discountPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">{formatPrice(product.price)}</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                      -{getDiscountPercentage()}% OFF
                    </span>
                  </>
                )}
              </div>
              {isOutOfStock && (
                <div className="flex items-center gap-2 text-red-600 mt-2">
                  <PackageX size={16} />
                  <span className="text-sm font-medium">Out of Stock</span>
                </div>
              )}
              {isDiscontinued && (
                <div className="flex items-center gap-2 text-gray-600 mt-2">
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">Discontinued</span>
                </div>
              )}
            </div>

            {/* Variations */}
            {product.variations && Object.keys(product.variations).length > 0 && (
              <div className="space-y-4">
                {Object.entries(product.variations).map(([variationType, options]) => (
                  <VariationSelector
                    key={variationType}
                    variationType={variationType}
                    options={options}
                    selectedValue={selectedVariations[variationType]}
                    onChange={handleVariationChange}
                  />
                ))}
              </div>
            )}

            {/* Direct Variant Selection (Buttons for each variant) */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Select Variant:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, idx) => {
                    const label = Object.values(variant.variation_values || {}).join(" / ")
                    const isSelected = Object.entries(selectedVariations).every(
                      ([key, value]) => variant.variation_values?.[key] === value
                    )
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariations(variant.variation_values)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 text-gray-700 hover:border-gray-400 bg-white"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Variant Details */}
            {product.variants && <VariantDetails variants={product.variants} selectedVariations={selectedVariations} />}

            {/* Quantity and Add to Cart */}
            {isAvailable && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-16 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (product.stock || 99)}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {currentItemCount > 0 && <span className="text-sm text-blue-600">{currentItemCount} in cart</span>}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {addingToCart ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <ShoppingCart size={18} />
                    )}
                    {addingToCart ? "Adding..." : "Add to Cart"}
                  </button>

                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 border rounded-md transition-colors ${
                      isFavorite
                        ? "border-red-500 text-red-500 bg-red-50"
                        : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <Heart size={18} className={isFavorite ? "fill-current" : ""} />
                  </button>

                  <button className="p-3 border border-gray-300 rounded-md text-gray-600 hover:border-gray-400 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            )}

            {(isOutOfStock || isDiscontinued) && (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-md cursor-not-allowed font-medium"
              >
                {isOutOfStock ? "Out of Stock" : "Discontinued"}
              </button>
            )}

            {/* Shipping and Features */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center gap-3 text-green-600">
                <Truck size={20} />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-blue-600">
                <RotateCcw size={20} />
                <div>
                  <p className="font-medium">30-Day Returns</p>
                  <p className="text-sm text-gray-600">Easy returns and exchanges</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-purple-600">
                <Shield size={20} />
                <div>
                  <p className="font-medium">2-Year Warranty</p>
                  <p className="text-sm text-gray-600">Full manufacturer warranty</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className="text-gray-900">{product.stock || "N/A"} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Product ID:</span>
                  <span className="text-gray-900">#{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900">General</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
