import React, { useState } from 'react'
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import TextureCard from "../components/ui/TextureCard";
import { useNavigate } from 'react-router-dom';

import sofaroom1 from "../assets/rooms/sofaroom1.png";
import sofaroom2 from "../assets/rooms/sofaroom2.png";
import sofaroom3 from "../assets/rooms/sofaroom3.png";
import sofaroom4 from "../assets/rooms/sofaroom4.png";

const SofaRoom = () => {
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

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8 px-4">
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

        {selectedIndex !== null && (
          <button
            className="fixed bottom-4 left-4 right-4 z-50 pointer-events-auto bg-amber-600 text-white px-6 py-3 rounded-2xl shadow-2xl hover:scale-105 transform transition-transform duration-200 sm:bottom-6 sm:right-6 sm:left-auto sm:w-auto sm:rounded-full"
            onClick={() => {/* placeholder for generate action */}}
          >
            generate image
          </button>
        )}
      </div>
      <Footer />
    </>
  )
}

export default SofaRoom
