'use client';

import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { Tractor, Users, Truck, ShoppingCart, Package, TrendingUp } from 'lucide-react';

export default function Home() {
  const { user } = useUser();

  if (user) {
    // Redirect to appropriate dashboard based on role
    const dashboardPath = user.role === 'farmer' ? '/dashboard/farmer' : 
                         user.role === 'buyer' ? '/dashboard/buyer' : 
                         '/dashboard/wholesaler';
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome back, {user.name}!
          </h1>
          <Link
            href={dashboardPath}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            🌾 Welcome to <span className="text-green-600">AgriConnect</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The ultimate one-stop platform connecting farmers, institutional buyers, and wholesalers. 
            Streamline your agricultural business with smart logistics, secure payments, and real-time tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Complete Agricultural Ecosystem
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-green-50">
              <Tractor className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="text-xl font-semibold mb-3">For Farmers</h3>
              <p className="text-gray-600">
                List your products, manage inventory, track orders, and get fair prices directly from buyers.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-blue-50">
              <Users className="mx-auto mb-4 text-blue-600" size={48} />
              <h3 className="text-xl font-semibold mb-3">For Institutional Buyers</h3>
              <p className="text-gray-600">
                Source quality products directly from farmers, manage procurement, and ensure timely delivery.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-purple-50">
              <Package className="mx-auto mb-4 text-purple-600" size={48} />
              <h3 className="text-xl font-semibold mb-3">For Wholesalers</h3>
              <p className="text-gray-600">
                Buy and sell agricultural products, expand your network, and optimize your supply chain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Product Listing</h3>
              <p className="text-sm text-gray-600">Farmers list their products with details, pricing, and availability</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Order Placement</h3>
              <p className="text-sm text-gray-600">Buyers browse, select products, and place orders with requirements</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Smart Logistics</h3>
              <p className="text-sm text-gray-600">AI-powered system assigns optimal vehicles based on location and load</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Secure Delivery</h3>
              <p className="text-sm text-gray-600">Real-time tracking, secure payments, and timely delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Platform Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <ShoppingCart className="text-green-600 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-2">Smart Cart System</h3>
                <p className="text-gray-600 text-sm">Intelligent cart management with bulk ordering and price optimization</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Truck className="text-blue-600 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-2">AI-Powered Logistics</h3>
                <p className="text-gray-600 text-sm">Automatic vehicle assignment based on location, capacity, and efficiency</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <TrendingUp className="text-purple-600 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-gray-600 text-sm">Track sales, orders, and market trends with comprehensive dashboards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Agricultural Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers, buyers, and wholesalers already using AgriConnect
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Journey Today
          </Link>
        </div>
      </section>
    </div>
  );
}