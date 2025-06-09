import { AuthResponse, Product, Message, ChatSession } from '../types';

const API_BASE = 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    this.token = data.token;
    localStorage.setItem('token', data.token);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    this.token = data.token;
    localStorage.setItem('token', data.token);
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async getProducts(params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
  }): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE}/products?${queryParams}`);
    return response.json();
  }

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${id}`);
    return response.json();
  }

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE}/categories`);
    return response.json();
  }

  async sendMessage(message: string, sessionId?: string): Promise<{ message: Message; sessionId: string }> {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  async getChatSessions(): Promise<ChatSession[]> {
    const response = await fetch(`${API_BASE}/chat/sessions`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getChatSession(sessionId: string): Promise<ChatSession> {
    const response = await fetch(`${API_BASE}/chat/sessions/${sessionId}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }
}

export const apiService = new ApiService();