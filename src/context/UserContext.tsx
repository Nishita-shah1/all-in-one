'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'farmer' | 'buyer' | 'both';
export type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
export type VehicleType = 'bike' | 'auto' | 'mini_truck' | 'truck' | 'large_truck';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number };
  profileImage?: string;
  // Farmer specific
  farmSize?: number;
  farmingExperience?: number;
  certifications?: string[];
  // Buyer specific
  companyName?: string;
  businessType?: string;
  gstNumber?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  harvestDate: string;
  expiryDate: string;
  organicCertified: boolean;
  minimumOrder: number;
  availableQuantity: number;
  qualityGrade: 'A' | 'B' | 'C';
  storageConditions: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  capacity: number; // in kg
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  currentLocation: { lat: number; lng: number };
  isAvailable: boolean;
  costPerKm: number;
}

export interface LogisticsAssignment {
  id: string;
  orderId: string;
  vehicleId: string;
  driverId: string;
  pickupLocation: { lat: number; lng: number; address: string };
  deliveryLocation: { lat: number; lng: number; address: string };
  distance: number; // in km
  estimatedTime: number; // in minutes
  cost: number;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  assignedAt: string;
  estimatedDelivery: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  products: Array<{
    product: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  totalWeight: number; // in kg
  status: OrderStatus;
  orderDate: string;
  paymentId?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  logisticsAssignment?: LogisticsAssignment;
  deliveryInstructions?: string;
  expectedDeliveryDate?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'card' | 'upi' | 'netbanking' | 'wallet';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paymentDate: string;
  gatewayResponse?: any;
}

interface UserContextType {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
  products: Product[];
  vehicles: Vehicle[];
  payments: Payment[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (orderData: Partial<Order>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  processPayment: (orderId: string, paymentMethod: string) => Promise<boolean>;
  assignVehicle: (orderId: string) => Promise<boolean>;
  addProduct: (product: Partial<Product>) => Promise<string>;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  getProductsByFarmer: (farmerId: string) => Product[];
  getOrdersByUser: (userId: string, role: 'buyer' | 'seller') => Order[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Dummy data
const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@farmer.com',
    phone: '+91-9876543210',
    role: 'farmer',
    location: 'Punjab',
    address: 'Village Khanna, District Ludhiana, Punjab',
    coordinates: { lat: 30.7046, lng: 76.7179 },
    farmSize: 10,
    farmingExperience: 15,
    certifications: ['Organic Certified', 'Good Agricultural Practices']
  },
  {
    id: '2',
    name: 'Agro Foods Ltd',
    email: 'procurement@agrofoods.com',
    phone: '+91-9876543211',
    role: 'buyer',
    location: 'Delhi',
    address: 'Sector 18, Noida, Delhi NCR',
    coordinates: { lat: 28.5706, lng: 77.3272 },
    companyName: 'Agro Foods Ltd',
    businessType: 'Food Processing',
    gstNumber: 'GST123456789'
  },
  {
    id: '3',
    name: 'Wholesale Mart',
    email: 'admin@wholesalemart.com',
    phone: '+91-9876543212',
    role: 'both',
    location: 'Mumbai',
    address: 'Andheri East, Mumbai, Maharashtra',
    coordinates: { lat: 19.1136, lng: 72.8697 },
    companyName: 'Wholesale Mart Pvt Ltd',
    businessType: 'Wholesale Trading'
  }
];

const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Basmati Rice',
    category: 'Grains',
    price: 80,
    quantity: 1000,
    unit: 'kg',
    image: 'https://images.pexels.com/photos/33239/rice-grain-seed-food.jpg?auto=compress&cs=tinysrgb&w=500',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    farmerPhone: '+91-9876543210',
    location: 'Punjab',
    coordinates: { lat: 30.7046, lng: 76.7179 },
    description: 'Premium quality Basmati rice, aged for 2 years',
    harvestDate: '2024-11-01',
    expiryDate: '2025-11-01',
    organicCertified: true,
    minimumOrder: 50,
    availableQuantity: 1000,
    qualityGrade: 'A',
    storageConditions: 'Cool and dry place'
  },
  {
    id: '2',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: 25,
    quantity: 500,
    unit: 'kg',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=500',
    farmerId: '1',
    farmerName: 'Rajesh Kumar',
    farmerPhone: '+91-9876543210',
    location: 'Punjab',
    coordinates: { lat: 30.7046, lng: 76.7179 },
    description: 'Fresh red tomatoes, perfect for processing',
    harvestDate: '2024-12-15',
    expiryDate: '2024-12-25',
    organicCertified: false,
    minimumOrder: 25,
    availableQuantity: 500,
    qualityGrade: 'A',
    storageConditions: 'Refrigerated'
  }
];

const dummyVehicles: Vehicle[] = [
  {
    id: '1',
    type: 'mini_truck',
    capacity: 1000,
    driverId: 'D001',
    driverName: 'Suresh Singh',
    driverPhone: '+91-9876543220',
    vehicleNumber: 'PB-01-AB-1234',
    currentLocation: { lat: 30.7046, lng: 76.7179 },
    isAvailable: true,
    costPerKm: 15
  },
  {
    id: '2',
    type: 'truck',
    capacity: 5000,
    driverId: 'D002',
    driverName: 'Ramesh Yadav',
    driverPhone: '+91-9876543221',
    vehicleNumber: 'DL-01-CD-5678',
    currentLocation: { lat: 28.5706, lng: 77.3272 },
    isAvailable: true,
    costPerKm: 25
  }
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [vehicles, setVehicles] = useState<Vehicle[]>(dummyVehicles);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedCart = localStorage.getItem('cart');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [user, cart]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = dummyUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'farmer',
      location: userData.location || '',
      address: userData.address || '',
      coordinates: userData.coordinates || { lat: 0, lng: 0 },
      ...userData
    };
    setUser(newUser);
    return true;
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const findOptimalVehicle = (totalWeight: number, pickupLocation: { lat: number; lng: number }): Vehicle | null => {
    const availableVehicles = vehicles.filter(v => v.isAvailable && v.capacity >= totalWeight);
    
    if (availableVehicles.length === 0) return null;

    // Find the nearest vehicle with sufficient capacity
    let optimalVehicle = availableVehicles[0];
    let minDistance = calculateDistance(
      pickupLocation.lat, pickupLocation.lng,
      optimalVehicle.currentLocation.lat, optimalVehicle.currentLocation.lng
    );

    for (const vehicle of availableVehicles) {
      const distance = calculateDistance(
        pickupLocation.lat, pickupLocation.lng,
        vehicle.currentLocation.lat, vehicle.currentLocation.lng
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        optimalVehicle = vehicle;
      }
    }

    return optimalVehicle;
  };

