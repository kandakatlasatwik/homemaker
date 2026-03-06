import React, { useState, useEffect } from 'react';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import '../App.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getGuestId = () => {
    let guestId = localStorage.getItem('guest_id');
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guest_id', guestId);
    }
    return guestId;
  };

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const guestId = getGuestId();
      const response = await fetch(`${API_URL}/cart/${guestId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      
      const data = await response.json();
      setCartItems(data.items || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteCartItem = async (cartItemId) => {
    try {
      const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      
      await fetchCartItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item from cart');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }
    
    try {
      const guestId = getGuestId();
      const response = await fetch(`${API_URL}/cart/clear/${guestId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      
      await fetchCartItems();
    } catch (err) {
      console.error('Error clearing cart:', err);
      alert('Failed to clear cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col pt-20">
        <NavBar />
        <div className="grow flex items-center justify-center">
          <div className="text-xl">Loading cart...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-purple-50 to-pink-50 pt-20">
      <NavBar />
      
      <div className="grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            🛒 My Cart
          </h1>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Generate some images and add them to your cart!
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Creating
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={`data:image/png;base64,${item.generated_image_base64}`}
                  alt={item.object_type}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 capitalize">
                      {item.object_type.replace('_', ' ')}
                    </h3>
                    <button
                      onClick={() => deleteCartItem(item._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove from cart"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Added: {new Date(item.added_at).toLocaleString()}
                  </p>
                  <div className="mt-4">
                    <img
                      src={item.texture_url}
                      alt="Texture"
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                      title="Original texture"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Total Items: {cartItems.length}
                </h3>
                <p className="text-gray-600 mt-2">
                  Ready to proceed with your selections?
                </p>
              </div>
              <button
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                onClick={() => alert('Checkout functionality coming soon!')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
