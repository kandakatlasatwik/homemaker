import React from 'react';
import { ShoppingCart, Sun, Moon, LogIn } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const NavBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  return ( 
      <nav className={`fixed-navbar sticky top-0 left-0 w-full z-50 border-b ${theme.navBorder} ${theme.navBg} transition-colors duration-300`}>
      {/* Blurred border highlight */}
        <div className="absolute left-0 right-0 -bottom-1 h-3 pointer-events-none z-0">
          <div className={`w-full h-full ${theme.glow}`} />
      </div>
      <div className={`flex flex-row items-center justify-between px-4 sm:px-8 py-3 h-20 ${theme.navBg} w-full backdrop-blur-md relative z-10 transition-colors duration-300`}>
          <h1
          className={`text-2xl sm:text-3xl font-bold ${theme.navText} rounded-lg attractive-border hover:cursor-pointer cursor-pointer transition-colors duration-300`}
          onClick={() => navigate('/')}
          title="Go to Home"
        >
          Homemakers
        </h1>
        <div className="flex flex-row items-center space-x-4 sm:space-x-6 ml-auto">
              <p 
                className={`${theme.navText} cursor-pointer flex items-center gap-1 ${theme.navHover} transition-colors duration-300`}
                onClick={() => navigate('/cart')}
              >
                <span className="block sm:hidden"><ShoppingCart size={20} /></span>
                <span className="hidden sm:inline-flex items-center hover:cursor"><ShoppingCart size={18} className="mr-1" /> Cart</span>
              </p>
              <button
                onClick={theme.toggleTheme}
                className={`${theme.navText} cursor-pointer flex items-center gap-1 ${theme.navHover} transition-colors duration-300 bg-transparent border-none`}
                aria-label="Toggle theme"
              >
                <span className="block sm:hidden">{theme.isDark ? <Sun size={20} /> : <Moon size={20} />}</span>
                <span className="hidden sm:inline-flex items-center">{theme.isDark ? <><Sun size={18} className="mr-1" /> Light Mode</> : <><Moon size={18} className="mr-1" /> Dark Mode</>}</span>
              </button>
              <button
                onClick={() => navigate('/login-page')}
                className={`flex items-center ${theme.navText} ${theme.navHover} px-2 py-1 rounded transition-colors duration-300`}
                aria-label="Login"
              >
                <span className="block sm:hidden"><LogIn size={20} /></span>
                <span className="hidden sm:inline-flex items-center"><LogIn size={16} className="mr-2" />Login</span>
              </button>
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
