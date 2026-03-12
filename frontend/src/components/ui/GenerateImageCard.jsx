import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../context/ThemeContext';
import { flippingCardSlides } from '../../assets/flippingcard/flippingImages';

const GenerateImageCard = ({ generatedImage, loading }) => {
  const theme = useTheme();
  const [flipIndex, setFlipIndex] = useState(0);
  const [flipAngle, setFlipAngle] = useState(0);
  const directionRef = useRef(1);
  const slideCount = flippingCardSlides.length;

  useEffect(() => {
    if (!loading || slideCount === 0) return;

    const intervalId = setInterval(() => {
      setFlipIndex((prev) => (prev + 2) % slideCount);
      setFlipAngle((prev) => prev + (180 * directionRef.current));
      directionRef.current *= -1;
    }, 4000);

    return () => clearInterval(intervalId);
  }, [loading, slideCount]);

  const frontSlide = slideCount > 0 ? flippingCardSlides[flipIndex % slideCount] : null;
  const backSlide = slideCount > 0 ? flippingCardSlides[(flipIndex + 1) % slideCount] : null;

  const renderSlide = (slide) => {
    if (!slide) return null;

    return (
      <div className={`w-full h-full rounded-xl p-5 bg-linear-to-br ${slide.style} text-white flex flex-col justify-between`}>
        <p className="text-base sm:text-lg leading-relaxed font-medium">"{slide.quote}"</p>
        <p className="text-xs sm:text-sm uppercase tracking-wider text-white/80">{slide.author}</p>
      </div>
    );
  };

  return (
    <div className={`animate-float-up w-full max-w-lg mx-auto ${theme.bgCard} rounded-2xl ${theme.shadowCard} p-4 sm:p-6 min-h-64 sm:min-h-80 flex flex-col items-center justify-center overflow-hidden border ${theme.border} transition-colors duration-300`}>
      {loading ? (
        <div className="w-full h-64 sm:h-80 flex flex-col items-center justify-center">
          <div className="flip-card-container" style={{ height: '100%' }}>
            <div className="flip-card" style={{ transform: `rotateY(${flipAngle}deg)` }}>
              <div className={`flip-card-face flip-card-front ${theme.isDark ? '' : 'light'}`}>
                {renderSlide(frontSlide)}
              </div>
              <div className={`flip-card-face flip-card-back ${theme.isDark ? '' : 'light'}`}>
                {renderSlide(backSlide)}
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <span className={`font-semibold text-base sm:text-lg ${theme.isDark ? 'text-white' : 'text-black'}`}>Generating</span>
            <span className="flex gap-1">
              <span className={`w-2 h-2 rounded-full animate-bounce ${theme.isDark ? 'bg-white' : 'bg-black'}`} style={{ animationDelay: '0ms' }} />
              <span className={`w-2 h-2 rounded-full animate-bounce ${theme.isDark ? 'bg-white' : 'bg-black'}`} style={{ animationDelay: '150ms' }} />
              <span className={`w-2 h-2 rounded-full animate-bounce ${theme.isDark ? 'bg-white' : 'bg-black'}`} style={{ animationDelay: '300ms' }} />
            </span>
          </div>
          <span className={`${theme.textMuted} text-xs sm:text-sm mt-2`}>AI is crafting your image...</span>
        </div>
      ) : generatedImage ? (
        <img
          src={`data:image/png;base64,${generatedImage}`}
          alt="Generated"
          className="max-w-full max-h-64 sm:max-h-80 rounded-xl shadow-lg object-contain"
        />
      ) : (
        <div className={`${theme.textMuted} text-center text-sm sm:text-base`}>No image generated yet.</div>
      )}
    </div>
  );
}

export default GenerateImageCard
