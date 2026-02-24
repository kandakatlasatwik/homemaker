import React, { useState } from "react";
import ProductCard from "../ui/ProductCard";
import TextureCard from "../ui/TextureCard";
import ColorCard from "../ui/ColorCard";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { searchTextures } from "../../utils/searchUtils";

const Hero = ({ type }) => {
  const navigate = useNavigate();
  const handleSofaClick = () => {
    navigate("/select-texture");
  };

  // Texture data
  const textureData = [
    { name: "Velvet Touch", description: "Soft, luxurious velvet texture for premium sofas." },
    { name: "Linen Weave", description: "Classic linen weave, breathable and elegant." },
    { name: "Leather Grain", description: "Durable leather grain for a timeless look." },
    { name: "Suede Finish", description: "Smooth suede finish, perfect for cozy spaces." },
  ];

  const [search, setSearch] = useState("");
  const filteredTextures = type === 'texture' ? searchTextures(textureData, search) : [];
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
              filteredTextures.length > 0 ? (
                filteredTextures.map((t, i) => (
                  <TextureCard key={t.name + i} name={t.name} description={t.description} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-8">No textures found.</div>
              )
            ) : (
              <>
                <ProductCard onClick={handleSofaClick} />
                <ProductCard />
                <ProductCard />
                {type === 'color' && <ColorCard />}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
