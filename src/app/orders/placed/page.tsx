'use client';

import { useUser } from '@/context/UserContext';
import OrderCard from '@/components/OrderCard';
import { Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PlacedOrdersPage() {
  const { user, getOrdersByUser } = useUser();
  const router = useRouter();

  const myOrders = getOrdersByUser(user.id, 'buyer');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            My Orders 📦
          </h1>
          <p className="text-gray-600">
            Track your purchases and order history
          </p>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <button
              onClick={() => router.push('/products')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                viewType="buyer"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}