import { MapPin } from "lucide-react";
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const theme = useTheme();
  return ( 
    <footer className={`${theme.footerBg} ${theme.footerText} py-3 mt-8 border-t ${theme.navBorder} transition-colors duration-300`}>
      <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:justify-center sm:gap-20 items-center text-sm">
        <div className="mb-2 sm:mb-0">
          <h2 className={`text-sm font-semibold mb-1 ${theme.footerHover} hover:cursor-pointer transition-colors duration-300`}>Contact</h2>
          <p className={`text-xs ${theme.footerHover} hover:cursor-pointer transition-colors duration-300`}>Email: info@homemakers.com</p>
          <p className={`text-xs ${theme.footerHover} hover:cursor-pointer transition-colors duration-300`}>Phone: +91 98807 08008</p>
              <a
                href="https://www.google.com/maps/place/5t+block,+15,+11th+Main+Rd,+5T+Block,+Vishya+Bank+Colony,+DK+Naik+Nagar,+Jayanagar,+Bengaluru,+Karnataka+560041,+India"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 mt-2 ${theme.accent} hover:underline hover:cursor-pointer ${theme.footerHover} transition-colors duration-300`}
                title="View location on Google Maps"
              >
                <MapPin size={20} />
                Location
              </a>
        </div>
        <div>
          <ul className="flex flex-col left-1.5 hover:cursor-pointer text-xs">
            <li className={`${theme.footerHover} transition-colors duration-300`}>About Us</li>
            <li className={`${theme.footerHover} transition-colors duration-300`}>Careers</li>
            <li className={`${theme.footerHover} transition-colors duration-300`}>Blog</li>
            <li className={`${theme.footerHover} transition-colors duration-300`}>Support</li>
          </ul>
        </div>
      </div>
      <div className={`text-center mt-2 text-xs ${theme.textMuted}`}>
        &copy; 2026 Homemakers. All rights reserved.
      </div>
    </footer>
  ); 
}

export default Footer


