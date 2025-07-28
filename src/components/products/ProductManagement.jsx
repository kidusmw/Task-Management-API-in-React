import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import ProductDetails from './ProductDetails';

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
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error submitting form:', error);
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
      await deleteProduct(id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await patchProduct(id, { status });
    } catch (error) {
      console.error('Error updating product status:', error);
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
