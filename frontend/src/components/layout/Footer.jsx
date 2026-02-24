import { MapPin } from "lucide-react";

const Footer = () => {
  return ( 
    <footer className="bg-black text-white py-6  fixed-footer mt-8">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:justify-center sm:gap-30 items-center">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-lg font-semibold mb-2 hover:text-amber-200 hover:cursor-pointer">Contact</h2>
          <p className="hover:text-amber-200 hover:cursor-pointer">Email: info@homemakers.com</p>
          <p className="hover:text-amber-200 hover:cursor-pointer">Phone: +91 98807 08008</p>
              <a
                href="https://www.google.com/maps/place/5t+block,+15,+11th+Main+Rd,+5T+Block,+Vishya+Bank+Colony,+DK+Naik+Nagar,+Jayanagar,+Bengaluru,+Karnataka+560041,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-2 text-blue-400 hover:underline hover:cursor-pointer hover:text-amber-200"
                title="View location on Google Maps"
              >
                <MapPin size={20} />
                Location
              </a>
        </div>
        <div >
          <ul className="flex flex-col left-1.5 hover:cursor-pointer" >
            <li className="hover:text-amber-200">About Us</li>
            <li className="hover:text-amber-200">Careers</li>
            <li className="hover:text-amber-200">Blog</li>
            <li className="hover:text-amber-200">Support</li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-6 text-xs opacity-70">
        &copy; 2026 Homemakers. All rights reserved.
      </div>
    </footer>
  ); 
}

export default Footer


