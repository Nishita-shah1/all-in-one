'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import ProductCard from '@/components/ProductCard';
import { Package, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ManageProductsPage() {
  const { user, getProductsByFarmer, deleteProduct } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (user.role === 'buyer') {
      router.push('/dashboard/buyer');
      return;
    }
  }, [user, router]);

  if (!user) return null;

  const myProducts = getProductsByFarmer(user.id);
  const filteredProducts = myProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: any) => {
    // In a real app, this would navigate to an edit page
    console.log('Edit product:', product);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Manage Products 📦
              </h1>
              <p className="text-gray-600">
                Edit, update, or remove your listed products
              </p>
            </div>
            <Link
              href="/products/add"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="mr-2" size={20} />
              Add Product
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search your products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {myProducts.length === 0 ? 'No products listed yet' : 'No products found'}
            </h2>
            <p className="text-gray-600 mb-6">
              {myProducts.length === 0 
                ? 'Start by adding your first product to begin selling'
                : 'Try adjusting your search criteria'
              }
            </p>
            {myProducts.length === 0 && (
              <Link
                href="/products/add"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
              >
                <Plus className="mr-2" size={20} />
                Add Your First Product
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showActions={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            <div className="mt-8 text-center text-gray-600">
              Showing {filteredProducts.length} of {myProducts.length} products
            </div>
          </>
        )}
      </div>
    </div>
  );
}