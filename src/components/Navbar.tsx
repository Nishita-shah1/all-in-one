'use client';

import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { ShoppingCart, User, LogOut, Package, Truck, CreditCard } from 'lucide-react';

export default function Navbar() {
  const { user, logout, cart } = useUser();

  if (!user) return null;

  const getDashboardLink = () => {
    switch (user.role) {
      case 'farmer':
        return '/dashboard/farmer';
      case 'buyer':
        return '/dashboard/buyer';
      case 'both':
        return '/dashboard/wholesaler';
      default:
        return '/dashboard';
    }
  };

  const getNavItems = () => {
    const baseItems = [
      { href: getDashboardLink(), label: 'Dashboard', icon: User }
    ];

    if (user.role === 'farmer' || user.role === 'both') {
      baseItems.push(
        { href: '/products/manage', label: 'My Products', icon: Package },
        { href: '/orders/received', label: 'Orders Received', icon: Truck }
      );
    }

    if (user.role === 'buyer' || user.role === 'both') {
      baseItems.push(
        { href: '/products', label: 'Browse Products', icon: Package },
        { href: '/orders/placed', label: 'My Orders', icon: CreditCard }
      );
    }

    return baseItems;
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              🌾 AgriConnect
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {getNavItems().map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 hover:text-green-200 transition-colors"
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {(user.role === 'buyer' || user.role === 'both') && (
              <Link href="/cart" className="relative hover:text-green-200 transition-colors">
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            
            <div className="flex items-center space-x-2">
              <User size={20} />
              <span className="hidden sm:block">{user.name}</span>
              <span className="text-xs bg-green-700 px-2 py-1 rounded capitalize">
                {user.role}
              </span>
            </div>
            
            <button
              onClick={() => {}}
              className="flex items-center space-x-1 hover:text-green-200 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:block">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}