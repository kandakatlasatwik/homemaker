import React from 'react'
import texture from "../../assets/images/texture1.png";


const TextureCard = () => {
  return (
    <div className="flex justify-center items-center">
      <img
        src={texture}
        alt="texturepng"
        className="w-80 h-80 sm:w-[28rem] sm:h-[28rem] object-cover block rounded-2xl sm:rounded-xl shadow-lg group-hover:ring-primary/80 transition-all duration-300"
      />
    </div>
  );
}

export default TextureCard
