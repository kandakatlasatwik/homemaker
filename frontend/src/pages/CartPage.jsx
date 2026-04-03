import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import '../App.css';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CartPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

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

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setPreviewImage(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
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
      <div className={`min-h-screen flex flex-col pt-20 ${theme.bg} transition-colors duration-300`}>
        <NavBar />
        <div className="grow flex items-center justify-center">
          <div className={`text-xl ${theme.text}`}>Loading cart...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme.bg} transition-colors duration-300 pt-20`}>
      <NavBar />
      
      <div className="grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.isDark ? 'border-gray-600 text-gray-200 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} transition-colors duration-300`}
          >
            <span aria-hidden="true">←</span>
            <span>Back</span>
          </button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${theme.textHeading} transition-colors duration-300`}>
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
          <div className={`${theme.isDark ? 'bg-red-900/30 border-red-500/50 text-red-300' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 rounded mb-6 transition-colors duration-300`}>
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className={`text-center py-16 ${theme.textSecondary}`}>
            <div className="text-6xl mb-4">🛒</div>
            <h2 className={`text-2xl font-semibold ${theme.textHeading} mb-2 transition-colors duration-300`}>
              Your cart is empty
            </h2>
            <p className={`${theme.textSecondary} mb-6 transition-colors duration-300`}>
              Generate some images and add them to your cart!
            </p>
            <a
              href="/"
              className={`inline-block px-8 py-3 ${theme.isDark ? 'bg-amber-500 hover:bg-amber-600 text-black' : 'bg-purple-600 hover:bg-purple-700 text-white'} rounded-lg transition-colors duration-300 font-medium`}
            >
              Start Creating
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item, index) => (
              <div
                key={item._id}
                className={`hm-card product-card animate-float-up relative ${theme.bgCard} rounded-xl ${theme.shadowCard} overflow-hidden transition-all duration-500 border ${theme.isDark ? 'border-gray-700' : 'border-gray-200'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`data:image/png;base64,${item.generated_image_base64}`}
                    alt={item.object_type}
                    className="hm-card-image product-card-image w-full h-64 object-cover cursor-zoom-in"
                    onClick={() => setPreviewImage(`data:image/png;base64,${item.generated_image_base64}`)}
                  />
                  <span className="hm-card-overlay product-card-overlay" aria-hidden="true" />
                  <span className="card-shine" aria-hidden="true" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-lg font-semibold ${theme.textHeading} capitalize transition-colors duration-300`}>
                      {item.object_type.replace('_', ' ')}
                    </h3>
                    <button
                      onClick={() => deleteCartItem(item._id)}
                      className={`${theme.isDark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'} transition-colors duration-300`}
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
                  <p className={`text-sm ${theme.textSecondary} mb-2 transition-colors duration-300`}>
                    Added: {new Date(item.added_at).toLocaleString()}
                  </p>
                  <div className="mt-4 flex gap-2">
                    {item.texture_url ? (
                    <div>
                      <img
                        src={item.texture_url}
                        alt="Texture"
                        className={`w-20 h-20 object-cover rounded-lg border-2 ${theme.isDark ? 'border-gray-600' : 'border-gray-200'}`}
                        title={item.object_type === 'curtain' ? 'Main curtain texture' : 'Original texture'}
                      />
                      {item.object_type === 'curtain' && (
                        <p className={`text-xs mt-1 text-center ${theme.textMuted}`}>Main</p>
                      )}
                    </div>
                    ) : null}
                    {item.object_type === 'curtain' && item.texture_secondary && (
                      <div>
                        <img
                          src={item.texture_secondary}
                          alt="Sheer texture"
                          className={`w-20 h-20 object-cover rounded-lg border-2 ${theme.isDark ? 'border-gray-600' : 'border-gray-200'}`}
                          title="Sheer curtain texture"
                        />
                        <p className={`text-xs mt-1 text-center ${theme.textMuted}`}>Sheer</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300"
            aria-label="Close image preview"
          >
            ×
          </button>
          <img
            src={previewImage}
            alt="Cart preview"
            className="w-full h-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CartPage;
