import React, { useState, useEffect, useReducer, useCallback } from "react";
import ProductCard from "../ui/ProductCard";
import TextureCard from "../ui/TextureCard";
import { Search, Loader2 } from "lucide-react";
import { searchTextures } from "../../utils/searchUtils";
import bedImage from "../../assets/images/bed.png";

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
      fetchFabrics(productType);
    }
  }, [type, productType, fetchFabrics]);

  const { data: fabrics, loading, error } = state;
  const filteredTextures = type === 'texture' ? searchTextures(fabrics, search) : [];
  return (
    <section className="w-full  bg-white ">
      <div className="container mx-auto px-4 grid grid-cols-1   gap-8 items-center min-h-[350px]">
        <div className="flex flex-col justify-center space-y-4">
          {type !== 'texture' && (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mt-8">Welcome to Homemakers</h1>
              <p className="text-lg text-gray-600 text-center">Your one-stop shop for home essentials.</p>
            </>
          )}
          {type === 'texture' && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 bg-white transition-all duration-200 focus-within:border-amber-400 hover:border-amber-400 shadow-sm">
                <Search className="text-gray-400 mr-2" size={20} />
                <input
                  type="text"
                  placeholder="Search textures..."
                  className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className=" grid grid-cols-1 gap-5  sm:grid sm:grid-cols-3 mt-4 ">
            {type === 'texture' ? (
              loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader2 className="animate-spin text-amber-500" size={36} />
                </div>
              ) : error ? (
                <div className="col-span-full text-center text-red-400 py-8">{error}</div>
              ) : filteredTextures.length > 0 ? (
                filteredTextures.map((t) => (
                  <TextureCard
                    key={t.id}
                    name={t.name}
                    description={`${t.texture} · ${t.color}`}
                    image={t.image}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-8">No textures found.</div>
              )
            ) : (
              <>
                <ProductCard type="sofa" />
                <ProductCard type="bed" image={bedImage} />
                <ProductCard />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
