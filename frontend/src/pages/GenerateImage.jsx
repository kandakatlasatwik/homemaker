import bedroom1 from "../assets/bedrooms/bedroom1.png";
import bedroom2 from "../assets/bedrooms/bedroom2.png";
import bedroom3 from "../assets/bedrooms/bedroom3.png";
import bedroom4 from "../assets/bedrooms/bedroom4.png";
import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import GenerateImageCard from '../components/ui/GenerateImageCard';
import Waves from '../components/ui/Waves';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { flippingCardSlides } from '../assets/flippingcard/flippingImages';

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
  const [textureUrl, setTextureUrl] = useState(params.get('texture'));
  const [textureSecondary, setTextureSecondary] = useState(params.get('texture_secondary') || null);
  const roomIndex = parseInt(params.get('room'), 10);
  const uploadedRoomImage = location.state?.uploadedRoomImage || null;

  const [curtainFabrics, setCurtainFabrics] = useState([]);
  const [fabricsLoading, setFabricsLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedImageId, setGeneratedImageId] = useState(null);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [viewsLoading, setViewsLoading] = useState(false);
  const [viewsImage, setViewsImage] = useState(null);
  const [viewsImageId, setViewsImageId] = useState(null);
  const [addingViewsToCart, setAddingViewsToCart] = useState(false);
  const [viewsFlipIndex, setViewsFlipIndex] = useState(0);
  const [viewsFlipAngle, setViewsFlipAngle] = useState(0);
  const viewsDirectionRef = useRef(1);
  const viewsSlideCount = flippingCardSlides.length;
  const supportsThreeViews = objectType === 'sofa' || objectType === 'bed';

  const api = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch curtain fabrics for inline texture switching
  useEffect(() => {
    if (objectType !== 'curtain') return;
    setFabricsLoading(true);
    fetch(`${api}/fabrics/?category=curtains`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch fabrics');
        return res.json();
      })
      .then(data => setCurtainFabrics(data))
      .catch(err => console.error(err))
      .finally(() => setFabricsLoading(false));
  }, [api, objectType]);

  useEffect(() => {
    if (!viewsLoading || viewsSlideCount === 0) return;

    const intervalId = setInterval(() => {
      setViewsFlipIndex((prev) => (prev + 2) % viewsSlideCount);
      setViewsFlipAngle((prev) => prev + (180 * viewsDirectionRef.current));
      viewsDirectionRef.current *= -1;
    }, 4000);

    return () => clearInterval(intervalId);
  }, [viewsLoading, viewsSlideCount]);

  useEffect(() => {
    if (supportsThreeViews) return;

    setViewsLoading(false);
    setViewsImage(null);
    setViewsImageId(null);
    setViewsFlipIndex(0);
    setViewsFlipAngle(0);
    setAddingViewsToCart(false);
  }, [supportsThreeViews]);

  const viewsFrontSlide = viewsSlideCount > 0 ? flippingCardSlides[viewsFlipIndex % viewsSlideCount] : null;
  const viewsBackSlide = viewsSlideCount > 0 ? flippingCardSlides[(viewsFlipIndex + 1) % viewsSlideCount] : null;

  const renderViewsSlide = (slide) => {
    if (!slide) return null;

    return (
      <div className={`w-full h-full rounded-xl p-5 bg-linear-to-br ${slide.style} text-white flex flex-col justify-between`}>
        <p className="text-base sm:text-lg leading-relaxed font-medium">"{slide.quote}"</p>
        <p className="text-xs sm:text-sm uppercase tracking-wider text-white/80">{slide.author}</p>
      </div>
    );
  };

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
      let roomImageBase64;
      if (uploadedRoomImage) {
        roomImageBase64 = await imageToBase64(uploadedRoomImage);
      } else {
        const imagesForType = roomImagesByType[objectType] || roomImagesByType['sofa'];
        const roomImage = imagesForType[roomIndex];
        roomImageBase64 = await imageToBase64(roomImage.src);
      }
      const guestId = getGuestId();
      
      const requestBody = {
        guest_id: guestId,
        object_type: objectType,
        texture: textureUrl,
        base_image_base64: roomImageBase64,
      };

      // Add secondary texture for curtains
      if (objectType === 'curtain' && textureSecondary) {
        requestBody.texture_secondary = textureSecondary;
      }

      const response = await fetch(`${api}/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate image');
      }
      const data = await response.json();
      setGeneratedImage(data.generated_image_base64);
      setGeneratedImageId(data.image_id);
      setViewsImage(null);
      setViewsImageId(null);
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

  const handleGenerateViews = async () => {
    if (!supportsThreeViews) {
      setError('Three views are available only for sofa and bed collections.');
      return;
    }

    if (!generatedImage) return;
    setViewsLoading(true);
    setError(null);
    setViewsImage(null);
    try {
      const response = await fetch(`${api}/generate/views`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: generatedImage,
          object_type: objectType,
          texture_url: textureUrl || '',
          texture_secondary: textureSecondary || '',
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate views');
      }
      const data = await response.json();
      setViewsImage(data.views_image_base64);
      setViewsImageId(data.image_id);
    } catch (err) {
      setError(err.message || 'Failed to generate views');
    } finally {
      setViewsLoading(false);
    }
  };

  const handleAddViewsToCart = async () => {
    if (!viewsImageId) return;
    setAddingViewsToCart(true);
    try {
      const guestId = getGuestId();
      const response = await fetch(`${api}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest_id: guestId, image_id: viewsImageId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add views to cart');
      }
      alert('\u2705 Orthographic views added to cart successfully!');
    } catch (err) {
      alert(`\u274C ${err.message}`);
    } finally {
      setAddingViewsToCart(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300 pt-20 relative overflow-hidden`}>
      <div className="absolute inset-0 pointer-events-none">
        <Waves
          lineColor={theme.isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.3)'}
          backgroundColor={theme.isDark ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.15)'}
          waveSpeedX={0.0125}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>
      <NavBar />
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 relative z-10">
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
        <div className="mt-4 sm:mt-6 mb-4 sm:mb-6 flex flex-row gap-4 sm:gap-6 items-center justify-center">
          {uploadedRoomImage ? (
            <img src={uploadedRoomImage} alt="Your Uploaded Room" className={`w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg ${theme.shadowCard}`} />
          ) : roomIndex >= 0 && (roomImagesByType[objectType] || roomImagesByType['sofa'])[roomIndex] && (
            <img src={(roomImagesByType[objectType] || roomImagesByType['sofa'])[roomIndex].src} alt="Selected Room" className={`w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg ${theme.shadowCard}`} />
          )}
          {textureUrl && (
            <img src={textureUrl} alt={objectType === 'curtain' ? 'Main Curtain Texture' : 'Selected Texture'} className={`w-14 h-14 sm:w-16 sm:h-16 object-cover rounded ${theme.shadowCard}`} />
          )}
          {objectType === 'curtain' && textureSecondary && (
            <img src={textureSecondary} alt="Sheer Curtain Texture" className={`w-14 h-14 sm:w-16 sm:h-16 object-cover rounded ${theme.shadowCard}`} />
          )}
        </div>
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}
        {/* Curtain texture sliders */}
        {objectType === 'curtain' && !fabricsLoading && curtainFabrics.length > 0 && (
          <div className="mb-6 sm:mb-8 space-y-5 max-w-2xl mx-auto">
            {/* Main Curtain Row */}
            <div className={`rounded-2xl p-4 sm:p-5 border ${theme.isDark ? 'bg-gray-900/80 border-amber-500/30' : 'bg-white border-gray-200'} shadow-lg backdrop-blur-sm transition-all duration-300`}>
              <h3 className={`text-sm sm:text-base font-bold mb-3 tracking-wide uppercase flex items-center gap-2 ${theme.isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                <span className="inline-block w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                Main Curtain
              </h3>
              <div
                className="texture-slider overflow-x-auto flex gap-3 sm:gap-4 pb-3 px-1 snap-x snap-mandatory justify-start"
                style={{
                  scrollbarWidth: 'thin',
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {curtainFabrics.map((t) => (
                  <div
                    key={`main-${t.id}`}
                    className={`snap-center shrink-0 w-[4.5rem] h-[4.5rem] sm:w-24 sm:h-24 rounded-xl overflow-hidden cursor-pointer border-[2.5px] transition-all duration-300 ease-in-out ${
                      textureUrl === t.image
                        ? 'border-amber-500 ring-[3px] ring-amber-400/60 shadow-[0_0_16px_rgba(245,158,11,0.45)] scale-105 z-10'
                        : `${theme.isDark ? 'border-gray-700 hover:border-amber-400/70' : 'border-gray-200 hover:border-amber-400'} hover:shadow-sm hover:scale-[1.03]`
                    }`}
                    onClick={() => setTextureUrl(t.image)}
                    title={t.name}
                  >
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sheer Curtain Row */}
            <div className={`rounded-2xl p-4 sm:p-5 border ${theme.isDark ? 'bg-gray-900/80 border-purple-500/30' : 'bg-white border-gray-200'} shadow-lg backdrop-blur-sm transition-all duration-300`}>
              <h3 className={`text-sm sm:text-base font-bold mb-3 tracking-wide uppercase flex items-center gap-2 ${theme.isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                <span className="inline-block w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
                Sheer Curtain
              </h3>
              <div
                className="texture-slider texture-slider-sheer overflow-x-auto flex gap-3 sm:gap-4 pb-3 px-1 snap-x snap-mandatory justify-start"
                style={{
                  scrollbarWidth: 'thin',
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {curtainFabrics.map((t) => (
                  <div
                    key={`sheer-${t.id}`}
                    className={`snap-center shrink-0 w-[4.5rem] h-[4.5rem] sm:w-24 sm:h-24 rounded-xl overflow-hidden cursor-pointer border-[2.5px] transition-all duration-300 ease-in-out ${
                      textureSecondary === t.image
                        ? 'border-purple-500 ring-[3px] ring-purple-400/60 shadow-[0_0_16px_rgba(168,85,247,0.45)] scale-105 z-10'
                        : `${theme.isDark ? 'border-gray-700 hover:border-purple-400/70' : 'border-gray-200 hover:border-purple-400'} hover:shadow-sm hover:scale-[1.03]`
                    }`}
                    onClick={() => setTextureSecondary(t.image)}
                    title={t.name}
                  >
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Card for generated image */}
        <GenerateImageCard generatedImage={generatedImage} loading={loading} />
        {/* Generate Image button */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-4 flex-wrap">
            <button
              className={`px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base sm:text-lg font-semibold border ${theme.isDark ? 'bg-white text-black border-white/20 hover:bg-gray-200' : 'bg-black text-white border-black/20 hover:bg-gray-800'}`}
            onClick={handleGenerate}
            disabled={loading || (!uploadedRoomImage && isNaN(roomIndex)) || !textureUrl}
          >
            {loading ? 'Generating...' : '✨ Generate Image'}
          </button>
          
          {generatedImage && generatedImageId && (
            <button
              className={`px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base sm:text-lg font-semibold border ${theme.isDark ? 'bg-white text-black border-white/20 hover:bg-gray-200' : 'bg-black text-white border-black/20 hover:bg-gray-800'}`}
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
            </button>
          )}

          {generatedImage && supportsThreeViews && (
            <button
              className={`px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base sm:text-lg font-semibold border ${theme.isDark ? 'bg-white text-black border-white/20 hover:bg-gray-200' : 'bg-black text-white border-black/20 hover:bg-gray-800'}`}
              onClick={handleGenerateViews}
              disabled={viewsLoading}
            >
              {viewsLoading ? 'Generating Views...' : '📐 Generate Three Views'}
            </button>
          )}
        </div>

        {/* Orthographic Views Section */}
        {supportsThreeViews && (viewsLoading || viewsImage) && (
          <div className="mt-6 sm:mt-8">
            <h3 className={`text-center text-lg sm:text-xl font-semibold mb-4 ${theme.text}`}>
              Orthographic Views
            </h3>
            <div className={`animate-float-up w-full max-w-[95vw] sm:max-w-3xl mx-auto ${theme.bgCard} rounded-2xl ${theme.shadowCard} p-2 sm:p-6 flex flex-col items-center justify-center overflow-hidden border ${theme.border} transition-colors duration-300`}>
              {viewsLoading ? (
                <div className="w-full h-64 sm:h-80 flex flex-col items-center justify-center">
                  <div className="flip-card-container" style={{ height: '100%' }}>
                    <div className="flip-card" style={{ transform: `rotateY(${viewsFlipAngle}deg)` }}>
                      <div className={`flip-card-face flip-card-front ${theme.isDark ? '' : 'light'}`}>
                        {renderViewsSlide(viewsFrontSlide)}
                      </div>
                      <div className={`flip-card-face flip-card-back ${theme.isDark ? '' : 'light'}`}>
                        {renderViewsSlide(viewsBackSlide)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <span className={`font-semibold text-base sm:text-lg ${theme.isDark ? 'text-white' : 'text-black'}`}>Generating Views</span>
                    <span className="flex gap-1">
                      <span className={`w-2 h-2 rounded-full animate-bounce ${theme.isDark ? 'bg-white' : 'bg-black'}`} style={{ animationDelay: '0ms' }} />
                      <span className={`w-2 h-2 rounded-full animate-bounce ${theme.isDark ? 'bg-white' : 'bg-black'}`} style={{ animationDelay: '150ms' }} />
                      <span className={`w-2 h-2 rounded-full animate-bounce ${theme.isDark ? 'bg-white' : 'bg-black'}`} style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                  <span className={`${theme.textMuted} text-xs sm:text-sm mt-2`}>AI is generating orthographic views...</span>
                </div>
              ) : viewsImage ? (
                <img
                  src={`data:image/png;base64,${viewsImage}`}
                  alt="Orthographic Views - Top, Front, Side"
                  className="w-full h-auto rounded-xl shadow-lg object-contain"
                />
              ) : null}
            </div>
            {viewsImage && viewsImageId && (
              <div className="mt-4 flex justify-center">
                <button
                  className={`px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base sm:text-lg font-semibold border ${theme.isDark ? 'bg-white text-black border-white/20 hover:bg-gray-200' : 'bg-black text-white border-black/20 hover:bg-gray-800'}`}
                  onClick={handleAddViewsToCart}
                  disabled={addingViewsToCart}
                >
                  {addingViewsToCart ? 'Adding...' : '\ud83d\uded2 Add Views to Cart'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default GenerateImage;
