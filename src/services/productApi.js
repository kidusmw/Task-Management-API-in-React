// Product API service
class ProductApiService {
  constructor() {
    this.baseUrl = 'http://127.0.0.1:8000/api/products';
  }

  getAuthHeaders() {
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      // Note: No 'Content-Type' header here because we'll send FormData
    };
  }

  async getAllProducts() {
    try {
      console.log('🔄 [ProductAPI] Fetching all products from:', this.baseUrl);
      const res = await fetch(this.baseUrl, {
        headers: this.getAuthHeaders(),
      });

      console.log('📡 [ProductAPI] Response status:', res.status, res.statusText);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('❌ [ProductAPI] Failed to fetch products:', {
          status: res.status,
          statusText: res.statusText,
          url: this.baseUrl,
          headers: this.getAuthHeaders(),
          errorData
        });
        throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log('✅ [ProductAPI] Successfully fetched', data.length || 0, 'products');
      return data;
    } catch (error) {
      console.error('🚫 [ProductAPI] Network/Parse error in getAllProducts:', error);
      throw error;
    }
  }

  // Accepts a FormData object directly
  async createProduct(formData) {
    try {
      console.log('🔄 [ProductAPI] Creating new product');
      console.log('📋 [ProductAPI] FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
      }

      const res = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData,
      });

      console.log('📡 [ProductAPI] Create response status:', res.status, res.statusText);

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        console.error('❌ [ProductAPI] Failed to create product:', {
          status: res.status,
          statusText: res.statusText,
          url: this.baseUrl,
          method: 'POST',
          errorData: error,
          headers: this.getAuthHeaders()
        });
        throw new Error(error.message || `Failed to create product: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log('✅ [ProductAPI] Product created successfully:', data.id || 'Unknown ID');
      return data;
    } catch (error) {
      console.error('🚫 [ProductAPI] Network/Parse error in createProduct:', error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      console.log(`🔄 [ProductAPI] Fetching product by ID: ${id}`);
      const url = `${this.baseUrl}/${id}`;
      const res = await fetch(url, {
        headers: this.getAuthHeaders(),
      });

      console.log('📡 [ProductAPI] GetById response status:', res.status, res.statusText);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('❌ [ProductAPI] Failed to fetch product by ID:', {
          id,
          status: res.status,
          statusText: res.statusText,
          url,
          errorData
        });
        throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log(`✅ [ProductAPI] Successfully fetched product:`, data.title || `ID ${id}`);
      return data;
    } catch (error) {
      console.error('🚫 [ProductAPI] Network/Parse error in getProductById:', error);
      throw error;
    }
  }

  // Accepts a FormData object directly, uses method spoofing to PUT
  async updateProduct(id, formData) {
    formData.append('_method', 'PUT'); // Laravel method spoofing

    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'POST', // Using POST with spoofed PUT
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error("Error response:", error);
      throw new Error(error.message || `Failed to update product: ${res.status}`);
    }

    return await res.json();
  }

  async patchProduct(id, productData) {
    // Patch expects JSON object (non-FormData)
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error("Error response:", error);
      throw new Error(error.message || `Failed to patch product: ${res.status}`);
    }

    return await res.json();
  }

  async deleteProduct(id) {
    try {
      console.log(`🔄 [ProductAPI] Deleting product with ID: ${id}`);
      const url = `${this.baseUrl}/${id}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      console.log('📡 [ProductAPI] Delete response status:', res.status, res.statusText);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('❌ [ProductAPI] Failed to delete product:', {
          id,
          status: res.status,
          statusText: res.statusText,
          url,
          method: 'DELETE',
          errorData
        });
        throw new Error(`Failed to delete product: ${res.status} ${res.statusText}`);
      }

      console.log(`✅ [ProductAPI] Product deleted successfully: ID ${id}`);
      return true;
    } catch (error) {
      console.error('🚫 [ProductAPI] Network/Parse error in deleteProduct:', error);
      throw error;
    }
  }
}

export const productApi = new ProductApiService();
