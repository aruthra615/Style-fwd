import { apiRequest } from "./queryClient";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Profile {
  userId: string;
  bodyShape?: string;
  faceShape?: string;
  complexion?: string;
  undertone?: string;
  hairColor?: string;
  styleTags?: string[];
  comfortNotes?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  sizes: string[];
  fitNotes?: string;
  fabric?: string;
  colorHex?: string;
  priceCents: number;
  inStock: boolean;
  images?: string[];
}

export interface OutfitAnalysis {
  fitScore: number;
  colorMatch: number;
  silhouette: string;
  proportions: string;
  neckline: string;
  sleeves: string;
  colorPalette: string[];
  undertoneMatch: 'warm' | 'cool' | 'neutral';
  contrastLevel: 'low' | 'medium' | 'high';
  positives: string[];
  suggestions: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

// Auth API
export const authApi = {
  register: async (data: { email: string; name: string; passwordHash: string }): Promise<{ user: User }> => {
    const res = await apiRequest('POST', '/api/auth/register', data);
    return await res.json();
  },

  login: async (data: { email: string }): Promise<{ user: User }> => {
    const res = await apiRequest('POST', '/api/auth/login', data);
    return await res.json();
  }
};

// Profile API
export const profileApi = {
  get: async (userId: string): Promise<Profile> => {
    const res = await apiRequest('GET', `/api/profile/${userId}`);
    return await res.json();
  },

  create: async (data: Profile): Promise<Profile> => {
    const res = await apiRequest('POST', '/api/profile', data);
    return await res.json();
  },

  update: async (userId: string, data: Partial<Profile>): Promise<Profile> => {
    const res = await apiRequest('PUT', `/api/profile/${userId}`, data);
    return await res.json();
  }
};

// Products API
export const productsApi = {
  getAll: async (filters?: { category?: string; brand?: string; priceMin?: number; priceMax?: number; search?: string }): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const res = await apiRequest('GET', `/api/products?${params.toString()}`);
    return await res.json();
  },

  get: async (id: string): Promise<Product> => {
    const res = await apiRequest('GET', `/api/products/${id}`);
    return await res.json();
  },

  create: async (data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const res = await apiRequest('POST', '/api/products', data);
    return await res.json();
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const res = await apiRequest('PUT', `/api/products/${id}`, data);
    return await res.json();
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest('DELETE', `/api/products/${id}`);
  }
};

// Images API
export const imagesApi = {
  upload: async (file: File, userId: string, type: string): Promise<any> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', userId);
    formData.append('type', type);

    const res = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Upload failed');
    }

    return await res.json();
  },

  getUserImages: async (userId: string, type?: string): Promise<any[]> => {
    const params = type ? `?type=${type}` : '';
    const res = await apiRequest('GET', `/api/images/user/${userId}${params}`);
    return await res.json();
  }
};

// Chat API
export const chatApi = {
  analyzeOutfit: async (file: File, userId: string): Promise<OutfitAnalysis> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', userId);

    const res = await fetch('/api/chat/analyze-outfit', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Analysis failed');
    }

    return await res.json();
  },

  sendMessage: async (userId: string, message: string, conversationId?: string): Promise<any> => {
    const res = await apiRequest('POST', '/api/chat/message', {
      userId,
      message,
      conversationId
    });
    return await res.json();
  },

  getConversations: async (userId: string): Promise<any[]> => {
    const res = await apiRequest('GET', `/api/chat/conversations/${userId}`);
    return await res.json();
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const res = await apiRequest('GET', `/api/chat/messages/${conversationId}`);
    return await res.json();
  }
};

// Admin API
export const adminApi = {
  getStats: async (): Promise<any> => {
    const res = await apiRequest('GET', '/api/admin/stats');
    return await res.json();
  }
};
