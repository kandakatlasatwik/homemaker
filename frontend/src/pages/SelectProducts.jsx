import React from 'react'
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero'
import { useTheme } from '../context/ThemeContext';
import UploadImage from "./UploadImage";

const SelectProducts = () => {
  const theme = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme.bg} transition-colors duration-300 pt-20`}>

      <NavBar />

      <main className="flex-1 flex flex-col">
        <Hero type="product" />
        <UploadImage />
      </main>

      <Footer />

    </div>
  )
}

export default SelectProducts