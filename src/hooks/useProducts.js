import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../services/productApi';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await productApi.getAllProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    try {
      setError(null);
      const newProduct = await productApi.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError('Failed to create product');
      console.error('Error creating product:', err);
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      setError(null);
      const updatedProduct = await productApi.updateProduct(id, productData);
      if (updatedProduct) {
        setProducts(prev => prev.map(product => 
          product.id === id ? updatedProduct : product
        ));
        return updatedProduct;
      }
      throw new Error('Product not found');
    } catch (err) {
      setError('Failed to update product');
      console.error('Error updating product:', err);
      throw err;
    }
  }, []);

  const patchProduct = useCallback(async (id, productData) => {
    try {
      setError(null);
      const updatedProduct = await productApi.patchProduct(id, productData);
      if (updatedProduct) {
        setProducts(prev => prev.map(product => 
          product.id === id ? updatedProduct : product
        ));
        return updatedProduct;
      }
      throw new Error('Product not found');
    } catch (err) {
      setError('Failed to update product');
      console.error('Error patching product:', err);
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      setError(null);
      const success = await productApi.deleteProduct(id);
      if (success) {
        setProducts(prev => prev.filter(product => product.id !== id));
        return true;
      }
      throw new Error('Product not found');
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
      throw err;
    }
  }, []);

  const getProductById = useCallback(async (id) => {
    try {
      setError(null);
      return await productApi.getProductById(id);
    } catch (err) {
      setError('Failed to fetch product');
      console.error('Error fetching product:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct,
    getProductById,
  };
};