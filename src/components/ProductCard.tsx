'use client';

import Image from 'next/image';
import { Product } from '@/context/UserContext';
import { MapPin, Calendar, Award, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  showActions?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  showActions = false,
  onEdit,
  onDelete 
}: ProductCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, product.minimumOrder);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.organicCertified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Award size={12} className="mr-1" />
            Organic
          </div>
        )}
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          Grade {product.qualityGrade}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin size={14} className="mr-1" />
          <span>{product.location}</span>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <Calendar size={14} className="mr-1" />
          <span>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-2xl font-bold text-green-600">
              ₹{product.price}
            </span>
            <span className="text-gray-500 text-sm">/{product.unit}</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Available</div>
            <div className="font-semibold">{product.availableQuantity} {product.unit}</div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-3">
          Minimum Order: {product.minimumOrder} {product.unit}
        </div>

        <div className="text-xs text-gray-600 mb-3">
          <strong>Farmer:</strong> {product.farmerName} | {product.farmerPhone}
        </div>

        {showActions ? (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit?.(product)}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(product.id)}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        ) : onAddToCart && (
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <ShoppingCart size={18} className="mr-2" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}