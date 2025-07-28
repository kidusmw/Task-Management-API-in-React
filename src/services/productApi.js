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
    const res = await fetch(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  }

  // Accepts a FormData object directly
  async createProduct(formData) {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error("Error response:", error);
      throw new Error(error.message || `Failed to create product: ${res.status}`);
    }

    return await res.json();
  }

  async getProductById(id) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch product');
    return await res.json();
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
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return true;
  }
}

export const productApi = new ProductApiService();
