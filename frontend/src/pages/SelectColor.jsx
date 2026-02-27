import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import Hero from '../components/sections/Hero';
import ColorCard from '../components/ui/ColorCard';
import SofaImg from '../assets/images/Sofa.png';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
const SelectColor = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  // Example color data
  const colorData = [
    { name: "Red", description: "Bright and bold red color." },
    { name: "Blue", description: "Calm and cool blue color." },
    { name: "Green", description: "Fresh and vibrant green color." },
  ];
  const filteredColors = colorData.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="sm:text-center mt-2.5">
        <div
          className="text-l ml-2.5 mt-2.5 bg-black rounded-3xl px-3 py-2 text-white inline-block bg-blend-lighten hover:cursor-pointer items-center gap-2"
          onClick={() => navigate('/select-texture')}
        >
          <span className="block sm:hidden"><ArrowLeftCircle size={24} /></span>
          <span className="hidden sm:inline">{'<- Back'}</span>
        </div>
      </div>
      <div className="flex justify-center mt-4 px-2 sm:px-0">
        <div className="flex items-center w-full max-w-md sm:max-w-lg md:max-w-xl border border-gray-300 rounded-lg px-2 sm:px-3 py-2 bg-white transition-all duration-200 focus-within:border-amber-400 hover:border-amber-400 shadow-sm">
          <Search className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            placeholder="Search colors..."
            className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm sm:text-base px-1 sm:px-0"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <section className="w-full bg-white flex-grow">
        <div className="container mx-auto px-4 grid grid-cols-1 gap-8 items-center min-h-[350px]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mt-4">
            {filteredColors.length > 0 ? (
              filteredColors.map((c, i) => {
                const colorHex = c.name === 'Red' ? 'ff0000' : c.name === 'Blue' ? '0077ff' : '33cc66'
                const fabricUrl = `https://via.placeholder.com/512/${colorHex}`
                return (
                  <div key={c.name + i} onClick={() => navigate('/display-image', { state: { base_image_url: SofaImg, fabric_image_url: fabricUrl, object_type: c.name.toLowerCase(), backendUrl: '/generate' } })} className="hover:cursor-pointer">
                    <ColorCard name={c.name} description={c.description} />
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center text-gray-400 py-8">No colors found.</div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default SelectColor