  const placeOrder = async (orderData: Partial<Order>): Promise<string> => {
    const orderId = `ORD-${Date.now()}`;
    const totalWeight = cart.reduce((sum, item) => sum + (item.quantity * 0.5), 0); // Assuming 0.5kg per unit
    
    const newOrder: Order = {
      id: orderId,
      buyerId: user?.id || '',
      buyerName: user?.name || '',
      buyerPhone: user?.phone || '',
      buyerAddress: user?.address || '',
      sellerId: cart[0]?.product.farmerId || '',
      sellerName: cart[0]?.product.farmerName || '',
      sellerPhone: cart[0]?.product.farmerPhone || '',
      sellerAddress: cart[0]?.product.location || '',
      products: cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity
      })),
      totalAmount: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      totalWeight,
      status: 'pending',
      orderDate: new Date().toISOString(),
      ...orderData
    };

    setOrders(prev => [...prev, newOrder]);
    clearCart();
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const processPayment = async (orderId: string, paymentMethod: string): Promise<boolean> => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    const paymentId = `PAY-${Date.now()}`;
    const payment: Payment = {
      id: paymentId,
      orderId,
      amount: order.totalAmount,
      method: paymentMethod as any,
      status: 'processing',
      paymentDate: new Date().toISOString()
    };

    setPayments(prev => [...prev, payment]);

    // Simulate payment processing
    setTimeout(() => {
      setPayments(prev =>
        prev.map(p =>
          p.id === paymentId
            ? { ...p, status: 'completed', transactionId: `TXN-${Date.now()}` }
            : p
        )
      );
      updateOrderStatus(orderId, 'paid');
    }, 2000);

    return true;
  };

  const assignVehicle = async (orderId: string): Promise<boolean> => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    const pickupLocation = { lat: 30.7046, lng: 76.7179 }; // Seller location
    const deliveryLocation = user?.coordinates || { lat: 28.5706, lng: 77.3272 }; // Buyer location

    const optimalVehicle = findOptimalVehicle(order.totalWeight, pickupLocation);
    if (!optimalVehicle) return false;

    const distance = calculateDistance(
      pickupLocation.lat, pickupLocation.lng,
      deliveryLocation.lat, deliveryLocation.lng
    );

    const logisticsAssignment: LogisticsAssignment = {
      id: `LOG-${Date.now()}`,
      orderId,
      vehicleId: optimalVehicle.id,
      driverId: optimalVehicle.driverId,
      pickupLocation: { ...pickupLocation, address: order.sellerAddress },
      deliveryLocation: { ...deliveryLocation, address: order.buyerAddress },
      distance,
      estimatedTime: Math.round(distance * 2), // 2 minutes per km
      cost: distance * optimalVehicle.costPerKm,
      status: 'assigned',
      assignedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + distance * 2 * 60000).toISOString()
    };

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status: 'assigned', logisticsAssignment }
          : o
      )
    );

    setVehicles(prev =>
      prev.map(v =>
        v.id === optimalVehicle.id ? { ...v, isAvailable: false } : v
      )
    );

    return true;
  };

  const addProduct = async (productData: Partial<Product>): Promise<string> => {
    const productId = `PROD-${Date.now()}`;
    const newProduct: Product = {
      id: productId,
      farmerId: user?.id || '',
      farmerName: user?.name || '',
      farmerPhone: user?.phone || '',
      location: user?.location || '',
      coordinates: user?.coordinates || { lat: 0, lng: 0 },
      ...productData
    } as Product;

    setProducts(prev => [...prev, newProduct]);
    return productId;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, ...updates } : p)
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getProductsByFarmer = (farmerId: string): Product[] => {
    return products.filter(p => p.farmerId === farmerId);
  };

  const getOrdersByUser = (userId: string, role: 'buyer' | 'seller'): Order[] => {
    return orders.filter(o =>
      role === 'buyer' ? o.buyerId === userId : o.sellerId === userId
    );
  };

  return (
    <UserContext.Provider value={{
      user,
      cart,
      orders,
      products,
      vehicles,
      payments,
      login,
      logout,
      register,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus,
      processPayment,
      assignVehicle,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsByFarmer,
      getOrdersByUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}