import React from 'react';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import ShinyText from '../components/ui/ShinyText';
import { useTheme } from '../context/ThemeContext';

const ContactPage = () => {
  const theme = useTheme();

  return (
    <div className={`min-h-screen flex flex-col pt-20 ${theme.bg} transition-colors duration-300`}>
      <NavBar />

      <main className="flex-1 container mx-auto px-4 py-10 flex items-center justify-center">
        <div className={`hm-card group relative w-full max-w-2xl rounded-2xl p-8 sm:p-10 border ${theme.border} ${theme.bgCard} ${theme.shadowCard} overflow-hidden`}>
          <span className="card-shine" aria-hidden="true" />

          <div className="text-center space-y-5 relative z-10">
            <ShinyText
              text="✨ Shiny Text Effect"
              speed={2}
              delay={0}
              color="#51370b"
              shineColor="#fafffc"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
            />

            <h1 className={`text-3xl sm:text-4xl font-bold ${theme.textHeading}`}>Contact Homemakers</h1>
            <p className={`${theme.textSecondary} text-base sm:text-lg`}>Email: homemakers216@gmail.com</p>
            <p className={`${theme.textSecondary} text-base sm:text-lg`}>Phone: +91 98807 08008</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
