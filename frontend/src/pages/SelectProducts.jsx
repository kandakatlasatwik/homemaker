import React from 'react'
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero'
import { useTheme } from '../context/ThemeContext';

const SelectProducts = () => {
  const theme = useTheme();
  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      <NavBar />
      <Hero type="product" />
      <Footer />
    </div>
  )
}

export default SelectProducts
