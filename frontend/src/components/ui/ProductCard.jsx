import React from "react";

import sofa1 from "../../assets/images/Sofa.png";

const ProductCard = ({ onClick }) => (
  <div
    className="relative flex group hover:cursor-pointer transform transition-transform duration-300 hover:scale-102 shadow-2xl rounded-2xl sm:rounded-4xl aspect-[4/3] w-full h-full overflow-hidden bg-black"
    onClick={onClick}>
    <img
      src={sofa1}
      alt="Sofa"
      className="w-full h-full object-cover block"
    />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-500 bg-opacity-50 text-gray-100 px-8 py-4 rounded-lg text-2xl font-semibold tracking-wider text-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      SOFA COLLECTIONS
    </div>
  </div>
);

export default ProductCard;
