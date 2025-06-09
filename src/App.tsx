import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Layout } from './components/Layout';
import { LoginForm } from './components/Auth/LoginForm';
import { ChatInterface } from './components/Chat/ChatInterface';

function AppContent() {
  const { user, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginForm 
        onToggleMode={() => setIsRegister(!isRegister)} 
        isRegister={isRegister} 
      />
    );
  }

  return (
    <CartProvider>
      <Layout>
        <ChatInterface />
      </Layout>
    </CartProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;