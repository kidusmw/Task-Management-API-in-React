import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductDetails from './ProductDetails';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const ProductManagement = ({ onViewDetails: externalOnViewDetails }) => {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct,
  } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    setSelectedProduct(null);
  };

  const handleFormSubmit = async (productData) => {
    setFormLoading(true);
    try {
      console.log('🔄 [ProductManagement] Form submission started:', {
        action: editingProduct ? 'update' : 'create',
        productId: editingProduct?.id,
        productTitle: editingProduct?.title || 'New Product'
      });

      if (editingProduct) {
        const result = await updateProduct(editingProduct.id, productData);
        console.log('✅ [ProductManagement] Product updated successfully:', result?.id);
      } else {
        const result = await createProduct(productData);
        console.log('✅ [ProductManagement] Product created successfully:', result?.id);
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('❌ [ProductManagement] Form submission failed:', {
        action: editingProduct ? 'update' : 'create',
        productId: editingProduct?.id,
        error: error.message,
        stack: error.stack
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    try {
      console.log('🗑️ [ProductManagement] Delete operation started for product ID:', id);
      await deleteProduct(id);
      console.log('✅ [ProductManagement] Product deleted successfully:', id);
    } catch (error) {
      console.error('❌ [ProductManagement] Delete operation failed:', {
        productId: id,
        error: error.message,
        stack: error.stack
      });
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      console.log('🔄 [ProductManagement] Status change started:', { productId: id, newStatus: status });
      await patchProduct(id, { status });
      console.log('✅ [ProductManagement] Status updated successfully:', { productId: id, status });
    } catch (error) {
      console.error('❌ [ProductManagement] Status update failed:', {
        productId: id,
        newStatus: status,
        error: error.message,
        stack: error.stack
      });
    }
  };

  const handleViewDetails = (product) => {
    if (externalOnViewDetails) {
      externalOnViewDetails(product);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <ProductList
        products={products}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onStatusChange={handleStatusChange}
        onViewDetails={handleViewDetails}
        loading={loading}
      />

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={formLoading}
        />
      )}

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={handleCloseDetails}
          onEdit={handleEditProduct}
        />
      )}
    </div>
  );
};

export default ProductManagement;
