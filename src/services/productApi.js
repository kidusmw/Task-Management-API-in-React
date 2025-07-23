// Product API service
class ProductApiService {
    constructor() {
      this.baseUrl = 'http://127.0.0.1:8000/api/products';
    }
  
    getAuthHeaders() {
      const token = localStorage.getItem('token');
      return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
    }
  
    async getAllProducts() {
      const res = await fetch(this.baseUrl, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    }
  
    async createProduct(productData) {
      const res = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData),
      });
    // if (!res.ok) throw new Error('Failed to create product');
       if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        console.error("Error response:", error);
        throw new Error(error.message || `Failed to create product: ${res.status}`);
      }
      return await res.json();
    }
  
    async getProductById(id) {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch product');
      return await res.json();
    }
  
    async updateProduct(id, productData) {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        console.error("Error response:", error);
        throw new Error(error.message || `Failed to update product: ${res.status}`);
      }
      return await res.json();
    }
  
    async patchProduct(id, productData) {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
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
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete product');
      return true;
    }
  }
  
  export const productApi = new ProductApiService();