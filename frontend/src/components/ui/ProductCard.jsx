import React from "react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import sofa1 from "../../assets/images/Sofa.png";

const ProductCard = ({ onClick, type, image }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const handleClick = (e) => {
    if (onClick) return onClick(e);
    if (type) return navigate(`/select-texture?product=${encodeURIComponent(type)}`);
  };

  const imgSrc = image || sofa1;
  const label =
  type === 'sofa'
    ? 'SOFA COLLECTIONS'
    : type === 'bed'
    ? 'BED COLLECTIONS'
    : type === 'curtain'
    ? 'CURTAIN COLLECTIONS'
    : type === 'cushion'
    ? 'CUSHION COLLECTIONS'
    : type === 'rugs'
    ? 'RUG COLLECTIONS'
    : type === 'upholstery'
    ? 'UPHOLSTERY COLLECTIONS'
    : 'PRODUCT COLLECTIONS';

  return (
    <div
      className={`relative flex group hover:cursor-pointer transform transition-all duration-300 hover:scale-102 rounded-2xl sm:rounded-4xl aspect-[4/3] w-full h-full overflow-hidden border ${theme.isDark ? 'border-amber-500/20 hover:border-amber-400/60' : 'border-gray-200 hover:border-gray-400'} ${theme.shadowCard}`}
      onClick={handleClick}>
      <img
        src={imgSrc}
        alt={label}
        className="w-full h-full object-cover block"
      />
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${theme.isDark ? 'bg-black/70 text-amber-100' : 'bg-white/80 text-gray-900'} px-8 py-4 rounded-lg text-2xl font-semibold tracking-wider text-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
        {label}
      </div>
    </div>
  );
};

export default ProductCard;
