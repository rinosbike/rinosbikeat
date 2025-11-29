/**
 * API Client for RINOS Bikes Backend
 * Handles all HTTP requests to the FastAPI backend
 * 
 * Flow:
 * Frontend calls /api/* → Next.js proxy at /app/api/[...proxy]/route.ts 
 * → Forwards to backend at https://backend/api/*
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = '/api'; // Local proxy route

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// TYPES
// ============================================================================

export interface Product {
  productid: number;
  articlenr: string;
  articlename: string;
  shortdescription?: string | null;
  price: number;
  manufacturer?: string | null;
  productgroup?: string | null;
  primary_image?: string | null;
  images?: string[];
  is_father_article: boolean;
  colour?: string | null;
  size?: string | null;
  component?: string | null;
  type?: string | null;
  father_article?: string | null;
  gtin?: string | null;
  variations?: Product[];  
}

export interface ProductVariation {
  variation_id: number;
  variation_name: string;
  price_adjustment: number;
  stock_quantity?: number;
}

export interface CartItem {
  product_id: number;
  articlenr: string;
  articlename: string;
  quantity: number;
  price: number;
  variation_id?: number;
  variation_name?: string;
}

export interface Cart {
  session_id: string;
  items: CartItem[];
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  currency: string;
}

export interface Order {
  web_order_id: number;
  order_number: string;
  customer_email: string;
  customer_name: string;
  order_date: string;
  order_status: string;
  payment_status: string;
  total_amount: number;
  currency: string;
}

export interface User {
  user_id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email_verified: boolean;
  is_active: boolean;
}

export interface ProductResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  products: Product[];
}

// ============================================================================
// PRODUCTS API
// ============================================================================

export const productsApi = {
  // Get all products with pagination
  getAll: async (page: number = 1, pageSize: number = 20): Promise<ProductResponse> => {
    const response = await apiClient.get('/', {
      params: {
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  },

  // Get single product by ID or article number
  getById: async (productId: number | string): Promise<Product> => {
    const response = await apiClient.get(`/${productId}`);
    return response.data.product || response.data;
  },

  // Get product by article number
  getByArticleNr: async (articlenr: string): Promise<Product> => {
    const response = await apiClient.get(`/${articlenr}`);
    return response.data.product || response.data;
  },

  // Search products
  search: async (query: string, page: number = 1): Promise<ProductResponse> => {
    const response = await apiClient.get('/search/query', {
      params: {
        search: query,
        page,
      },
    });
    return response.data;
  },
};

// ============================================================================
// CATEGORIES API
// ============================================================================

export interface Category {
  categoryid: number;
  category: string;
  categorypath?: string | null;
  categoryimageurl?: string | null;
  product_count?: number;
}

export interface CategoryProductsResponse {
  status: string;
  category: Category;
  count: number;
  total: number;
  page: number;
  pages: number;
  products: Product[];
}

export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<{ status: string; count: number; categories: Category[] }> => {
    const response = await apiClient.get('/meta/categories');
    return response.data;
  },

  // Get products in a specific category
  getProducts: async (categoryId: number, skip: number = 0, limit: number = 24): Promise<CategoryProductsResponse> => {
    const response = await apiClient.get(`/meta/categories/${categoryId}`, {
      params: { skip, limit },
    });
    return response.data;
  },
};

// ============================================================================
// PRODUCT VARIATIONS API
// ============================================================================

export interface ProductVariationDetail extends Product {
  images: string[];
  father_article?: string | null;
}

export interface ProductVariationsResponse {
  status: string;
  father_article: string;
  variation_count: number;
  variations: ProductVariationDetail[];
  variation_combinations: Array<{
    articlenr: string;
    variations: Array<{ type: string | null; value: string | null }>;
  }>;
  grouped_by_attribute: Record<string, Record<string, ProductVariationDetail[]>>;
}

export const variationsApi = {
  // Get variations for a product
  getVariations: async (articlenr: string): Promise<ProductVariationsResponse> => {
    const response = await apiClient.get(`/${articlenr}/variations`);
    return response.data;
  },
};

// ============================================================================
// CART API
// ============================================================================

export const cartApi = {
  // Get cart
  getCart: async (sessionId: string): Promise<Cart> => {
    const response = await apiClient.get(`/cart/`, {
      params: { session_id: sessionId },
    });
    return response.data;
  },

  // Add item to cart
  addItem: async (
    sessionId: string,
    productId: number,
    quantity: number = 1,
    variationId?: number
  ): Promise<Cart> => {
    const response = await apiClient.post(
      `/cart/add`,
      {
        product_id: productId,
        quantity,
        variation_id: variationId,
      },
      {
        params: { session_id: sessionId },
      }
    );
    return response.data;
  },

  // Update item quantity
  updateItem: async (
    sessionId: string,
    productId: number,
    quantity: number,
    variationId?: number
  ): Promise<Cart> => {
    const response = await apiClient.put(
      `/cart/items/${productId}`,
      {
        quantity,
        variation_id: variationId,
      },
      {
        params: { session_id: sessionId },
      }
    );
    return response.data;
  },

  // Remove item from cart
  removeItem: async (
    sessionId: string,
    productId: number,
    variationId?: number
  ): Promise<Cart> => {
    const response = await apiClient.delete(
      `/cart/items/${productId}`,
      {
        params: { session_id: sessionId },
        data: { variation_id: variationId },
      }
    );
    return response.data;
  },

  // Clear cart
  clearCart: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/cart/`, {
      params: { session_id: sessionId },
    });
  },
};

// ============================================================================
// ORDERS API
// ============================================================================

export const ordersApi = {
  // Create order
  createOrder: async (
    sessionId: string,
    customerInfo: {
      customer_frontname: string;
      customer_surname: string;
      customer_email: string;
      customer_adress: string;
      customer_postalcode: string;
      customer_city: string;
      customer_country: string;
      customer_telephone?: string;
    },
    paymentMethod: string = 'stripe'
  ): Promise<Order> => {
    const response = await apiClient.post(
      `/orders/`,
      {
        customer_info: customerInfo,
        payment_method: paymentMethod,
      },
      {
        params: { session_id: sessionId },
      }
    );
    return response.data;
  },

  // Get order by ID
  getById: async (orderId: number): Promise<Order> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get user orders
  getUserOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders/');
    return response.data;
  },
};

// ============================================================================
// PAYMENTS API
// ============================================================================

export const paymentsApi = {
  // Create payment intent
  createPaymentIntent: async (
    orderId: number,
    returnUrl: string
  ): Promise<{
    payment_intent_id: string;
    client_secret: string;
    amount: number;
    currency: string;
  }> => {
    const response = await apiClient.post('/payments/create-payment-intent', {
      order_id: orderId,
      return_url: returnUrl,
    });
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentIntentId: string) => {
    const response = await apiClient.get(`/payments/status/${paymentIntentId}`);
    return response.data;
  },
};

// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {
  // Register
  register: async (userData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }): Promise<{ access_token: string; user: User }> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (email: string, password: string): Promise<{ access_token: string; user: User }> => {
    const response = await apiClient.post('/auth/login/json', {
      email,
      password,
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/auth/password-reset', { email });
  },

  // Confirm password reset
  confirmPasswordReset: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/password-reset/confirm', {
      token,
      new_password: newPassword,
    });
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/auth/verify-email', { token });
  },

  // Resend verification email
  resendVerification: async (): Promise<void> => {
    await apiClient.post('/auth/resend-verification');
  },
};

export default apiClient;
