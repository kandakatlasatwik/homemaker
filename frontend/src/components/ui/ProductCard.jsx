import React from "react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import sofa1 from "../../assets/images/Sofa.png";
import StarBorder from "./StarBorder";

const ProductCard = ({ onClick, type, image, animationDelay = 0 }) => {
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
    <StarBorder
      as="button"
      type="button"
      color={theme.isDark ? '#ca7a02' : '#2302ca'}
      secondaryColor={theme.isDark ? '#ca7a02' : '#2302ca'}
      speed="5s"
      className={`product-card animate-float-up relative flex group hover:cursor-pointer transform transition-all duration-500 rounded-2xl sm:rounded-4xl aspect-[4/3] w-full h-full overflow-hidden ${theme.shadowCard}`}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={handleClick}
    >
      <img
        src={imgSrc}
        alt={label}
        className="product-card-image w-full h-full object-cover block"
      />
      <span className="product-card-overlay" aria-hidden="true" />
      <span className="card-shine" aria-hidden="true" />
      <div className={`product-card-label absolute top-4 left-4 ${theme.isDark ? 'bg-black/75 text-amber-100 border border-amber-300/30' : 'bg-white/85 text-gray-900 border border-blue-400/20'} px-5 py-3 rounded-lg text-lg sm:text-xl font-semibold tracking-wide text-left z-10 opacity-0 group-hover:opacity-100 transition-all duration-500`}>
        {label}
      </div>
    </StarBorder>
  );
};

export default ProductCard;
