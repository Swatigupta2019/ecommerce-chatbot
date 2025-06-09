export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  features: string[];
}

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  products?: Product[];
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}