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
    { src: curtain1, name: 'Curtain Room 1', description: 'Bright room with large windows.' },
    { src: curtain2, name: 'Curtain Room 2', description: 'Elegant room with tall windows.' },
    { src: curtain3, name: 'Curtain Room 3', description: 'Minimalist room with natural light.' },
    { src: curtain4, name: 'Curtain Room 4', description: 'Classic room with warm tones.' },
  ],
  cushion: [
    { src: cushion1, name: 'Cushion Room 1', description: 'Cozy lounge with plush seating.' },
    { src: cushion2, name: 'Cushion Room 2', description: 'Modern lounge with accent pillows.' },
    { src: cushion3, name: 'Cushion Room 3', description: 'Spacious lounge with natural vibes.' },
    { src: cushion4, name: 'Cushion Room 4', description: 'Classic lounge with warm accents.' },
  ],
  rugs: [
    { src: rug1, name: 'Rug Room 1', description: 'Open floor with neutral tones.' },
    { src: rug2, name: 'Rug Room 2', description: 'Modern space with clean design.' },
    { src: rug3, name: 'Rug Room 3', description: 'Spacious area with natural light.' },
    { src: rug4, name: 'Rug Room 4', description: 'Classic space with warm accents.' },
  ],
  upholstery: [
    { src: upholstery1, name: 'Upholstery Room 1', description: 'Cozy space with comfortable seating.' },
    { src: upholstery2, name: 'Upholstery Room 2', description: 'Modern furniture arrangement.' },
    { src: upholstery3, name: 'Upholstery Room 3', description: 'Spacious room with natural light.' },
    { src: upholstery4, name: 'Upholstery Room 4', description: 'Classic room with warm accents.' },
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
  const theme = useTheme();
  
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
        {/* Display selected texture info */}
        {textureUrl && (
          <div className={`mb-6 p-4 ${theme.bgSecondary} rounded-lg flex items-center gap-4 border ${theme.border} transition-colors duration-300`}>
            <img src={textureUrl} alt="Selected texture" className="w-16 h-16 object-cover rounded" />
            <div>
              <p className={`text-sm ${theme.textMuted}`}>Selected Texture</p>
              <p className={`text-sm ${theme.textSecondary}`}>Type: {typeLabel}</p>
            </div>
          </div>
        )}

        <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${theme.text} transition-colors duration-300`}>Select a Room</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {roomImages.map((img, idx) => (
            <div key={idx} className={`${selectedIndex === idx ? `ring-4 ${theme.ring} rounded-2xl` : ''}`}>
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
    </div>
  )
}

export default SelectRoom
