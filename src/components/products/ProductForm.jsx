import { Plus, Save, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { PRODUCT_STATUS, PRODUCT_STATUS_LABELS } from '../../types/product';

const ProductForm = ({ product, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    status: PRODUCT_STATUS.AVAILABLE,
    images: [],
    variations: {},
    sku: '',
    category: '',
    stock: '',
    weight: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description || '',
        price: product.price.toString(),
        discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
        status: product.status,
        images: product.images || [],
        variations: product.variations || {},
        sku: product.sku || '',
        category: product.category || '',
        stock: product.stock ? product.stock.toString() : '',
        weight: product.weight || '',
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      description,
      price,
      discountPrice,
      images,
      variations,
      sku,
      category,
      stock,
      weight,
      status,
    } = formData;

    // Use FormData for file + text
    const data = new FormData();
    data.append('title', title.trim());
    data.append('description', description.trim());
    data.append('price', parseFloat(price));
    if (discountPrice) data.append('discountPrice', parseFloat(discountPrice));
    data.append('sku', sku.trim());
    data.append('category', category.trim());
    data.append('stock', stock ? parseInt(stock) : '');
    data.append('weight', weight.trim());
    data.append('status', status);
    data.append('variations', JSON.stringify(variations)); // serialize variations

    // Add images
    images.forEach((img) => {
      if (img.file) {
        data.append('images[]', img.file);
      }
    });

    try {
      await onSubmit(data);
    } catch (err) {
      console.error('Submit error:', err);
    }
  };


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5;
    
    if (formData.images.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`);
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file: file,
            url: event.target.result,
            name: file.name
          };
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, newImage]
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const addVariationType = () => {
    const variationType = prompt('Enter variation type (e.g., Color, Size):');
    if (variationType && variationType.trim()) {
      setFormData(prev => ({
        ...prev,
        variations: {
          ...prev.variations,
          [variationType.trim()]: []
        }
      }));
    }
  };

  const removeVariationType = (variationType) => {
    setFormData(prev => {
      const newVariations = { ...prev.variations };
      delete newVariations[variationType];
      return {
        ...prev,
        variations: newVariations
      };
    });
  };

  const addVariationOption = (variationType) => {
    const option = prompt(`Enter option for ${variationType}:`);
    if (option && option.trim()) {
      setFormData(prev => ({
        ...prev,
        variations: {
          ...prev.variations,
          [variationType]: [...prev.variations[variationType], option.trim()]
        }
      }));
    }
  };

  const removeVariationOption = (variationType, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      variations: {
        ...prev.variations,
        [variationType]: prev.variations[variationType].filter((_, index) => index !== optionIndex)
      }
    }));
  };

  const statusOptions = [
    { value: PRODUCT_STATUS.AVAILABLE, label: PRODUCT_STATUS_LABELS[PRODUCT_STATUS.AVAILABLE], color: 'text-green-600' },
    { value: PRODUCT_STATUS.OUT_OF_STOCK, label: PRODUCT_STATUS_LABELS[PRODUCT_STATUS.OUT_OF_STOCK], color: 'text-red-600' },
    { value: PRODUCT_STATUS.DISCONTINUED, label: PRODUCT_STATUS_LABELS[PRODUCT_STATUS.DISCONTINUED], color: 'text-gray-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Create New Product'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                Product Images (Max 5)
              </label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {formData.images.length > 0 && (
                <div className="mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={`http://127.0.0.1:8000/storage/${image.url}`}
                          alt={image.name}
                          className="w-full h-20 object-cover rounded-md border border-gray-200"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80"%3E%3Crect width="200" height="80" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="Arial, sans-serif" font-size="11"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-md truncate">
                          {image.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price
                </label>
                <input
                  type="number"
                  id="discountPrice"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product SKU"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product category"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  id="stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Available quantity"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  type="text"
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 1.5 kg"
                />
              </div>
            </div>

            {/* Product Variations */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Variations
                </label>
                <button
                  type="button"
                  onClick={addVariationType}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus size={14} />
                  Add Type
                </button>
              </div>

              {Object.keys(formData.variations).length === 0 ? (
                <p className="text-sm text-gray-500 italic">No variations added. Click "Add Type" to create color, size, or other variations.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(formData.variations).map(([variationType, options]) => (
                    <div key={variationType} className="border border-gray-200 rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 capitalize">{variationType}</h4>
                        <button
                          type="button"
                          onClick={() => removeVariationType(variationType)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove Type
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {options.map((option, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {option}
                            <button
                              type="button"
                              onClick={() => removeVariationOption(variationType, index)}
                              className="text-red-500 hover:text-red-700 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addVariationOption(variationType)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add Option
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Availability *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.title.trim() || !formData.price}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    {product ? <Save size={16} /> : <Plus size={16} />}
                    {product ? 'Save Changes' : 'Create Product'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
