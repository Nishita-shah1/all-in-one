'use client';

import { useUser } from '@/context/UserContext';
import { ShoppingCart, Package, TrendingDown, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BuyerDashboard() {
  const { user, cart, getOrdersByUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (user.role !== 'buyer' && user.role !== 'both') {
      router.push('/');
      return;
    }
  }, [user, router]);

  if (!user) return null;

  const myOrders = getOrdersByUser(user.id, 'buyer');
  const totalSpent = myOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const stats = [
    {
      title: 'Cart Items',
      value: cart.length,
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Orders',
      value: myOrders.length,
      icon: Package,
      color: 'bg-green-500'
    },
    {
      title: 'Total Spent',
      value: `₹${totalSpent.toLocaleString()}`,
      icon: TrendingDown,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Orders',
      value: myOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user.name}! 🏢
          </h1>
          <p className="text-gray-600 mt-2">
            Browse fresh products and manage your orders
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/products"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <Package className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Browse Products</h3>
                <p className="text-gray-600">Find fresh agricultural products</p>
              </div>
            </div>
          </Link>

          <Link
            href="/cart"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">View Cart</h3>
                <p className="text-gray-600">{cart.length} items in cart</p>
              </div>
            </div>
          </Link>

          <Link
            href="/orders/placed"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Clock className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">My Orders</h3>
                <p className="text-gray-600">Track your purchases</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          </div>
          <div className="p-6">
            {myOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No orders yet</p>
                <p className="text-sm text-gray-500">Start browsing products to place your first order</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        From {order.sellerName} • {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₹{order.totalAmount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}