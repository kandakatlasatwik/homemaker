import React from 'react'
import { useTheme } from '../../context/ThemeContext';
import texture from "../../assets/images/texture1.png";


const TextureCard = ({ image = texture, name = "Texture Name", description = "Texture description here.", onClick, onImageLoad, animationDelay = 0 }) => {
  const theme = useTheme();
  return (
    <div
      className={`hm-card product-card animate-float-up relative flex group hover:cursor-pointer transform transition-all duration-500 rounded-2xl sm:rounded-4xl aspect-[4/3] w-full h-full overflow-hidden border ${theme.isDark ? 'border-amber-500/20 hover:border-amber-400/60' : 'border-gray-200 hover:border-gray-400'} ${theme.shadowCard}`}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={onClick}
    >
      <img
        src={image}
        alt={name}
        className="hm-card-image product-card-image w-full h-full object-cover block"
        onLoad={onImageLoad}
      />
      <span className="hm-card-overlay product-card-overlay" aria-hidden="true" />
      <span className="card-shine" aria-hidden="true" />
      <div className={`absolute bottom-0 left-0 w-full ${theme.isDark ? 'bg-black/70 text-amber-50 border-t border-amber-300/20' : 'bg-white/85 text-gray-900 border-t border-blue-400/20'} p-3 rounded-lg text-lg font-semibold tracking-wider text-center z-10 opacity-100 transition-opacity duration-300`}>
        {name}
        <div className={`text-xs mt-1 ${theme.isDark ? 'opacity-80' : 'opacity-60'}`}>{description}</div>
      </div>
    </div>
  );
}

export default TextureCard
