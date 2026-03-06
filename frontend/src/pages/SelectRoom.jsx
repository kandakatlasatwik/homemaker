import bedroom1 from "../assets/bedrooms/bedroom1.png";
import bedroom2 from "../assets/bedrooms/bedroom2.png";
import bedroom3 from "../assets/bedrooms/bedroom3.png";
import bedroom4 from "../assets/bedrooms/bedroom4.png";
import React, { useState } from 'react'
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import TextureCard from "../components/ui/TextureCard";
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';

import sofaroom1 from "../assets/sofarooms/sofaroom1.png";
import sofaroom2 from "../assets/sofarooms/sofaroom2.png";
import sofaroom3 from "../assets/sofarooms/sofaroom3.png";
import sofaroom4 from "../assets/sofarooms/sofaroom4.png";

const roomImagesByType = {
  sofa: [
    { src: sofaroom1, name: 'Living Room 1', description: 'Cozy living room with neutral tones.' },
    { src: sofaroom2, name: 'Living Room 2', description: 'Modern setup with statement sofa.' },
    { src: sofaroom3, name: 'Living Room 3', description: 'Spacious room with natural light.' },
    { src: sofaroom4, name: 'Living Room 4', description: 'Classic arrangement with warm accents.' },
  ],
  bed: [
    { src: bedroom1, name: 'Bedroom 1', description: 'Cozy bedroom with warm lighting.' },
    { src: bedroom2, name: 'Bedroom 2', description: 'Modern bedroom with clean lines.' },
    { src: bedroom3, name: 'Bedroom 3', description: 'Spacious bedroom with natural light.' },
    { src: bedroom4, name: 'Bedroom 4', description: 'Classic bedroom with elegant decor.' },
  ],
  curtain: [
    { src: sofaroom1, name: 'Room 1', description: 'Bright room with large windows.' },
    { src: sofaroom2, name: 'Room 2', description: 'Elegant room with tall windows.' },
    { src: sofaroom3, name: 'Room 3', description: 'Minimalist room with natural light.' },
    { src: sofaroom4, name: 'Room 4', description: 'Classic room with warm tones.' },
  ],
  cushion: [
    { src: sofaroom1, name: 'Lounge 1', description: 'Cozy lounge with plush seating.' },
    { src: sofaroom2, name: 'Lounge 2', description: 'Modern lounge with accent pillows.' },
    { src: sofaroom3, name: 'Lounge 3', description: 'Spacious lounge with natural vibes.' },
    { src: sofaroom4, name: 'Lounge 4', description: 'Classic lounge with warm accents.' },
  ],
  rugs: [
    { src: sofaroom1, name: 'Floor Space 1', description: 'Open floor with neutral tones.' },
    { src: sofaroom2, name: 'Floor Space 2', description: 'Modern space with clean design.' },
    { src: sofaroom3, name: 'Floor Space 3', description: 'Spacious area with natural light.' },
    { src: sofaroom4, name: 'Floor Space 4', description: 'Classic space with warm accents.' },
  ],
  upholstery: [
    { src: sofaroom1, name: 'Room 1', description: 'Cozy space with comfortable seating.' },
    { src: sofaroom2, name: 'Room 2', description: 'Modern furniture arrangement.' },
    { src: sofaroom3, name: 'Room 3', description: 'Spacious room with natural light.' },
    { src: sofaroom4, name: 'Room 4', description: 'Classic room with warm accents.' },
  ],
};

const typeLabels = {
  sofa: 'Sofa',
  bed: 'Bed',
  curtain: 'Curtain',
  cushion: 'Cushion',
  rugs: 'Rug',
  upholstery: 'Upholstery',
};

const SelectRoom = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  // Get params from URL
  const objectType = params.get('type') || 'sofa';
  const textureUrl = params.get('texture');

  const roomImages = roomImagesByType[objectType] || roomImagesByType['sofa'];
  const typeLabel = typeLabels[objectType] || objectType;

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
              <p className="text-sm text-gray-700">Type: {typeLabel}</p>
            </div>
          </div>
        )}

        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Select a Room</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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

export default SelectRoom
