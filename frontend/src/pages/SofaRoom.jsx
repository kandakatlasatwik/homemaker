import React, { useState } from 'react'
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import TextureCard from "../components/ui/TextureCard";
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import sofaroom1 from "../assets/rooms/sofaroom1.png";
import sofaroom2 from "../assets/rooms/sofaroom2.png";
import sofaroom3 from "../assets/rooms/sofaroom3.png";
import sofaroom4 from "../assets/rooms/sofaroom4.png";

// Utility to convert image URL to base64
const imageToBase64 = async (imageUrl) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]); // Remove data:image/...;base64, prefix
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const SofaRoom = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  // Get params from URL
  const objectType = params.get('type') || 'sofa';
  const textureUrl = params.get('texture');

  const roomImages = [
    { src: sofaroom1, name: 'Sofa Room ', description: 'Cozy living room with neutral tones.' },
    { src: sofaroom2, name: 'Sofa Room ', description: 'Modern setup with statement sofa.' },
    { src: sofaroom3, name: 'Sofa Room ', description: 'Spacious room with natural light.' },
    { src: sofaroom4, name: 'Sofa Room ', description: 'Classic arrangement with warm accents.' },
  ];

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  
  const api = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleSelect = (idx) => {
    setSelectedIndex(prev => (prev === idx ? null : idx));
    setGeneratedImage(null);
    setError(null);
  }

  const handleGenerate = async () => {
    if (selectedIndex === null || !textureUrl) return;

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Convert the selected room image to base64
      const roomImageBase64 = await imageToBase64(roomImages[selectedIndex].src);

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
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        {/* Display selected texture info */}
        {textureUrl && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg flex items-center gap-4">
            <img src={textureUrl} alt="Selected texture" className="w-16 h-16 object-cover rounded" />
            <div>
              <p className="text-sm text-gray-500">Selected Texture</p>
              <p className="text-sm text-gray-700">Type: {objectType}</p>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Select a Room</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roomImages.map((img, idx) => (
            <div key={idx} className={`${selectedIndex === idx ? 'ring-4 ring-amber-400 rounded-2xl' : ''}`}>
              <TextureCard
                image={img.src}
                name={img.name}
                description={img.description}
                onClick={() => handleSelect(idx)}
              />
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Generated image result */}
        {generatedImage && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Generated Image</h3>
            <img 
              src={`data:image/png;base64,${generatedImage}`} 
              alt="Generated" 
              className="max-w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {selectedIndex !== null && (
          <button
            className="fixed bottom-4 left-4 right-4 z-50 pointer-events-auto bg-amber-600 text-white px-6 py-3 rounded-2xl shadow-2xl hover:scale-105 transform transition-transform duration-200 sm:bottom-6 sm:right-6 sm:left-auto sm:w-auto sm:rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={handleGenerate}
            disabled={loading || !textureUrl}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </button>
        )}
      </div>
      <Footer />
    </>
  )
}

export default SofaRoom
