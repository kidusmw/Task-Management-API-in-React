import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../services/productApi';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      console.log('🔄 [useProducts] Starting to fetch products...');
      setLoading(true);
      setError(null);
      const fetchedProducts = await productApi.getAllProducts();
      console.log('✅ [useProducts] Fetched products successfully:', {
        count: fetchedProducts.length,
        products: fetchedProducts.map(p => ({ id: p.id, title: p.title, status: p.status }))
      });
      setProducts(fetchedProducts);
    } catch (err) {
      const errorMessage = 'Failed to fetch products';
      setError(errorMessage);
      console.error('❌ [useProducts] Failed to fetch products:', {
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    try {
      console.log('🔄 [useProducts] Creating new product...');
      setError(null);
      const newProduct = await productApi.createProduct(productData);
      console.log('✅ [useProducts] Product created, updating local state:', {
        productId: newProduct.id,
        title: newProduct.title
      });
      setProducts(prev => {
        const updated = [...prev, newProduct];
        console.log('📋 [useProducts] Products state updated, new count:', updated.length);
        return updated;
      });
      return newProduct;
    } catch (err) {
      const errorMessage = 'Failed to create product';
      setError(errorMessage);
      console.error('❌ [useProducts] Product creation failed:', {
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      console.log('🔄 [useProducts] Updating product:', { id });
      setError(null);
      const updatedProduct = await productApi.updateProduct(id, productData);
      if (updatedProduct) {
        console.log('✅ [useProducts] Product updated, refreshing local state:', {
          productId: updatedProduct.id,
          title: updatedProduct.title
        });
        setProducts(prev => {
          const updated = prev.map(product =>
            product.id === id ? updatedProduct : product
          );
          console.log('📋 [useProducts] Local products state updated');
          return updated;
        });
        return updatedProduct;
      }
      throw new Error('Product not found in response');
    } catch (err) {
      const errorMessage = 'Failed to update product';
      setError(errorMessage);
      console.error('❌ [useProducts] Product update failed:', {
        productId: id,
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
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
