'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { CreditCard, Smartphone, Building, Wallet, CheckCircle, Truck } from 'lucide-react';

interface CheckoutPageProps {
  params: { orderId: string };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { user, orders, processPayment, assignVehicle } = useUser();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [vehicleAssigned, setVehicleAssigned] = useState(false);
  const router = useRouter();

  const order = orders.find(o => o.id === params.orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order not found</h1>
          <button
            onClick={() => router.push('/orders/placed')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setPaymentStatus('processing');
    
    try {
      const success = await processPayment(order.id, paymentMethod);
      if (success) {
        setPaymentStatus('completed');
        
        // Auto-assign vehicle after payment
        setTimeout(async () => {
          const assigned = await assignVehicle(order.id);
          setVehicleAssigned(assigned);
        }, 2000);
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      setPaymentStatus('failed');
    }
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI Payment', icon: Smartphone },
    { id: 'netbanking', name: 'Net Banking', icon: Building },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet }
  ];

  if (paymentStatus === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your order #{order.id} has been confirmed and payment processed successfully.
            </p>
            
            {vehicleAssigned && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <Truck className="mx-auto text-blue-500 mb-2" size={32} />
                <p className="text-blue-800 font-semibold">Vehicle Assigned!</p>
                <p className="text-blue-600 text-sm">
                  Your order is being prepared for delivery. You'll receive tracking details soon.
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/orders/placed')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                View My Orders
              </button>
              <button
                onClick={() => router.push('/products')}
                className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Checkout 💳
          </h1>
          <p className="text-gray-600">
            Complete your payment to confirm the order
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {order.products.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.product.unit} × ₹{item.unitPrice}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.totalPrice}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
            
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <method.icon className="mr-3 text-gray-600" size={24} />
                  <span className="font-medium">{method.name}</span>
                </label>
              ))}
            </div>

            {paymentStatus === 'failed' && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">
                Payment failed. Please try again.
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={paymentStatus === 'processing'}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {paymentStatus === 'processing' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2" size={20} />
                  Pay ₹{order.totalAmount.toLocaleString()}
                </>
              )}
            </button>

            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>🔒 Your payment information is secure and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}