import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { Star, ShoppingCart, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    
    // Reset the button after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleViewDetails = () => {
    // In a real app, this would open product details
    console.log('Viewing details:', product.name);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full sm:w-24 h-24 object-cover rounded-lg bg-slate-100"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {product.description}
              </p>
              
              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col items-end space-y-2">
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">
                  ${product.price.toLocaleString()}
                </div>
                
                {/* Rating */}
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-slate-600">
                    {product.rating} ({product.stock} in stock)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleViewDetails}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={handleAddToCart}
                  className={`p-2 rounded-lg transition-all transform hover:scale-105 ${
                    isAdded
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                  title={isAdded ? 'Added to Cart!' : 'Add to Cart'}
                >
                  {isAdded ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}