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
    { src: sofaroom1 },
    { src: sofaroom2 },
    { src: sofaroom3 },
    { src: sofaroom4 },
  ],
  cushion: [
    { src: sofaroom1 },
    { src: sofaroom2 },
    { src: sofaroom3 },
    { src: sofaroom4 },
  ],
  rugs: [
    { src: sofaroom1 },
    { src: sofaroom2 },
    { src: sofaroom3 },
    { src: sofaroom4 },
  ],
  upholstery: [
    { src: sofaroom1 },
    { src: sofaroom2 },
    { src: sofaroom3 },
    { src: sofaroom4 },
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
  const [error, setError] = useState(null);

  const api = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleGenerate = async () => {
    if (isNaN(roomIndex) || !textureUrl) return;
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imagesForType = roomImagesByType[objectType] || roomImagesByType['sofa'];
      const roomImage = imagesForType[roomIndex];
      const roomImageBase64 = await imageToBase64(roomImage.src);
      const response = await fetch(`${api}/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
    } catch (err) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
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
        <div className="mt-4 sm:mt-6 flex justify-center">
            <button
              className="bg-linear-to-r from-amber-500 to-amber-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl hover:scale-105 hover:from-amber-600 hover:to-amber-700 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base sm:text-lg font-semibold"
            onClick={handleGenerate}
            disabled={loading || isNaN(roomIndex) || !textureUrl}
          >
            {loading ? 'Generating...' : '✨ Generate Image'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GenerateImage;
