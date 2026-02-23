import React from 'react';
import { ShoppingCart, Sun } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  return ( 
    <nav className="fixed-navbar">
      <div className="flex flex-row items-center justify-between px-4 sm:px-8 py-3 h-20 bg-black w-full">
        <h1
          className="text-2xl sm:text-3xl font-bold text-white rounded-lg attractive-border hover:cursor-pointer cursor-pointer"
          onClick={() => navigate('/')}
          title="Go to Home"
        >
          Homemakers
        </h1>
        <div className="flex flex-row items-center space-x-4 sm:space-x-6 ml-auto">
              <p className="text-white cursor-pointer flex items-center gap-1 hover:text-amber-200">
                <span className="block sm:hidden"><ShoppingCart size={20} /></span>
                <span className="hidden sm:inline-flex items-center hover:cursor"><ShoppingCart size={18} className="mr-1" /> Cart</span>
              </p>
              <p className="text-white cursor-pointer flex items-center gap-1 hover:text-amber-200">
                <span className="block sm:hidden"><Sun size={20} /></span>
                <span className="hidden sm:inline-flex items-center"><Sun size={18} className="mr-1" /> Light Mode</span>
              </p>
        </div>
      </div>
    </nav>
  ); 
}

export default NavBar;

// Add the following CSS to App.css or Index.css:
// .fixed-navbar {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   background: #000;
//   z-index: 1000;
// }
