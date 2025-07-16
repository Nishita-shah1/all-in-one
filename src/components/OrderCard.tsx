'use client';

import { Order } from '@/context/UserContext';
import { Package, Truck, CheckCircle, Clock, CreditCard, MapPin } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  viewType: 'buyer' | 'seller';
  onUpdateStatus?: (orderId: string, status: any) => void;
  onAssignVehicle?: (orderId: string) => void;
}

export default function OrderCard({ order, viewType, onUpdateStatus, onAssignVehicle }: OrderCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'confirmed':
        return <CheckCircle className="text-blue-500" size={20} />;
      case 'paid':
        return <CreditCard className="text-green-500" size={20} />;
      case 'assigned':
        return <Truck className="text-purple-500" size={20} />;
      case 'in_transit':
        return <Truck className="text-orange-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'in_transit':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
          <p className="text-sm text-gray-600">
            {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(order.status)}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            {viewType === 'buyer' ? 'Seller Details' : 'Buyer Details'}
          </h4>
          <p className="text-sm text-gray-600">
            {viewType === 'buyer' ? order.sellerName : order.buyerName}
          </p>
          <p className="text-sm text-gray-600">
            {viewType === 'buyer' ? order.sellerPhone : order.buyerPhone}
          </p>
          <p className="text-sm text-gray-600">
            {viewType === 'buyer' ? order.sellerAddress : order.buyerAddress}
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Order Summary</h4>
          <p className="text-sm text-gray-600">
            Total Items: {order.products.length}
          </p>
          <p className="text-sm text-gray-600">
            Total Weight: {order.totalWeight} kg
          </p>
          <p className="text-lg font-semibold text-green-600">
            Total: ₹{order.totalAmount}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Products</h4>
        <div className="space-y-2">
          {order.products.map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
              <div>
                <span className="font-medium">{item.product.name}</span>
                <span className="text-sm text-gray-600 ml-2">
                  ({item.product.category})
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {item.quantity} {item.product.unit} × ₹{item.unitPrice}
                </div>
                <div className="font-semibold">₹{item.totalPrice}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {order.logisticsAssignment && (
        <div className="mb-4 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2 flex items-center">
            <Truck className="mr-2" size={18} />
            Logistics Details
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Driver:</strong> {order.logisticsAssignment.driverId}</p>
              <p><strong>Vehicle:</strong> {order.logisticsAssignment.vehicleId}</p>
              <p><strong>Distance:</strong> {order.logisticsAssignment.distance} km</p>
            </div>
            <div>
              <p><strong>Estimated Time:</strong> {order.logisticsAssignment.estimatedTime} mins</p>
              <p><strong>Delivery Cost:</strong> ₹{order.logisticsAssignment.cost}</p>
              <p><strong>Status:</strong> {order.logisticsAssignment.status}</p>
            </div>
          </div>
        </div>
      )}

      {viewType === 'seller' && (
        <div className="flex space-x-2">
          {order.status === 'pending' && (
            <button
              onClick={() => onUpdateStatus?.(order.id, 'confirmed')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Confirm Order
            </button>
          )}
          {order.status === 'paid' && !order.logisticsAssignment && (
            <button
              onClick={() => onAssignVehicle?.(order.id)}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            >
              Assign Vehicle
            </button>
          )}
          {order.status === 'assigned' && (
            <button
              onClick={() => onUpdateStatus?.(order.id, 'in_transit')}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
            >
              Mark In Transit
            </button>
          )}
          {order.status === 'in_transit' && (
            <button
              onClick={() => onUpdateStatus?.(order.id, 'delivered')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Mark Delivered
            </button>
          )}
        </div>
      )}
    </div>
  );
}