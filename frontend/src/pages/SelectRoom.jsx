import bedroom1 from "../assets/bedrooms/bedroom1.png";
import bedroom2 from "../assets/bedrooms/bedroom2.png";
import bedroom3 from "../assets/bedrooms/bedroom3.png";
import bedroom4 from "../assets/bedrooms/bedroom4.png";
import React, { useState, useRef } from 'react'
import { Metronome } from 'ldrs/react'
import 'ldrs/react/Metronome.css'
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import TextureCard from "../components/ui/TextureCard";
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftCircle, Upload, Camera, Trash2 } from 'lucide-react';
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
  const textureSecondary = params.get('texture_secondary') || null;

  const roomImages = roomImagesByType[objectType] || roomImagesByType['sofa'];
  const typeLabel = typeLabels[objectType] || objectType;

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loadingIdx, setLoadingIdx] = useState(null);
  const [uploading, setUploading] = useState(false);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSelect = (idx) => {
    if (selectedIndex === idx) {
      setSelectedIndex(null);
      return;
    }
    setLoadingIdx(idx);
    setTimeout(() => {
      setSelectedIndex(idx);
      setLoadingIdx(null);
    }, 800);
  }

  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    setUploading(true);
    const newImages = files.map((file) => ({
      src: URL.createObjectURL(file),
      name: file.name.replace(/\.[^/.]+$/, ''),
      description: 'Your uploaded room image',
      isUploaded: true,
    }));
    setTimeout(() => {
      setUploadedImages((prev) => [...prev, ...newImages]);
      setUploading(false);
    }, 800);
    event.target.value = '';
  };

  const handleDeleteUploaded = (uploadIdx) => {
    setUploadedImages((prev) => {
      const updated = prev.filter((_, i) => i !== uploadIdx);
      // If the selected index was an uploaded image, deselect
      const deletedGlobalIdx = roomImages.length + uploadIdx;
      if (selectedIndex === deletedGlobalIdx) setSelectedIndex(null);
      else if (selectedIndex > deletedGlobalIdx) setSelectedIndex(selectedIndex - 1);
      return updated;
    });
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    const secondaryParam = textureSecondary ? `&texture_secondary=${encodeURIComponent(textureSecondary)}` : '';
    // Check if the selected image is an uploaded one
    if (selectedIndex >= roomImages.length) {
      const uploadedIdx = selectedIndex - roomImages.length;
      const uploadedImg = uploadedImages[uploadedIdx];
      navigate(`/generate-image?type=${objectType}&texture=${encodeURIComponent(textureUrl)}&room=-1${secondaryParam}`, {
        state: { uploadedRoomImage: uploadedImg.src },
      });
    } else {
      navigate(`/generate-image?type=${objectType}&texture=${encodeURIComponent(textureUrl)}&room=${selectedIndex}${secondaryParam}`);
    }
  }

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300 pt-20`}>
      <NavBar />
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
        {/* Back Button */}
        <div className="sm:text-center mt-2 sm:mt-2.5 mb-6">
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
              <p className={`text-sm ${theme.textMuted}`}>{objectType === 'curtain' ? 'Main Curtain Texture' : 'Selected Texture'}</p>
              <p className={`text-sm ${theme.textSecondary}`}>Type: {typeLabel}</p>
            </div>
            {objectType === 'curtain' && textureSecondary && (
              <>
                <img src={textureSecondary} alt="Sheer curtain texture" className="w-16 h-16 object-cover rounded ml-4" />
                <div>
                  <p className={`text-sm ${theme.textMuted}`}>Sheer Curtain Texture</p>
                  <p className={`text-sm ${theme.textSecondary}`}>Center panel</p>
                </div>
              </>
            )}
          </div>
        )}

        <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${theme.text} transition-colors duration-300`}>Select a Room</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Sample room images */}
          {roomImages.map((img, idx) => (
            <div key={`sample-${idx}`} className={`animate-float-up relative ${selectedIndex === idx ? `ring-4 ${theme.ring} rounded-2xl` : ''}`} style={{ animationDelay: `${idx * 100}ms` }}>
              {loadingIdx === idx && (
                <div className="absolute inset-0 flex items-center justify-center z-20 rounded-2xl backdrop-blur-sm" style={{ backgroundColor: theme.isDark ? 'rgba(26,26,46,0.7)' : 'rgba(243,244,246,0.7)' }}>
                  <Metronome size="40" speed="1.6" color={theme.isDark ? '#f59e0b' : '#000'} />
                </div>
              )}
              <TextureCard
                image={img.src}
                name={img.name}
                description={img.description}
                onClick={() => handleSelect(idx)}
              />
            </div>
          ))}

          {/* Uploaded room images */}
          {uploadedImages.map((img, idx) => {
            const globalIdx = roomImages.length + idx;
            return (
              <div key={`uploaded-${idx}`} className={`animate-float-up relative ${selectedIndex === globalIdx ? `ring-4 ${theme.ring} rounded-2xl` : ''}`} style={{ animationDelay: `${globalIdx * 100}ms` }}>
                {loadingIdx === globalIdx && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 rounded-2xl backdrop-blur-sm" style={{ backgroundColor: theme.isDark ? 'rgba(26,26,46,0.7)' : 'rgba(243,244,246,0.7)' }}>
                    <Metronome size="40" speed="1.6" color={theme.isDark ? '#f59e0b' : '#000'} />
                  </div>
                )}
                <TextureCard
                  image={img.src}
                  name={img.name}
                  description={img.description}
                  onClick={() => handleSelect(globalIdx)}
                />
                {selectedIndex === globalIdx && (
                  <button
                    className="absolute top-2 right-2 z-30 bg-white/90 text-red-600 p-2 rounded-full shadow-md hover:bg-white hover:scale-105 transition-transform duration-200"
                    onClick={(e) => { e.stopPropagation(); handleDeleteUploaded(idx); }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            );
          })}

          {/* Upload card */}
          <div className={`animate-float-up relative flex flex-col items-center justify-center rounded-2xl sm:rounded-4xl aspect-[4/3] w-full h-full border-2 border-dashed ${theme.isDark ? 'border-amber-500/40 bg-amber-950/20' : 'border-gray-300 bg-gray-50'} gap-3 cursor-pointer transition-colors duration-300`} style={{ animationDelay: `${(roomImages.length + uploadedImages.length) * 100}ms` }}>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center z-20 rounded-2xl backdrop-blur-sm" style={{ backgroundColor: theme.isDark ? 'rgba(26,26,46,0.7)' : 'rgba(243,244,246,0.7)' }}>
                <Metronome size="40" speed="1.6" color={theme.isDark ? '#f59e0b' : '#000'} />
              </div>
            )}
            <p className={`text-sm font-semibold ${theme.isDark ? 'text-amber-200' : 'text-gray-600'}`}>Upload Your Room</p>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={16} /> Gallery
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                onClick={() => cameraInputRef.current?.click()}
                disabled={uploading}
              >
                <Camera size={16} /> Camera
              </button>
            </div>
            <p className={`text-xs ${theme.isDark ? 'text-amber-300/60' : 'text-gray-400'}`}>Multiple images supported</p>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              hidden
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleUpload}
              hidden
            />
          </div>
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
