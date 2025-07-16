'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Package, ShoppingCart, TrendingUp, Users, Plus, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WholesalerDashboard() {
  const { user, cart, getProductsByFarmer, getOrdersByUser } = useUser();
  const [activeTab, setActiveTab] = useState<'selling' | 'buying'>('selling');
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (user.role !== 'both') {
      router.push('/');
      return;
    }
  }, [user, router]);

  if (!user) return null;

  const myProducts = getProductsByFarmer(user.id);
  const sellOrders = getOrdersByUser(user.id, 'seller');
  const buyOrders = getOrdersByUser(user.id, 'buyer');
  
  const sellRevenue = sellOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.totalAmount, 0);
  
  const buySpent = buyOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const sellingStats = [
    {
      title: 'My Products',
      value: myProducts.length,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Sales Orders',
      value: sellOrders.length,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Revenue',
      value: `₹${sellRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Customers',
      value: new Set(sellOrders.map(o => o.buyerId)).size,
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  const buyingStats = [
    {
      title: 'Cart Items',
      value: cart.length,
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Purchase Orders',
      value: buyOrders.length,
      icon: Package,
      color: 'bg-green-500'
    },
    {
      title: 'Total Spent',
      value: `₹${buySpent.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Orders',
      value: buyOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  const currentStats = activeTab === 'selling' ? sellingStats : buyingStats;
  const currentOrders = activeTab === 'selling' ? sellOrders : buyOrders;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user.name}! 🔄
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your wholesale business - buy and sell agricultural products
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('selling')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'selling'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Selling Dashboard
              </button>
              <button
                onClick={() => setActiveTab('buying')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'buying'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Buying Dashboard
              </button>
            </nav>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentStats.map((stat, index) => (
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
          {activeTab === 'selling' ? (
            <>
              <Link
                href="/products/add"
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <Plus className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">Add Product</h3>
                    <p className="text-gray-600">List new products for sale</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/products/manage"
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Package className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">Manage Products</h3>
                    <p className="text-gray-600">Edit existing products</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/orders/received"
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center">
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">Sales Orders</h3>
                    <p className="text-gray-600">Manage incoming orders</p>
                  </div>
                </div>
              </Link>
            </>
          ) : (
            <>
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
                    <p className="text-gray-600">Find products to purchase</p>
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
                    <h3 className="text-lg font-semibold text-gray-800">Purchase Orders</h3>
                    <p className="text-gray-600">Track your purchases</p>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent {activeTab === 'selling' ? 'Sales' : 'Purchase'} Orders
            </h2>
          </div>
          <div className="p-6">
            {currentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No orders yet</p>
                <p className="text-sm text-gray-500">
                  {activeTab === 'selling' 
                    ? 'Orders will appear here once customers buy your products'
                    : 'Start browsing products to place your first order'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {activeTab === 'selling' ? order.buyerName : order.sellerName} • {new Date(order.orderDate).toLocaleDateString()}
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