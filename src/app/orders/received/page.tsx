'use client';

import { useUser } from '@/context/UserContext';
import OrderCard from '@/components/OrderCard';
import { Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ReceivedOrdersPage() {
  const { user, getOrdersByUser, updateOrderStatus, assignVehicle } = useUser();
  const router = useRouter();

  const receivedOrders = getOrdersByUser(user.id, 'seller');

  const handleUpdateStatus = (orderId: string, status: any) => {
    updateOrderStatus(orderId, status);
  };

  const handleAssignVehicle = async (orderId: string) => {
    await assignVehicle(orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Orders Received 📥
          </h1>
          <p className="text-gray-600">
            Manage incoming orders and track deliveries
          </p>
        </div>

        {receivedOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">No orders received yet</h2>
            <p className="text-gray-600 mb-6">
              Orders from customers will appear here once they start purchasing your products.
            </p>
            <button
              onClick={() => router.push('/products/add')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {receivedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                viewType="seller"
                onUpdateStatus={handleUpdateStatus}
                onAssignVehicle={handleAssignVehicle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}