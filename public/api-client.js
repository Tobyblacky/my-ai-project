// Frontend API Client for Adesewa Store

class AdesewaAPI {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('adesewa_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('adesewa_token', token);
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async register(username, email, password) {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'register', username, email, password })
    });
  }

  async login(email, password) {
    return this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', email, password })
    });
  }

  async logout() {
    localStorage.removeItem('adesewa_token');
    this.token = null;
  }

  // Product endpoints
  async getProducts(category = null) {
    let url = '/products';
    if (category) {
      url += `?category=${category}`;
    }
    return this.request(url);
  }

  async getProduct(id) {
    return this.request(`/products?id=${id}`);
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, name, price, image, quantity = 1) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({
        action: 'add',
        productId,
        name,
        price,
        image,
        quantity
      })
    });
  }

  async removeFromCart(name) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ action: 'remove', name })
    });
  }

  async updateCartItem(name, quantity) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ action: 'update', name, quantity })
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ action: 'clear' })
    });
  }

  // Order endpoints
  async getOrders() {
    return this.request('/orders');
  }

  async checkout() {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ action: 'checkout' })
    });
  }
}

// Global instance
window.api = new AdesewaAPI();
