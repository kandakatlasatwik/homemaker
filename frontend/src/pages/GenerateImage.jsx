import bedroom1 from "../assets/bedrooms/bedroom1.png";
import bedroom2 from "../assets/bedrooms/bedroom2.png";
import bedroom3 from "../assets/bedrooms/bedroom3.png";
import bedroom4 from "../assets/bedrooms/bedroom4.png";
import React, { useState } from 'react';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import GenerateImageCard from '../components/ui/GenerateImageCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import sofaroom1 from "../assets/sofarooms/sofaroom1.png";
import sofaroom2 from "../assets/sofarooms/sofaroom2.png";
import sofaroom3 from "../assets/sofarooms/sofaroom3.png";
import sofaroom4 from "../assets/sofarooms/sofaroom4.png";

import curtain1 from "../assets/curtainrooms/curtain1.png";
import curtain2 from "../assets/curtainrooms/curtain2.png";
import curtain3 from "../assets/curtainrooms/curtain3.png";
import curtain4 from "../assets/curtainrooms/curtain4.png";

import cushion1 from "../assets/cushionrooms/cushions1.png";
import cushion2 from "../assets/cushionrooms/cushions2.png";
import cushion3 from "../assets/cushionrooms/cushions3.png";
import cushion4 from "../assets/cushionrooms/cushions4.png";

import rug1 from "../assets/rugrooms/rug1.png";
import rug2 from "../assets/rugrooms/rug2.png";
import rug3 from "../assets/rugrooms/rug3.png";
import rug4 from "../assets/rugrooms/rug4.png";

import upholstery1 from "../assets/upholsteryrooms/upholstery1.png";
import upholstery2 from "../assets/upholsteryrooms/upholstery2.png";
import upholstery3 from "../assets/upholsteryrooms/upholstery3.png";
import upholstery4 from "../assets/upholsteryrooms/upholstery4.png";


// Room images by type (match SelectRoom)
const roomImagesByType = {
  sofa: [
    { src: sofaroom1 },
    { src: sofaroom2 },
    { src: sofaroom3 },
    { src: sofaroom4 },
  ],
  bed: [
    { src: bedroom1 },
    { src: bedroom2 },
    { src: bedroom3 },
    { src: bedroom4 },
  ],
  curtain: [
    { src: curtain1 },
    { src: curtain2 },
    { src: curtain3 },
    { src: curtain4 },
  ],
  cushion: [
    { src: cushion1 },
    { src: cushion2 },
    { src: cushion3 },
    { src: cushion4 },
  ],
  rugs: [
    { src: rug1 },
    { src: rug2 },
    { src: rug3 },
    { src: rug4 },
  ],
  upholstery: [
    { src: upholstery1 },
    { src: upholstery2 },
    { src: upholstery3 },
    { src: upholstery4 },
  ],
};

// Utility to convert image URL to base64
const imageToBase64 = async (imageUrl) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const GenerateImage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const theme = useTheme();
  const objectType = params.get('type') || 'sofa';
  const textureUrl = params.get('texture');
  const roomIndex = parseInt(params.get('room'), 10);

  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedImageId, setGeneratedImageId] = useState(null);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const api = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Get or create guest ID
  const getGuestId = () => {
    let guestId = localStorage.getItem('guest_id');
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guest_id', guestId);
    }
    return guestId;
  };

  const handleGenerate = async () => {
    if (isNaN(roomIndex) || !textureUrl) return;
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedImageId(null);
    try {
      const imagesForType = roomImagesByType[objectType] || roomImagesByType['sofa'];
      const roomImage = imagesForType[roomIndex];
      const roomImageBase64 = await imageToBase64(roomImage.src);
      const guestId = getGuestId();
      
      const response = await fetch(`${api}/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guest_id: guestId,
          object_type: objectType,
          texture: textureUrl,
          base_image_base64: roomImageBase64,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate image');
      }
      const data = await response.json();
      setGeneratedImage(data.generated_image_base64);
      setGeneratedImageId(data.image_id);
    } catch (err) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!generatedImageId) return;
    
    setAddingToCart(true);
    try {
      const guestId = getGuestId();
      const response = await fetch(`${api}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guest_id: guestId,
          image_id: generatedImageId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add to cart');
      }

      alert('✅ Image added to cart successfully!');
      setGeneratedImage(null);
      setGeneratedImageId(null);
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300 pt-20`}>
      <NavBar />
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
        {/* Back Button */}
        <div className="sm:text-center mt-2 sm:mt-2.5">
          <div
            className={`text-l ml-1 sm:ml-2.5 mt-2 sm:mt-2.5 rounded-3xl px-3 py-2 inline-flex items-center gap-2 hover:cursor-pointer transition-colors duration-300 ${theme.btnBack}`}
            onClick={() => navigate(-1)}
          >
            <span className="block sm:hidden"><ArrowLeftCircle size={24} /></span>
            <span className="hidden sm:inline">{'<-Back'}</span>
          </div>
        </div>
        {/* Show selected room and texture info */}
        <div className="mt-4 sm:mt-6 mb-4 sm:mb-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
          {roomIndex >= 0 && (roomImagesByType[objectType] || roomImagesByType['sofa'])[roomIndex] && (
            <img src={(roomImagesByType[objectType] || roomImagesByType['sofa'])[roomIndex].src} alt="Selected Room" className={`w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg ${theme.shadowCard}`} />
          )}
          {textureUrl && (
            <img src={textureUrl} alt="Selected Texture" className={`w-14 h-14 sm:w-16 sm:h-16 object-cover rounded ${theme.shadowCard}`} />
          )}
        </div>
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}
        {/* Card for generated image */}
        <GenerateImageCard generatedImage={generatedImage} loading={loading} />
        {/* Generate Image button */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-4 flex-wrap">
            <button
              className="bg-linear-to-r from-amber-500 to-amber-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl hover:scale-105 hover:from-amber-600 hover:to-amber-700 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base sm:text-lg font-semibold"
            onClick={handleGenerate}
            disabled={loading || isNaN(roomIndex) || !textureUrl}
          >
            {loading ? 'Generating...' : '✨ Generate Image'}
          </button>
          
          {generatedImage && generatedImageId && (
            <button
              className="bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl hover:scale-105 hover:from-green-600 hover:to-green-700 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base sm:text-lg font-semibold"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GenerateImage;
