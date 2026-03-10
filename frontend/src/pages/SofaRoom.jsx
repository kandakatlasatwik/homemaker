import React, { useState } from 'react'
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import TextureCard from "../components/ui/TextureCard";
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';

import sofaroom1 from "../assets/rooms/sofarooms/sofaroom1.png";
import sofaroom2 from "../assets/rooms/sofarooms/sofaroom2.png";
import sofaroom3 from "../assets/rooms/sofarooms/sofaroom3.png";
import sofaroom4 from "../assets/rooms/sofarooms/sofaroom4.png";

// ...existing code...

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
  const navigate = useNavigate();
  const handleSelect = (idx) => {
    setSelectedIndex(prev => (prev === idx ? null : idx));
  }
  const handleNext = () => {
    if (selectedIndex === null) return;
    navigate(`/generate-image?type=${objectType}&texture=${encodeURIComponent(textureUrl)}&room=${selectedIndex}`);
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
        {/* Back Button */}
        <div className="sm:text-center mt-2 sm:mt-2.5">
          <div
            className="text-l ml-1 sm:ml-2.5 mt-2 sm:mt-2.5 bg-black rounded-3xl px-3 py-2 text-white inline-flex items-center gap-2 hover:cursor-pointer hover:bg-gray-800 transition-colors"
            onClick={() => navigate(-1)}
          >
            <span className="block sm:hidden"><ArrowLeftCircle size={24} /></span>
            <span className="hidden sm:inline">{'<-Back'}</span>
          </div>
        </div>
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

        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Select a Room</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {roomImages.map((img, idx) => (
            <div key={idx} className={`animate-float-up ${selectedIndex === idx ? 'ring-4 ring-amber-400 rounded-2xl' : ''}`} style={{ animationDelay: `${idx * 100}ms` }}>
              <TextureCard
                image={img.src}
                name={img.name}
                description={img.description}
                onClick={() => handleSelect(idx)}
              />
            </div>
          ))}
        </div>

        {/* Next button to go to GenerateImage page */}
        {selectedIndex !== null && (
          <button
            className="fixed bottom-4 left-4 right-4 z-50 pointer-events-auto bg-linear-to-r from-amber-500 to-amber-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl hover:scale-105 hover:from-amber-600 hover:to-amber-700 transform transition-all duration-300 sm:bottom-6 sm:right-6 sm:left-auto sm:w-auto sm:rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg font-semibold"
            onClick={handleNext}
            disabled={!textureUrl}
          >
            Next →
          </button>
        )}
      </div>
      <Footer />
    </>
  )
}

export default SofaRoom
