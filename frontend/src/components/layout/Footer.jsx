import { MapPin } from "lucide-react";

const Footer = () => {
  return ( 
    <footer className="bg-black text-white py-6 mt-8 fixed-footer">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:justify-center sm:gap-30 items-center">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          <p>Email: info@homemakers.com</p>
          <p>Phone: +91 98807 08008</p>
              <a
                href="https://www.google.com/maps/place/5t+block,+15,+11th+Main+Rd,+5T+Block,+Vishya+Bank+Colony,+DK+Naik+Nagar,+Jayanagar,+Bengaluru,+Karnataka+560041,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-2 text-blue-400 hover:underline"
                title="View location on Google Maps"
              >
                <MapPin size={20} />
                Location
              </a>
        </div>
        <div >
          <ul className="flex flex-col left-1.5" >
            <li>About Us</li>
            <li>Careers</li>
            <li>Blog</li>
            <li>Support</li>
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


