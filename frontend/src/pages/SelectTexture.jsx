import React from 'react'
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import Hero from '../components/sections/Hero';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SelectTexture = () => {
  const navigate=useNavigate()
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const product = params.get('product');
  const theme = useTheme();
  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300 pt-20`}>
      <NavBar />
      <div>
        <div className="sm:text-center mt-2.5">
          <div
          className={`text-l ml-2.5 mt-2.5 rounded-3xl px-3 py-2 inline-flex items-center gap-2 hover:cursor-pointer transition-colors duration-300 ${theme.btnBack}`}
          onClick={() => navigate('/')}
        >
          <span className="block sm:hidden"><ArrowLeftCircle size={24} /></span>
          <span className="hidden sm:inline">{'<-Back'}</span>
        </div>
        </div>
        {product === 'curtain' && (
          <div className="container mx-auto px-4 mt-4">
            <div className={`text-center p-3 rounded-lg ${theme.isDark ? 'bg-amber-900/30 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
              <p className={`text-sm font-medium ${theme.isDark ? 'text-amber-200' : 'text-amber-700'}`}>
                Step 1 of 2: Select <span className="font-bold">Main Curtain</span> Fabric
              </p>
              <p className={`text-xs mt-1 ${theme.isDark ? 'text-amber-300/60' : 'text-amber-600/60'}`}>
                This fabric will be applied to the side curtain panels
              </p>
            </div>
          </div>
        )}
        <Hero type="texture" productType={product} />
      </div>
      <Footer />
    </div>
  )
}

export default SelectTexture
