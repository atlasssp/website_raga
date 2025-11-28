const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  auth: {
    signup: async (name: string, email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }
      return response.json();
    },

    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      return response.json();
    },

    logout: async () => {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return response.json();
    }
  },

  products: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/products`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_URL}/products/${id}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },

    create: async (productData: any) => {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create product');
      }
      return response.json();
    },

    update: async (id: string, productData: any) => {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return response.json();
    }
  },

  categories: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/categories`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },

    create: async (categoryData: any) => {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData)
      });
      if (!response.ok) throw new Error('Failed to create category');
      return response.json();
    },

    update: async (id: string, categoryData: any) => {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData)
      });
      if (!response.ok) throw new Error('Failed to update category');
      return response.json();
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete category');
      return response.json();
    }
  },

  orders: {
    create: async (orderData: any) => {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Failed to create order');
      return response.json();
    },

    getAll: async () => {
      const response = await fetch(`${API_URL}/orders`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch order');
      return response.json();
    },

    updateStatus: async (id: string, status: string) => {
      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update order status');
      return response.json();
    }
  }
};
