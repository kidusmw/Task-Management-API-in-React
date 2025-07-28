// Cart API service
class CartApiService {
  constructor() {
    this.baseUrl = 'http://127.0.0.1:8000/api/cart';
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getCart() {
    const res = await fetch(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return await res.json();
  }

  async addToCart(productId, quantity = 1, selectedVariations = {}) {
    const res = await fetch(`${this.baseUrl}/add`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        product_id: productId,
        quantity,
        variations: selectedVariations
      }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to add product to cart');
    }
    return await res.json();
  }

  async updateCartItem(cartItemId, quantity) {
    const res = await fetch(`${this.baseUrl}/update/${cartItemId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to update cart item');
    }
    return await res.json();
  }

  async removeFromCart(cartItemId) {
    const res = await fetch(`${this.baseUrl}/remove/${cartItemId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to remove item from cart');
    return true;
  }

  async clearCart() {
    const res = await fetch(`${this.baseUrl}/clear`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to clear cart');
    return true;
  }

  async getCartSummary() {
    const res = await fetch(`${this.baseUrl}/summary`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch cart summary');
    return await res.json();
  }
}

export const cartApi = new CartApiService();
