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
  timeout: 30000, // 30 second timeout
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
  longdescription?: string | null;
  price: number;
  currency?: string | null;
  manufacturer?: string | null;
  productgroup?: string | null;
  primary_image?: string | null;
  images?: string[];
  is_father_article: boolean;
  is_active?: boolean;
  colour?: string | null;
  size?: string | null;
  component?: string | null;
  type?: string | null;
  father_article?: string | null;
  gtin?: string | null;
  variations?: Product[];
  categories?: Array<{
    categoryid: number;
    category: string;
    categorypath?: string | null;
    categoryimageurl?: string | null;
  }>;
}

export interface ProductVariation {
  variation_id: number;
  variation_name: string;
  price_adjustment: number;
  stock_quantity?: number;
}

export interface CartItemProduct {
  articlenr: string;
  articlename: string;
  price: number;
  primary_image?: string;
  manufacturer?: string;
  colour?: string;
  size?: string;
  in_stock: boolean;
}

export interface CartItem {
  cart_item_id: number;
  cart_id: number;
  product: CartItemProduct;
  quantity: number;
  price_at_addition: number;
  subtotal: number;
  added_at: string;
}

export interface CartSummary {
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  shipping: number;
  total: number;
  item_count: number;
  unique_items: number;
}

export interface Cart {
  cart_id: number;
  user_id?: number;
  guest_session_id?: string;
  items: CartItem[];
  summary: CartSummary;
  created_at: string;
  updated_at: string;
}

export interface Order {
  web_order_id: number;
  ordernr: string;
  orderamount: number;
  currency: string;
  payment_status: string;
  synced_to_erp: boolean;
  created_at: string;
}

export interface User {
  user_id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email_verified: boolean;
  is_active: boolean;
  is_admin?: boolean;
  created_at: string;
  updated_at?: string;
  last_login?: string;
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
  variation_options: Record<string, string[]>; // e.g., { "Farbe": ["Schwarz/Grün", ...], "Größe": [...] }
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
  getCart: async (sessionId?: string): Promise<Cart> => {
    const response = await apiClient.get(`/cart/`, {
      params: sessionId ? { guest_session_id: sessionId } : {},
    });
    return response.data;
  },

  // Add item to cart - Now uses articlenr instead of product_id
  addItem: async (
    sessionId: string,
    articlenr: string,
    quantity: number = 1
  ): Promise<Cart> => {
    const response = await apiClient.post(`/cart/add`, {
      articlenr,
      quantity,
      guest_session_id: sessionId,
    });
    return response.data;
  },

  // Update item quantity - Uses cart_item_id from cart response
  updateItem: async (
    cartItemId: number,
    quantity: number
  ): Promise<Cart> => {
    const response = await apiClient.put(
      `/cart/items/${cartItemId}`,
      { quantity }
    );
    return response.data;
  },

  // Remove item from cart - Uses cart_item_id
  removeItem: async (cartItemId: number): Promise<Cart> => {
    const response = await apiClient.delete(`/cart/items/${cartItemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async (sessionId?: string): Promise<void> => {
    await apiClient.delete(`/cart/`, {
      params: sessionId ? { guest_session_id: sessionId } : {},
    });
  },

  // Get cart item count
  getCartCount: async (sessionId?: string): Promise<{ count: number; unique_items: number }> => {
    const response = await apiClient.get(`/cart/count`, {
      params: sessionId ? { guest_session_id: sessionId } : {},
    });
    return response.data;
  },
};

// ============================================================================
// ORDERS API
// ============================================================================

export const ordersApi = {
  // Create order from localStorage cart
  createOrderFromCart: async (orderPayload: {
    customer_info: {
      customer_frontname: string;
      customer_surname: string;
      customer_email: string;
      customer_adress: string;
      customer_postalcode: string;
      customer_city: string;
      customer_country: string;
      customer_telephone?: string;
    };
    cart_items: Array<{
      articlenr: string;
      articlename: string;
      quantity: number;
      price_at_addition: number;
    }>;
    subtotal: number;
    tax_amount: number;
    shipping: number;
    total_amount: number;
    payment_method: string;
  }): Promise<Order> => {
    const response = await apiClient.post('/web-orders/create', orderPayload);
    return response.data;
  },

  // Create order (legacy method using session cart)
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
    const response = await apiClient.get(`/web-orders/${orderId}`);
    return response.data.order || response.data;
  },

  // Get user orders
  getUserOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/web-orders/');
    return response.data.orders || [];
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
