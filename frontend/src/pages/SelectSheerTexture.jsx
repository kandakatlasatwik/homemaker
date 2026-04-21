import React, { useState, useEffect, useReducer, useCallback } from 'react';
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import TextureCard from "../components/ui/TextureCard";
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftCircle, Search, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { searchTextures } from "../utils/searchUtils";

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

const SelectSheerTexture = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const mainTexture = params.get('texture');
  const theme = useTheme();

  const [search, setSearch] = useState("");
  const [state, dispatch] = useReducer(fabricReducer, {
    data: [],
    loading: true,
    error: null,
  });

  const api = import.meta.env.VITE_API_URL || 'https://homemakerbackend.onrender.com';

  const fetchFabrics = useCallback(() => {
    dispatch({ type: 'FETCH_START' });
    fetch(`${api}/fabrics/?category=curtains`)
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
    fetchFabrics();
  }, [fetchFabrics]);

  const { data: fabrics, loading, error } = state;
  const filteredTextures = searchTextures(fabrics, search);

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300 pt-20`}>
      <NavBar />
      <div className="container mx-auto px-4 py-4">
        {/* Back Button */}
        <div className="sm:text-center mt-2.5">
          <div
            className={`text-l ml-2.5 mt-2.5 rounded-3xl px-3 py-2 inline-flex items-center gap-2 hover:cursor-pointer transition-colors duration-300 ${theme.btnBack}`}
            onClick={() => navigate(-1)}
          >
            <span className="block sm:hidden"><ArrowLeftCircle size={24} /></span>
            <span className="hidden sm:inline">{'<-Back'}</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mt-4">
          <div className={`text-center p-3 rounded-lg ${theme.isDark ? 'bg-amber-900/30 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
            <p className={`text-sm font-medium ${theme.isDark ? 'text-amber-200' : 'text-amber-700'}`}>
              Step 2 of 2: Select <span className="font-bold">Sheer Curtain</span> Fabric
            </p>
            <p className={`text-xs mt-1 ${theme.isDark ? 'text-amber-300/60' : 'text-amber-600/60'}`}>
              This fabric will be applied to the center transparent curtain
            </p>
          </div>
        </div>

        {/* Show selected main curtain texture */}
        {mainTexture && (
          <div className={`mt-4 mb-4 p-4 ${theme.isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-lg flex items-center gap-4 border transition-colors duration-300`}>
            <img src={mainTexture} alt="Main curtain texture" className="w-16 h-16 object-cover rounded" />
            <div>
              <p className={`text-sm font-medium ${theme.text}`}>Main Curtain Texture</p>
              <p className={`text-xs ${theme.textMuted}`}>Selected in previous step</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex justify-center mt-4">
          <div className={`flex items-center w-full max-w-md border ${theme.border} rounded-lg px-3 py-2 ${theme.bgInput} transition-all duration-300 focus-within:border-amber-400 ${theme.borderHover} ${theme.shadow}`}>
            <Search className={`${theme.textMuted} mr-2`} size={20} />
            <input
              type="text"
              placeholder="Search sheer fabrics..."
              className={`w-full outline-none bg-transparent ${theme.text} placeholder-gray-400`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Texture grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mt-4">
          {loading ? (
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
                  navigate(`/select-room?type=curtain&texture=${encodeURIComponent(mainTexture)}&texture_secondary=${encodeURIComponent(t.image)}`);
                }}
              />
            ))
          ) : (
            <div className={`col-span-full text-center ${theme.textMuted} py-8`}>No textures found.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SelectSheerTexture;
