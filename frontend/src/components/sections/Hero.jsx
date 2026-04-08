import React, { useState, useEffect, useReducer, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import ProductCard from "../ui/ProductCard";
import TextureCard from "../ui/TextureCard";
import { Search, Loader2 } from "lucide-react";
import { searchTextures } from "../../utils/searchUtils";
import { useTheme } from '../../context/ThemeContext';
import bedImage from "../../assets/images/bed.png";
import curtainImage from "../../assets/images/curtains.png";
import cushionImage from "../../assets/images/cushions.png";
import rugsImage from "../../assets/images/rugs.png";
import upholsteryImage from "../../assets/images/upholstery.png";

function fabricReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { loading: false, error: null, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const Hero = ({ type, productType }) => {
  // Map frontend product types to DB category names
  const typeToCategoryMap = {
    bed: 'bedsheets',
    curtain: 'curtains',
    cushion: 'cushions',
  };
  const dbCategory = typeToCategoryMap[productType] || productType;

  const [search, setSearch] = useState("");
  const [state, dispatch] = useReducer(fabricReducer, {
    data: [],
    loading: type === 'texture' && !!productType,
    error: null,
  });

  const api = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchFabrics = useCallback((category) => {
    dispatch({ type: 'FETCH_START' });
    fetch(`${api}/fabrics/?category=${encodeURIComponent(category)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch fabrics');
        return res.json();
      })
      .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch(err => {
        console.error(err);
        dispatch({ type: 'FETCH_ERROR', payload: err.message });
      });
  }, [api]);

  useEffect(() => {
    if (type === 'texture' && productType) {
      fetchFabrics(dbCategory);
    }
  }, [type, productType, dbCategory, fetchFabrics]);

  const navigate = useNavigate();
  const theme = useTheme();
  const { data: fabrics, loading, error } = state;
  const filteredTextures = type === 'texture' ? searchTextures(fabrics, search) : [];
  return (
    <section className={`w-full ${theme.bg} transition-colors duration-300 relative overflow-hidden`}>
      {type !== 'texture' && (
        <>
          <div
            className={`hero-blob hero-blob-left ${theme.isDark ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}
            aria-hidden="true"
          />
          <div
            className={`hero-blob hero-blob-right ${theme.isDark ? 'bg-orange-400/20' : 'bg-cyan-400/20'}`}
            aria-hidden="true"
          />
        </>
      )}
      <div className="container mx-auto px-4 grid grid-cols-1 gap-8 items-center min-h-[350px]">
        <div className="flex flex-col justify-center space-y-4">
          {type !== 'texture' && (
            <>
              <h1
                className={`hero-title text-4xl md:text-5xl font-bold text-center mt-8 transition-colors duration-200 ${
                  theme.isDark ? 'text-white' : 'text-[#041ee7]'
                }`}
              >
                Welcome to Homemakers
              </h1>
              <p
                className={`hero-subtitle text-lg text-center transition-colors duration-300 ${
                  theme.isDark ? 'text-white' : 'text-[#041ee7]'
                }`}
              >
                CREATE YOUR OWN COLOUR for your curtains, Blinds, Sofa , Bedsheets & cushions for Home | Hotels | Hospitals.
              </p>
            </>
          )}
          {type === 'texture' && (
            <div className="flex justify-center mt-4">
              <div className={`flex items-center w-full max-w-md border ${theme.border} rounded-lg px-3 py-2 ${theme.bgInput} transition-all duration-300 focus-within:border-amber-400 ${theme.borderHover} ${theme.shadow}`}>
                <Search className={`${theme.textMuted} mr-2`} size={20} />
                <input
                  type="text"
                  placeholder="Search textures..."
                  className={`w-full outline-none bg-transparent ${theme.text} placeholder-gray-400`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="hero-cards grid grid-cols-1 gap-5 sm:grid sm:grid-cols-3 mt-4">
            {type === 'texture' ? (
              loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="animate-spin text-amber-500" size={36} />
                </div>
              ) : error ? (
                <div className="col-span-full text-center text-red-400 py-8">{error}</div>
              ) : filteredTextures.length > 0 ? (
                filteredTextures.map((t, index) => (
                  <TextureCard
                    key={t.id}
                    name={t.name}
                    description={t.color}
                    image={t.image}
                    animationDelay={index * 100}
                    onClick={() => {
                      if (productType === 'curtain') {
                        // Curtain: first texture is main curtain, navigate to sheer texture selection
                        navigate(`/select-sheer-texture?type=curtain&texture=${encodeURIComponent(t.image)}`);
                      } else {
                        navigate(`/select-room?type=${encodeURIComponent(productType)}&texture=${encodeURIComponent(t.image)}`);
                      }
                    }}
                  />
                ))
              ) : (
                <div className={`col-span-full text-center ${theme.textMuted} py-8`}>No textures found.</div>
              )
            ) : (
              <>
                <ProductCard type="sofa" animationDelay={0} />
                <ProductCard type="bed" image={bedImage} animationDelay={100} />
                <ProductCard type="curtain" image={curtainImage} animationDelay={200} />
                <ProductCard type="cushion" image={cushionImage} animationDelay={300} />
                <ProductCard type="rugs" image={rugsImage} animationDelay={400} />
                <ProductCard type="upholstery" image={upholsteryImage} animationDelay={500} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
