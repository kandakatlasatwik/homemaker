import React from 'react'
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import TextureCard from '../components/ui/TextureCard';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';

const SelectTexture = () => {
  const navigate=useNavigate()
  return (
    <>
      <NavBar />
      <div>
        <div className="sm:text-center mt-2.5">
          <div
          className="text-l ml-2.5 mt-2.5 bg-black rounded-3xl px-3 py-2 text-white inline-block bg-blend-lighten hover:cursor-pointer  items-center gap-2"
          onClick={() => navigate('/')}
        >
          <span className="block sm:hidden"><ArrowLeftCircle size={24} /></span>
          <span className="hidden sm:inline">{'<-Back'}</span>
        </div>
        </div>
        <div className="grid grid-cols-1 mt-0 sm:grid-cols-3 gap-8 justify-items-center py-8">
        <TextureCard />
        <TextureCard />
        <TextureCard />
        <TextureCard />
        <TextureCard />
        <TextureCard />
       </div>
      </div>
      <Footer />
    </>
  )
}

export default SelectTexture
